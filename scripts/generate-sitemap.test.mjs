import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRobots, buildSitemap } from './generate-sitemap.mjs';

const links = [
	{ slug: 'home', is_folder: false, published: true, published_at: '2026-11-20T10:00:00.000Z' },
	{ slug: 'company-overview', is_folder: false, published: true, updated_at: '2026-11-21T09:00:00.000Z' },
	{ slug: 'navigation', is_folder: false, published: true },
	{ slug: 'error-page', is_folder: false, published: true },
	{ slug: 'blog', is_folder: true, published: true },
	{ slug: 'draft-only', is_folder: false, published: false },
	{ slug: 'a&b', is_folder: false, published: true },
];

test('builds a sitemap of published pages only', () => {
	const xml = buildSitemap(links, 'https://example.com/');
	assert.match(xml, /<loc>https:\/\/example\.com\/<\/loc>\s*<lastmod>2026-11-20<\/lastmod>/); // home -> "/"
	assert.match(xml, /<loc>https:\/\/example\.com\/company-overview<\/loc>\s*<lastmod>2026-11-21<\/lastmod>/);
	assert.match(xml, /<loc>https:\/\/example\.com\/a&amp;b<\/loc>/); // escaped
	for (const hidden of ['navigation', 'error-page', 'blog', 'draft-only']) assert.ok(!xml.includes(`/${hidden}<`), hidden);
	assert.equal((xml.match(/<url>/g) ?? []).length, 3);
});

test('robots.txt allows production and blocks previews', () => {
	assert.equal(
		buildRobots('https://example.com/', 'production'),
		'User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n',
	);
	assert.equal(buildRobots('https://example.com', 'preview'), 'User-agent: *\nDisallow: /\n');
	assert.match(buildRobots('https://example.com', undefined), /Allow: \//); // not on Vercel: allowed
});
