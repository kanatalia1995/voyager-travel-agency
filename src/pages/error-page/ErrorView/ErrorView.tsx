import SmartLink from '../../../storyblok/SmartLink/SmartLink';
import type { ErrorContent } from '../errorContent';
import './ErrorView.css';

interface ErrorViewProps extends ErrorContent {
	/** Big code shown above the title, e.g. 404. */
	code?: string | number;
	/** Smaller variant used when previewing in the Visual Editor. */
	compact?: boolean;
}

export default function ErrorView({ code, title, message, actionLabel, actionTo, compact }: ErrorViewProps) {
	return (
		<section className={`error-page${compact ? ' error-page--compact' : ''}`}>
			{code !== undefined && <p className="error-page__code data">{code}</p>}
			<h1>{title}</h1>
			<p className="error-page__message">{message}</p>
			<SmartLink to={actionTo} className="error-page__action">
				{actionLabel}
			</SmartLink>
		</section>
	);
}
