import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { storyblokEditable } from '@storyblok/react';
import SmartLink from '../../shared/SmartLink';
import LanguageSelect from '../LanguageSelect';
import { asArray, linkUrl } from '../../shared/helpers';
import { useLanguage } from '../../../language';
import type { NavigationHeaderBlok } from '../../types';
import './NavigationHeader.css';

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

/** Site-wide header: company name, configurable tabs and a language switcher. Sticks to the top on scroll. */
export default function NavigationHeader({ blok }: { blok: NavigationHeaderBlok }) {
	const { pathname } = useLocation();
	const { language, setLanguage } = useLanguage();
	const [menuOpen, setMenuOpen] = useState(false);

	const tabs = asArray(blok.tabs).filter((tab) => tab.label && linkUrl(tab.link));
	const languages = asArray(blok.languages).filter((l) => l.label);

	// Close the mobile menu with Escape.
	useEffect(() => {
		if (!menuOpen) return;
		const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [menuOpen]);

	return (
		<header {...storyblokEditable(blok)} className="site-nav">
			<div className="site-nav__bar">
				<SmartLink to={linkUrl(blok.brand_link) || '/'} className="site-nav__brand" onClick={() => setMenuOpen(false)}>
					{blok.logo?.filename && (
						<img src={blok.logo.filename} alt="" className="site-nav__logo" />
					)}
					<span>{blok.company_name}</span>
				</SmartLink>

				<nav className="site-nav__tabs" aria-label="Main">
					<ul id="site-nav-menu" className={menuOpen ? 'is-open' : undefined}>
						{tabs.map((tab) => {
							const url = linkUrl(tab.link);
							const current = !tab.open_in_new_tab && normalize(pathname) === normalize(url);
							return (
								<li key={tab._uid} {...storyblokEditable(tab)}>
									<SmartLink
										to={url}
										newTab={tab.open_in_new_tab}
										className="site-nav__tab"
										aria-current={current ? 'page' : undefined}
										onClick={() => setMenuOpen(false)}
									>
										{tab.icon?.filename && <img src={tab.icon.filename} alt="" width="20" height="20" />}
										{tab.label}
									</SmartLink>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="site-nav__actions">
					{languages.length > 1 && (
						<LanguageSelect languages={languages} value={language} onChange={setLanguage} />
					)}
					{tabs.length > 0 && (
						<button
							type="button"
							className="site-nav__toggle"
							aria-expanded={menuOpen}
							aria-controls="site-nav-menu"
							onClick={() => setMenuOpen((open) => !open)}
						>
							<span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
							<span aria-hidden="true" className="site-nav__burger" />
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
