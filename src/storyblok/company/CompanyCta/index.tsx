import { Section } from '../Section';
import SmartLink from '../../shared/SmartLink';
import { linkUrl } from '../../shared/helpers';
import type { CtaBlok } from '../../types';
import './CompanyCta.css';

// FR-CO-16: "Explore Destinations" call to action, defaulting to the Destinations Catalog.
export default function CompanyCta({ blok }: { blok: CtaBlok }) {
	const target = linkUrl(blok.target) || '/destinations';
	return (
		<Section blok={blok} className="co-cta">
			<SmartLink
				to={target}
				className={`co-btn ${blok.style === 'secondary' ? 'co-btn--secondary' : 'co-btn--primary'}`}
			>
				{blok.label || 'Explore Destinations'}
			</SmartLink>
		</Section>
	);
}
