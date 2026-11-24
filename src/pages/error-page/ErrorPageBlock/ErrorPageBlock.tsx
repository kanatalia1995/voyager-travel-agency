import { storyblokEditable } from '@storyblok/react';
import ErrorView from '../ErrorView/ErrorView';
import { pickErrorContent } from '../errorContent';
import { asArray } from '../../../helpers/helpers';
import type { ErrorPageBlok } from '../../../storyblok/types';

/** Preview for editing the `error-page` story in the Visual Editor: shows every message. */
export default function ErrorPageBlock({ blok }: { blok: ErrorPageBlok }) {
	return (
		<main {...storyblokEditable(blok)}>
			{asArray(blok.messages).map((message) => {
				const status = Number(message.status_code);
				return (
					<div key={message._uid} {...storyblokEditable(message)}>
						<ErrorView
							compact
							code={message.status_code?.trim() || 'Default'}
							{...pickErrorContent([message], Number.isNaN(status) ? undefined : status)}
						/>
					</div>
				);
			})}
		</main>
	);
}
