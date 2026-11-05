// The canonical origin. NEXTAUTH_URL is the site's public address and has to be
// correct for login anyway, so it doubles as the single place the domain is set.
export const siteUrl = (process.env.NEXTAUTH_URL ?? "https://makaramen.bg").replace(/\/$/, "");
