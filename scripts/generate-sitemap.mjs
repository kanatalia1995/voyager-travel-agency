// Generates public/sitemap.xml (from Storyblok's Links API) and public/robots.txt. Runs automatically before `npm run build`.
// Needs STORYBLOK_DELIVERY_API_TOKEN. Region: STORYBLOK_REGION (default eu).
// Site URL: SITE_URL, else Vercel's production domain, else https://localhost:5173.
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Stories that are CMS configuration, not pages people visit. */
export const EXCLUDED_SLUGS = ['navigation', 'error-page'];

const API_HOSTS = {
	eu: 'https://api.storyblok.com',
	us: 'https://api-us.storyblok.com',
	ca: 'https://api-ca.storyblok.com',
	ap: 'https://api-ap.storyblok.com',
	cn: 'https://api.storyblokchina.cn',
};
const PER_PAGE = 1000;

const escapeXml = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** The app renders the `home` story at `/`, every other story at `/<slug>`. */
export const toPath = (link) => (link.slug === 'home' ? '/' : `/${link.slug}`);

export function buildSitemap(links, siteUrl) {
	const origin = siteUrl.replace(/\/+$/, '');
	const entries = links
		.filter((l) => !l.is_folder && l.published !== false && !EXCLUDED_SLUGS.includes(l.slug))
		.sort((a, b) => toPath(a).localeCompare(toPath(b)))
		.map((l) => {
			const lastmod = (l.published_at || l.updated_at || '').slice(0, 10);
			return `  <url>\n    <loc>${escapeXml(origin + toPath(l))}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
		});
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

/** Production: crawlable, points to the sitemap. Vercel preview/development deployments: blocked. */
export function buildRobots(siteUrl, vercelEnv) {
	if (vercelEnv && vercelEnv !== 'production') return 'User-agent: *\nDisallow: /\n';
	return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl.replace(/\/+$/, '')}/sitemap.xml\n`;
}

async function fetchLinks({ token, region, version }) {
	const host = API_HOSTS[region] ?? API_HOSTS.eu;
	const links = [];
	for (let page = 1; ; page++) {
		const url = `${host}/v2/cdn/links?token=${encodeURIComponent(token)}&version=${version}&per_page=${PER_PAGE}&page=${page}&include_dates=1`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Storyblok Links API responded ${res.status}`);
		const batch = Object.values((await res.json()).links ?? {});
		links.push(...batch);
		if (batch.length < PER_PAGE) return links;
	}
}

async function main() {
	try {
		process.loadEnvFile('.env'); // Vercel provides real env vars; locally they come from .env.
	} catch {
		// No .env file: rely on the process environment.
	}
	const token = process.env.STORYBLOK_DELIVERY_API_TOKEN;
	const siteUrl =
		process.env.SITE_URL ||
		(process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
		'https://localhost:5173';
	writeFileSync('public/robots.txt', buildRobots(siteUrl, process.env.VERCEL_ENV));
	console.log(`[robots] Wrote public/robots.txt (${process.env.VERCEL_ENV || 'no VERCEL_ENV'}).`);
	if (!token) {
		console.warn('[sitemap] STORYBLOK_DELIVERY_API_TOKEN is not set. Skipping sitemap generation.');
		return;
	}
	try {
		// Only published stories belong in a sitemap, whatever STORYBLOK_VERSION the site renders with.
		const links = await fetchLinks({ token, region: process.env.STORYBLOK_REGION || 'eu', version: 'published' });
		const xml = buildSitemap(links, siteUrl);
		writeFileSync('public/sitemap.xml', xml);
		console.log(`[sitemap] Wrote public/sitemap.xml (${(xml.match(/<url>/g) ?? []).length} URLs, ${siteUrl}).`);
	} catch (error) {
		// A sitemap problem must not break the deploy.
		console.warn(`[sitemap] Could not generate the sitemap: ${error.message}`);
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
