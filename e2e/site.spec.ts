import { expect, test, type Page } from "@playwright/test";

/** Swipes down inside the panel with real touch input (mobile emulation only). */
async function swipeDown(page: Page, startY: number, distance: number) {
  const cdp = await page.context().newCDPSession(page);
  const touch = (y: number) => [{ x: 200, y }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: touch(startY) });
  for (let step = 1; step <= 6; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: touch(startY + (distance * step) / 6),
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

test.describe("public site", () => {
  test("the home page loads and shows the hero", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByTestId("hero");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText("MAKA RAMEN");
    await expect(hero.getByRole("img")).toBeVisible();
    expect(await hero.getByRole("img").evaluate((image: HTMLImageElement) => image.sizes)).toBe("100vw");
  });

  test("the menu shows at least one item, with name and price", async ({ page }) => {
    await page.goto("/restaurant");
    const items = page.getByRole("article");
    expect(await items.count()).toBeGreaterThan(0);
    await expect(items.first()).toContainText("Тонкоцу Шою");
    await expect(items.first()).toContainText("12 € / 23.47 лв");
  });

  test("the category bar jumps to a category", async ({ page }) => {
    await page.goto("/restaurant");
    await page.getByRole("navigation", { name: "Категории" }).getByRole("link", { name: "Саке" }).click();
    await expect(page).toHaveURL(/#sake$/);
    await expect(page.getByRole("heading", { name: "Саке", level: 2 })).toBeInViewport();
  });

  test("opening an item shows the details panel, and the close button closes it", async ({ page }) => {
    await page.goto("/restaurant");
    await page.getByRole("button", { name: "Тонкоцу Шою" }).click();

    const panel = page.getByRole("dialog");
    await expect(panel.getByRole("heading", { name: "Тонкоцу Шою" })).toBeVisible();
    await expect(panel).toContainText("Свински бульон");
    await expect(panel).toContainText("Алергени");
    await expect(panel.getByRole("img")).toBeVisible();

    await panel.getByRole("button", { name: "Затвори" }).click();
    await expect(panel).toBeHidden();
  });

  test("Esc closes the details panel", async ({ page }) => {
    await page.goto("/restaurant");
    await page.getByRole("button", { name: "Тонкоцу Шою" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("swiping down closes the details panel on a phone, a short swipe doesn't", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch gesture");
    await page.goto("/restaurant");
    await page.getByRole("button", { name: "Тонкоцу Шою" }).click();
    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    await page.waitForTimeout(300); // let the slide-up animation finish before measuring
    const box = await panel.boundingBox();
    const startY = box!.y + 60;

    await swipeDown(page, startY, 40);
    await page.waitForTimeout(300);
    await expect(panel).toBeVisible();

    await swipeDown(page, startY, 220);
    await expect(panel).toBeHidden();
  });

  test("a menu description is in the server-rendered HTML, for search engines", async ({ request }) => {
    const html = await (await request.get("/restaurant")).text();
    expect(html).toContain("Свински бульон, Шою таре");
    expect(html).toContain('"@type":"Menu"');
    expect(html).toContain('"@type":"MenuItem"');
  });

  test("visitors reach us by phone: there are no forms and no form endpoints", async ({ page, request }) => {
    for (const path of ["/catering", "/contacts"]) {
      await page.goto(path);
      await expect(page.locator("main form")).toHaveCount(0);
      await expect(page.locator('main a[href^="tel:"]').first()).toBeVisible();
    }
    for (const endpoint of ["/api/contact", "/api/catering-inquiry"]) {
      expect((await request.post(endpoint, { data: {} })).status()).toBe(404);
    }
  });

  test("an unknown address gets the 404 page", async ({ page }) => {
    const response = await page.goto("/nyama-takava-stranitsa");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("няма в менюто");
  });

  test("share tags, robots and sitemap are in place", async ({ page, request }) => {
    await page.goto("/restaurant");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/restaurant");
  });
});
