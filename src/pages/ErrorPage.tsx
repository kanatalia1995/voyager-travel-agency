import { Link, useLocation } from 'react-router';
import './error-page.css';

interface ErrorState {
	status?: number;
}

/** Plain React route (not a CMS story) so it still works when Storyblok is unreachable. */
export default function ErrorPage() {
	const { state } = useLocation();
	const status = (state as ErrorState | null)?.status;
	const notFound = status === 404;

	return (
		<main className="error-page">
			<p className="error-page__code data">{status ? status : 'Error'}</p>
			<h1>{notFound ? 'Lost in space' : 'Something went wrong'}</h1>
			<p className="error-page__message">
				{notFound
					? "We couldn't find the page you were looking for."
					: "We couldn't load this page. Please try again in a moment."}
			</p>
			<Link to="/" className="error-page__action">
				Back to home
			</Link>
		</main>
	);
}
