import { storyblokEditable } from '@storyblok/react';
import { Section } from '../Section';
import SmartLink from '../../shared/SmartLink';
import { asArray, linkUrl } from '../../shared/helpers';
import type { TeamBlok } from '../../types';
import './CompanyTeam.css';

// FR-CO-06 / FR-CO-07: leadership team in editor order; profile link opens in a new tab.
export default function CompanyTeam({ blok }: { blok: TeamBlok }) {
	const members = asArray(blok.members).filter((m) => m.full_name);
	return (
		<Section blok={blok} hasData={members.length > 0}>
			<ul className="co-grid">
				{members.map((m) => {
					const profile = linkUrl(m.profile_link);
					return (
						<li key={m._uid} {...storyblokEditable(m)} className="co-card">
							{m.photo?.filename && (
								<img
									className="co-photo"
									src={m.photo.filename}
									alt={m.photo.alt || `Portrait of ${m.full_name}`}
									loading="lazy"
								/>
							)}
							<h3>{m.full_name}</h3>
							{m.role && <div className="co-role">{m.role}</div>}
							{m.bio && <p>{m.bio}</p>}
							{profile && (
								<p>
									<SmartLink to={profile} newTab>
										View profile<span className="sr-only"> of {m.full_name} (opens in a new tab)</span>
									</SmartLink>
								</p>
							)}
						</li>
					);
				})}
			</ul>
		</Section>
	);
}
