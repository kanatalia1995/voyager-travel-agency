import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { NavLanguageBlok } from '../types';
import './LanguageSelect.css';

interface LanguageSelectProps {
	languages: NavLanguageBlok[];
	/** Selected Storyblok language code ('' is the default language). */
	value: string;
	onChange: (code: string) => void;
}

/** Styled, keyboard-accessible language picker (a native <select> can't be themed). */
export default function LanguageSelect({ languages, value, onChange }: LanguageSelectProps) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listId = useId();

	const current = languages.find((l) => (l.code ?? '') === value) ?? languages[0];

	// Close on outside click.
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [open]);

	// Move focus to the selected option when the list opens.
	useEffect(() => {
		if (!open) return;
		const selected = rootRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
		(selected ?? rootRef.current?.querySelector<HTMLElement>('[role="option"]'))?.focus();
	}, [open]);

	const close = () => {
		setOpen(false);
		buttonRef.current?.focus();
	};

	const choose = (code: string) => {
		onChange(code);
		close();
	};

	const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
		const options = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')];
		const index = options.indexOf(document.activeElement as HTMLElement);
		const focusAt = (i: number) => options[(i + options.length) % options.length]?.focus();
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				focusAt(index + 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusAt(index - 1);
				break;
			case 'Home':
				event.preventDefault();
				focusAt(0);
				break;
			case 'End':
				event.preventDefault();
				focusAt(options.length - 1);
				break;
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'Tab':
				setOpen(false);
				break;
		}
	};

	return (
		<div className="lang-select" ref={rootRef}>
			<button
				ref={buttonRef}
				type="button"
				className="lang-select__button"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={listId}
				onClick={() => setOpen((o) => !o)}
			>
				<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<circle cx="12" cy="12" r="9" />
					<path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
				</svg>
				<span className="sr-only">Language: </span>
				<span>{current?.label}</span>
				<svg aria-hidden="true" className="lang-select__chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			{open && (
				<ul id={listId} className="lang-select__list" role="listbox" aria-label="Language" onKeyDown={onListKeyDown}>
					{languages.map((l) => {
						const code = l.code ?? '';
						const selected = l === current;
						return (
							<li
								key={l._uid}
								role="option"
								tabIndex={-1}
								aria-selected={selected}
								className="lang-select__option"
								onClick={() => choose(code)}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										choose(code);
									}
								}}
							>
								<span>{l.label}</span>
								{selected && (
									<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
										<path d="m5 12 5 5 9-10" />
									</svg>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
