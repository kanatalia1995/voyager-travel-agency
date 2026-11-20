import { storyblokEditable } from '@storyblok/react';
import { Section } from './utils';
import { asArray } from '../shared/helpers';
import type { CertificationBlok, SafetyBlok } from '../types';

// A certification is valid when it has no expiration date or the date is today or later.
const isValid = (cert: CertificationBlok) => !cert.expiration_date || new Date(cert.expiration_date) >= new Date();

// FR-CO-08 / FR-CO-09: certifications with name, authority and badge; expired ones are hidden.
export default function CompanySafety({ blok }: { blok: SafetyBlok }) {
	const certs = asArray(blok.certifications).filter((c) => c.name && isValid(c));
	return (
		<Section blok={blok} hasData={certs.length > 0}>
			<ul className="co-grid">
				{certs.map((c) => (
					<li key={c._uid} {...storyblokEditable(c)} className="co-card co-cert">
						{c.badge?.filename && <img src={c.badge.filename} alt="" loading="lazy" />}
						<div>
							<h3>{c.name}</h3>
							{c.issuing_authority && <p>{c.issuing_authority}</p>}
						</div>
					</li>
				))}
			</ul>
		</Section>
	);
}
