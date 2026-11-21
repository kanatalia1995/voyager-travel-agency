import { Navigate, useLocation } from 'react-router';

/** Route ErrorBoundary: anything that throws while rendering ends up on the error page. */
export default function RenderErrorRedirect() {
	const { search } = useLocation();
	return <Navigate to={{ pathname: '/error', search }} replace state={{ status: 500 }} />;
}
