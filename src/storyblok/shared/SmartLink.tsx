import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
	to: string;
	newTab?: boolean;
	children: ReactNode;
}

/** Link that uses the router for internal paths and a new tab for external URLs. */
export default function SmartLink({ to, children, newTab = false, ...rest }: SmartLinkProps) {
	if (!to) return null;
	if (to.startsWith('/') && !newTab) {
		return (
			<Link to={to} {...rest}>
				{children}
			</Link>
		);
	}
	return (
		<a href={to} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
			{children}
		</a>
	);
}
