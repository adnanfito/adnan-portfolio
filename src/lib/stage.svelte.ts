import { pushState } from '$app/navigation';

export type View = 'home' | 'projects' | 'experience' | 'contact';

const views: View[] = ['home', 'projects', 'experience', 'contact'];

export const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

/** Shared UI state for the 3D room; the URL hash is the source of truth (`#projects/foldin`). */
class Stage {
	view = $state<View>('home');
	/** Slug of the project open in the laptop browser */
	project = $state<string | null>(null);
	/** The camera has (nearly) arrived in the character's point of view */
	povReady = $state(false);
	/** True once the laptop is open, so the screen can light up */
	screenReady = $state(false);
	/** True once the character holds the CV up */
	paperReady = $state(false);
	/** Name of the 3D object under the pointer, for the hint label */
	hovered = $state<string | null>(null);
	/** The 3D scene has rendered its first frame */
	loaded = $state(false);
	reducedMotion = $state(false);
}

export const stage = new Stage();

const hashFor = (view: View, project: string | null) =>
	view === 'home' ? '' : `#${view}${view === 'projects' && project ? `/${project}` : ''}`;

const apply = (hash: string) => {
	const [view, project] = hash.replace(/^#/, '').split('/');
	stage.view = views.includes(view as View) ? (view as View) : 'home';
	stage.project = stage.view === 'projects' && project ? project : null;
};

export const go = (view: View, project: string | null = null) => {
	const hash = hashFor(view, project);
	if (hash === location.hash) return;
	pushState(hash || location.pathname + location.search, {});
	apply(hash);
};

/** Esc / back button: project → project list → room */
export const back = () => {
	if (stage.project) go('projects');
	else if (stage.view !== 'home') go('home');
};

/** Keeps `stage` in sync with the URL; returns a cleanup function. */
export const syncWithLocation = () => {
	apply(location.hash);
	const onPop = () => apply(location.hash);
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') back();
	};
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	const onMotion = () => (stage.reducedMotion = mq.matches);
	onMotion();

	window.addEventListener('popstate', onPop);
	window.addEventListener('keydown', onKey);
	mq.addEventListener('change', onMotion);
	return () => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('keydown', onKey);
		mq.removeEventListener('change', onMotion);
	};
};
