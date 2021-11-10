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
	description: string;
}

export interface TournamentData {
	readonly id: ID;
	readonly date: string;
	readonly holeCount: number;
	readonly createdBy: UserData;
	readonly sponsoredBy: UserData | null;
	readonly balance: number;
	readonly completed: boolean;
	readonly advertisingBanner: null;
	readonly enrollments: TournamentEnrollment[];
}

export interface TournamentEnrollment {
	score: number;
	tournamentId: number;
	userId: number;
}

export type Layout = 'mobile' | 'desktop';

export type Status = { status: 'ok' | 'error' };

export type RedirectState = { redirectTo?: string };
