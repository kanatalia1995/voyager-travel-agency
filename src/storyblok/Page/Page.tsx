import { StoryblokComponent, storyblokEditable, type SbBlokData } from '@storyblok/react';

interface PageBlok extends SbBlokData {
	body?: SbBlokData[];
}

export default function Page({ blok }: { blok: PageBlok }) {
	return (
		<main {...storyblokEditable(blok)}>
			{blok.body?.map((nestedBlok, index) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid || index} />
			))}
		</main>
	);
}
