import type { ReactNode } from 'react';
import { storyblokEditable } from '@storyblok/react';
import type { SectionBlok } from '../../types';
import './Section.css';

interface SectionProps {
	blok: SectionBlok;
	className?: string;
	hasData?: boolean;
	children: ReactNode;
}

/**
 * Shared section wrapper. Returns nothing when hidden by the editor
 * or when the section has no data (FR-CO-17).
 */
export function Section({ blok, className = '', hasData = true, children }: SectionProps) {
	if (blok.is_hidden || !hasData) return null;
	return (
		<section {...storyblokEditable(blok)} className={`co-section ${className}`}>
			{(blok.title || blok.subtitle) && (
				<header className="co-section__head">
					{blok.title && <h2>{blok.title}</h2>}
					{blok.subtitle && <p className="co-section__subtitle">{blok.subtitle}</p>}
				</header>
			)}
			{children}
		</section>
	);
}
