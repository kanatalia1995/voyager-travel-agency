import { StoryblokComponent, storyblokEditable, type SbBlokData } from '@storyblok/react';

interface GridBlok extends SbBlokData {
	columns: SbBlokData[];
}

export default function Grid({ blok }: { blok: GridBlok }) {
	return (
		<div {...storyblokEditable(blok)} className="grid">
			{blok.columns.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</div>
	);
}
