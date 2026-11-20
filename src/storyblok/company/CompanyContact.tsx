import { Section } from './utils';
import SmartLink from '../shared/SmartLink';
import { asArray, linkUrl } from '../shared/helpers';
import type { ContactBlok } from '../types';

// FR-CO-15: contact information and social links.
export default function CompanyContact({ blok }: { blok: ContactBlok }) {
	const socials = asArray(blok.social_links).filter((s) => s.platform && linkUrl(s.url));
	const hasData = Boolean(
		blok.email || blok.phone || blok.address || blok.support_hours || socials.length,
	);
	return (
		<Section blok={blok} hasData={hasData}>
			<div className="co-card">
				<dl className="co-contact">
					{blok.email && (
						<div>
							<dt>Email</dt>
							<dd>
								<a href={`mailto:${blok.email}`}>{blok.email}</a>
							</dd>
						</div>
					)}
					{blok.phone && (
						<div>
							<dt>Phone</dt>
							<dd>
								<a href={`tel:${blok.phone.replace(/\s+/g, '')}`} className="data">
									{blok.phone}
								</a>
							</dd>
						</div>
					)}
					{blok.address && (
						<div>
							<dt>Address</dt>
							<dd>{blok.address}</dd>
						</div>
					)}
					{blok.support_hours && (
						<div>
							<dt>Support hours</dt>
							<dd>{blok.support_hours}</dd>
						</div>
					)}
				</dl>
				{socials.length > 0 && (
					<ul className="co-socials">
						{socials.map((s) => (
							<li key={s._uid}>
								<SmartLink to={linkUrl(s.url)} newTab className="co-btn co-btn--secondary">
									{s.platform}
								</SmartLink>
							</li>
						))}
					</ul>
				)}
			</div>
		</Section>
	);
}
