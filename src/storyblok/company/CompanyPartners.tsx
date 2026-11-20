import { storyblokEditable } from '@storyblok/react';
import { Section } from './utils';
import SmartLink from '../shared/SmartLink';
import { asArray, linkUrl } from '../shared/helpers';
import type { PartnersBlok } from '../types';

// FR-CO-12: partner logos, each linking to the partner's website.
export default function CompanyPartners({ blok }: { blok: PartnersBlok }) {
	const partners = asArray(blok.partners).filter((p) => p.name && p.logo?.filename);
	return (
		<Section blok={blok} hasData={partners.length > 0}>
			<ul className="co-grid">
				{partners.map((p) => {
					const url = linkUrl(p.website);
					const logo = <img src={p.logo?.filename ?? undefined} alt={p.logo?.alt || p.name} loading="lazy" />;
					return (
						<li key={p._uid} {...storyblokEditable(p)} className="co-card co-partner">
							{url ? (
								<SmartLink to={url} newTab>
									{logo}
								</SmartLink>
							) : (
								logo
							)}
						</li>
					);
				})}
			</ul>
		</Section>
	);
}
