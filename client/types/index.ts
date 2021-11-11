export type FormError<Keys extends string, Values = string[]> = Record<
	Keys,
	Values
>;
export type DetailFormError = FormError<'detail', string>;

export type ID = string | number;

export enum UserRole {
	Player = 1,
	DrinkMeister = 2,
	Sponsor = 3,
	Manager = 4,
	Anonymous = 5,
}

export interface Enrollment {
	score: number;
	currentHole: number;
	userId: number;
	tournamentId: number;
}

export interface UserData {
	id: ID;
	username: string;
	birthdate: Date;
	role: UserRole;
	balance: number;
	enrollments: Enrollment[];
}

export interface DrinkData {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
	balance: number;
}

export interface TournamentData {
	id: number;
	date: Date;
	holeCount: number;
	balance: number;
	completed: boolean;
	advertisingBanner: string;
	sponsoredBy: UserData;
	createdBy: UserData;
}

export type Layout = 'mobile' | 'desktop';

export type Status = { status: 'ok' | 'error' };

export type RedirectState = { redirectTo?: string };
