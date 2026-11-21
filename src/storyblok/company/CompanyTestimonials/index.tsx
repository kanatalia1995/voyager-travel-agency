import { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import { Section } from '../Section';
import { asArray } from '../../shared/helpers';
import type { TestimonialsBlok } from '../../types';
import './CompanyTestimonials.css';

// FR-CO-13 / FR-CO-14: approved testimonials in a navigable carousel.
export default function CompanyTestimonials({ blok }: { blok: TestimonialsBlok }) {
	const items = asArray(blok.testimonials).filter((t) => t.is_approved && t.comment && t.traveler_name);
	const [index, setIndex] = useState(0);
	const current = items[Math.min(index, items.length - 1)];
	const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);
	const rating = current ? Math.min(5, Math.max(1, Number(current.rating) || 0)) : 0;

	return (
		<Section blok={blok} hasData={items.length > 0}>
			{current && (
				<div role="region" aria-roledescription="carousel" aria-label="Traveler testimonials">
					<figure {...storyblokEditable(current)} className="co-card" aria-live="polite" style={{ margin: 0 }}>
						{rating > 0 && (
							<div className="co-stars" role="img" aria-label={`${rating} out of 5 stars`}>
								{'★'.repeat(rating)}
								{'☆'.repeat(5 - rating)}
							</div>
						)}
						<blockquote className="co-quote">{current.comment}</blockquote>
						<figcaption>
							<strong>{current.traveler_name}</strong>
							{current.destination && <span className="co-role"> · {current.destination}</span>}
						</figcaption>
					</figure>
					{items.length > 1 && (
						<div className="co-carousel__controls">
							<button type="button" onClick={() => go(-1)} aria-label="Previous testimonial">
								←
							</button>
							<span className="data">
								{Math.min(index, items.length - 1) + 1} / {items.length}
							</span>
							<button type="button" onClick={() => go(1)} aria-label="Next testimonial">
								→
							</button>
						</div>
					)}
				</div>
			)}
		</Section>
	);
}
