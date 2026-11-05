import { expect, test, type Locator, type Page } from "@playwright/test";

const username = process.env.E2E_ADMIN_USERNAME ?? "admin";
const password = process.env.E2E_ADMIN_PASSWORD ?? "e2e-only-password-123";

// 1x1 PNG, used for both the "file" being uploaded and the images Cloudinary would serve.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/** Our error messages. Plain getByRole("alert") also matches Next's route announcer. */
function alertIn(scope: Page | Locator) {
  return scope.locator('p[role="alert"]');
}

async function logIn(page: Page, target = "/admin") {
  await page.goto(`/login?callbackUrl=${encodeURIComponent(target)}`);
  await page.getByLabel("Потребителско име").fill(username);
  await page.getByLabel("Парола").fill(password);
  await page.getByRole("button", { name: "Вход" }).click();
  await page.waitForURL(`**${target}`);
}

/** Stands in for Cloudinary: tests must not depend on a real account. */
async function fakeCloudinary(page: Page, seenUploads: string[] = []) {
  let counter = 0;
  await page.route("https://api.cloudinary.com/**", async (route) => {
    const request = route.request();
    seenUploads.push(request.postData() ?? "");
    counter += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ public_id: `maka/test/${Date.now()}-${counter}`, width: 1600, height: 1200 }),
    });
  });
  await page.route("https://res.cloudinary.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PNG }),
  );
}

test.describe("access control", () => {
  test("/admin redirects to the login page when not signed in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);
    await expect(page.getByRole("button", { name: "Вход" })).toBeVisible();
  });

  test("/admin answers with a redirect, not a page", async ({ request }) => {
    const response = await request.get("/admin/gallery", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain("/login");
  });

  test("the upload signature is refused without a session", async ({ request }) => {
    const response = await request.post("/api/upload-signature", { data: { folder: "gallery" } });
    expect(response.status()).toBe(401);
    expect(JSON.stringify(await response.json())).not.toContain("signature");
  });

  test("a wrong password is refused, and the sixth attempt is rate limited", async ({ browser, baseURL }, testInfo) => {
    // Its own client IP and username, so this doesn't lock out the other tests.
    const context = await browser.newContext({
      baseURL,
      extraHTTPHeaders: { "x-forwarded-for": `198.51.100.${testInfo.project.name === "phone" ? 2 : 1}` },
    });
    const page = await context.newPage();
    await page.goto("/login");

    for (let attempt = 1; attempt <= 5; attempt++) {
      await page.getByLabel("Потребителско име").fill(`nobody-${testInfo.project.name}`);
      await page.getByLabel("Парола").fill("wrong-password");
      await page.getByRole("button", { name: "Вход" }).click();
      await expect(alertIn(page)).toContainText("Грешно потребителско име или парола");
      await expect(page.getByRole("button", { name: "Вход" })).toBeEnabled();
    }

    await page.getByRole("button", { name: "Вход" }).click();
    await expect(alertIn(page)).toContainText("Твърде много опити");
    await context.close();
  });

  test("the session cookie is httpOnly and nothing is kept in localStorage", async ({ page, context }) => {
    await logIn(page);
    const cookie = (await context.cookies()).find((candidate) => candidate.name.includes("session-token"));
    expect(cookie?.httpOnly).toBe(true);
    expect(await page.evaluate(() => Object.keys(localStorage))).not.toContainEqual(expect.stringMatching(/token|session/i));
  });

  test("the signature is issued once signed in, and doesn't contain the secret", async ({ page }) => {
    await logIn(page);
    const body = await page.evaluate(async () => {
      const response = await fetch("/api/upload-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "gallery" }),
      });
      return { status: response.status, text: await response.text() };
    });
    expect(body.status).toBe(200);
    const signature = JSON.parse(body.text);
    expect(signature.signature).toMatch(/^[0-9a-f]{40}$/);
    expect(signature.params.allowed_formats).toContain("heic");
    expect(body.text).not.toContain(process.env.CLOUDINARY_API_SECRET ?? "ci-only-api-secret");
  });
});

test.describe("client workflows", () => {
  test("changing a price shows on the public menu right away, then it can be restored", async ({ page }) => {
    await logIn(page, "/admin/menu");
    const row = page.getByTestId("admin-menu-item").filter({ hasText: "Телешки" });
    await row.getByRole("link", { name: "Редактирай" }).click();

    await page.getByLabel("Цена в евро").fill("15,5");
    await expect(page.getByLabel("Цена в лева")).toHaveValue("30.32");
    await expect(page.getByTestId("item-preview")).toContainText("15.5 € / 30.32 лв");
    await page.getByRole("button", { name: "Запази" }).click();
    await expect(page.getByRole("status")).toContainText("Запазено");

    await page.goto("/restaurant");
    await expect(page.getByRole("article").filter({ hasText: "Телешки" })).toContainText("15.5 € / 30.32 лв");

    await page.goto("/admin/menu");
    await page.getByTestId("admin-menu-item").filter({ hasText: "Телешки" }).getByRole("link", { name: "Редактирай" }).click();
    await page.getByLabel("Цена в евро").fill("13");
    await page.getByLabel("Цена в лева").fill("25.42");
    await page.getByRole("button", { name: "Запази" }).click();
    await expect(page.getByRole("status")).toContainText("Запазено");
  });

  test("hiding an item removes it from the public menu", async ({ page }) => {
    await logIn(page, "/admin/menu");
    const row = page.getByTestId("admin-menu-item").filter({ hasText: "Веджи" });
    await row.getByRole("button", { name: "Скрий" }).click();
    await expect(row.getByRole("button", { name: "Покажи" })).toBeVisible();

    await page.goto("/restaurant");
    await expect(page.getByRole("article").filter({ hasText: "Веджи" })).toHaveCount(0);

    await page.goto("/admin/menu");
    const hiddenRow = page.getByTestId("admin-menu-item").filter({ hasText: "Веджи" });
    await hiddenRow.getByRole("button", { name: "Покажи" }).click();
    await expect(hiddenRow.getByRole("button", { name: "Скрий" })).toBeVisible();
    await page.goto("/restaurant");
    await expect(page.getByRole("article").filter({ hasText: "Веджи" })).toHaveCount(1);
  });

  test("a new item can be added with its own photo, shown, and deleted", async ({ page }, testInfo) => {
    await fakeCloudinary(page);
    const name = `Тестов артикул ${testInfo.project.name}`;
    await logIn(page, "/admin/menu/new");

    await page.getByLabel("Име", { exact: true }).fill(name);
    await page.getByLabel("Цена в евро").fill("9");
    await page.getByTestId("item-file-input").setInputFiles({ name: "dish.png", mimeType: "image/png", buffer: PNG });
    await expect(page.getByRole("button", { name: "Смени снимката" })).toBeVisible();
    await page.getByLabel("Описание на снимката").fill("Тестово ястие в бяла купа");
    await page.getByRole("button", { name: "Запази" }).click();
    await expect(page.getByRole("status")).toContainText("Запазено");

    await page.route("https://res.cloudinary.com/**", (route) =>
      route.fulfill({ status: 200, contentType: "image/png", body: PNG }),
    );
    await page.goto("/restaurant");
    const card = page.getByRole("article").filter({ hasText: name });
    const image = card.getByRole("img", { name: "Тестово ястие в бяла купа" });
    await expect(image).toBeVisible();
    expect(await image.getAttribute("src")).toContain("/image/upload/f_auto,q_auto,");

    await page.goto("/admin/menu");
    await page.getByTestId("admin-menu-item").filter({ hasText: name }).getByRole("link", { name: "Редактирай" }).click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Изтрий" }).click();
    await page.waitForURL("**/admin/menu");
    await expect(page.getByTestId("admin-menu-item").filter({ hasText: name })).toHaveCount(0);
  });

  test("five photos can be uploaded, described, published, reordered and removed", async ({ page }, testInfo) => {
    const uploads: string[] = [];
    await fakeCloudinary(page, uploads);
    await logIn(page, "/admin/gallery");

    const before = await page.getByTestId("gallery-photo").count();
    await page.getByTestId("gallery-file-input").setInputFiles(
      Array.from({ length: 5 }, (_, index) => ({
        name: `event-${index + 1}.jpg`,
        mimeType: "image/jpeg",
        buffer: PNG,
      })),
    );

    const photos = page.getByTestId("gallery-photo");
    await expect(photos).toHaveCount(before + 5);
    await expect(page.getByTestId("upload-row")).toHaveCount(0);
    expect(uploads).toHaveLength(5);
    await expect(photos.nth(0)).toContainText("Липсва описание");

    // A photo can't go on the site without a description.
    await photos.nth(0).getByRole("button", { name: "Покажи на сайта" }).click();
    await expect(alertIn(photos.nth(0))).toContainText("Напишете описание");

    const label = `${testInfo.project.name} снимка`;
    for (let index = 0; index < 5; index++) {
      const photo = photos.nth(index);
      await photo.getByLabel("Описание (задължително)").fill(`${label} ${index + 1}`);
      await photo.getByRole("button", { name: "Покажи на сайта" }).click();
      await expect(photo.getByRole("button", { name: "Скрий от сайта" })).toBeVisible();
    }

    // Reorder: the second becomes first.
    await photos.nth(1).getByRole("button", { name: "Премести напред" }).click();
    await expect(photos.nth(0).getByLabel("Описание (задължително)")).toHaveValue(`${label} 2`);

    await page.goto("/catering");
    const gallery = page.getByTestId("event-gallery");
    await expect(gallery.getByRole("img", { name: new RegExp(label) })).toHaveCount(5);
    await expect(gallery.getByRole("img").first()).toHaveAttribute("alt", `${label} 2`);

    await page.goto("/admin/gallery");
    await expect(page.getByTestId("gallery-photo").nth(0).getByLabel("Описание (задължително)")).toHaveValue(`${label} 2`);

    // Hide keeps the photo; delete asks first, and declining keeps it too.
    const first = page.getByTestId("gallery-photo").nth(0);
    await first.getByRole("button", { name: "Скрий от сайта" }).click();
    await expect(first.getByRole("button", { name: "Покажи на сайта" })).toBeVisible();
    page.once("dialog", (dialog) => dialog.dismiss());
    await first.getByRole("button", { name: "Изтрий" }).click();
    await expect(page.getByTestId("gallery-photo")).toHaveCount(before + 5);

    for (let remaining = 5; remaining > 0; remaining--) {
      page.once("dialog", (dialog) => dialog.accept());
      await page.getByTestId("gallery-photo").nth(0).getByRole("button", { name: "Изтрий" }).click();
      await expect(page.getByTestId("gallery-photo")).toHaveCount(before + remaining - 1);
    }
  });

  test("clear messages for a file too large, a wrong format and no connection", async ({ page, context }) => {
    await logIn(page, "/admin/gallery");
    const input = page.getByTestId("gallery-file-input");

    await input.setInputFiles({
      name: "huge.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.alloc(21 * 1024 * 1024),
    });
    await expect(alertIn(page)).toContainText("твърде голям файл");

    await input.setInputFiles({ name: "menu.pdf", mimeType: "application/pdf", buffer: PNG });
    await expect(alertIn(page)).toContainText("не е поддържан формат");

    await context.setOffline(true);
    await input.setInputFiles({ name: "photo.jpg", mimeType: "image/jpeg", buffer: PNG });
    await expect(alertIn(page.getByTestId("upload-row"))).toContainText("Няма връзка");
    await context.setOffline(false);
    await page.getByTestId("upload-row").getByRole("button", { name: "Премахни" }).click();
    await expect(page.getByTestId("upload-row")).toHaveCount(0);
  });

  test("a Cloudinary rejection reaches the client in plain words", async ({ page }) => {
    await page.route("https://api.cloudinary.com/**", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify({ error: { message: "File size too large. Got 12000000. Maximum is 10485760." } }),
      }),
    );
    await logIn(page, "/admin/gallery");
    await page.getByTestId("gallery-file-input").setInputFiles({ name: "big.jpg", mimeType: "image/jpeg", buffer: PNG });
    await expect(alertIn(page.getByTestId("upload-row"))).toContainText("плана в Cloudinary");
    await page.getByTestId("upload-row").getByRole("button", { name: "Премахни" }).click();
  });

  test("a category can be added, hidden and deleted", async ({ page }, testInfo) => {
    const name = `Тестова категория ${testInfo.project.name}`;
    await logIn(page, "/admin/categories");

    const form = page.locator("form").filter({ hasText: "Нова категория" });
    await form.getByLabel("Име").fill(name);
    await form.getByRole("button", { name: "Добави" }).click();

    const row = page.getByTestId("admin-category").filter({ has: page.locator(`input[value="${name}"]`) });
    await expect(row).toHaveCount(1);
    await row.getByRole("button", { name: "Скрий" }).click();
    await expect(row.getByRole("button", { name: "Покажи" })).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await row.getByRole("button", { name: "Изтрий" }).click();
    await expect(row).toHaveCount(0);
  });

  test("a non-empty category can't be deleted from the interface", async ({ page }) => {
    await logIn(page, "/admin/categories");
    const row = page.getByTestId("admin-category").filter({ has: page.locator('input[value="Рамен"]') });
    await expect(row.getByRole("button", { name: "Изтрий" })).toHaveCount(0);
  });
});
