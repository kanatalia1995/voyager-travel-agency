import { storyblokEditable } from '@storyblok/react';
import SmartLink from '../SmartLink/SmartLink';
import { linkUrl } from '../../helpers/helpers';
import type { AgencyCtaBlok } from '../types';
import './AgencyCta.css';

/** Call-to-action button: primary (gradient) or secondary (outlined). Renders nothing without a label and link. */
export default function AgencyCta({ blok }: { blok: AgencyCtaBlok }) {
	const to = linkUrl(blok.link);
	if (!blok.label || !to) return null;
	return (
		<SmartLink
			{...storyblokEditable(blok)}
			to={to}
			className={`agency-cta ${blok.type === 'secondary' ? 'agency-cta--secondary' : 'agency-cta--primary'}`}
		>
			{blok.label}
		</SmartLink>
	);
}
