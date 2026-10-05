export type Project = {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	/** Direct image URL or local `/images/...` path; null when unusable */
	image: string | null;
	/** Absolute URL to the live site / repo */
	link: string | null;
};
