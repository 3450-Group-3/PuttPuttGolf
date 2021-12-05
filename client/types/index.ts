export type FormError<Keys extends string, Values = string[]> = Record<
	Keys,
	Values
>;
export type DetailFormError = FormError<'detail', string>;
export type MessageError = FormError<'message', string>;

export type ID = string | number;

export enum UserRole {
	Player = 1,
	DrinkMeister = 2,
	Sponsor = 3,
	Manager = 4,
	Anonymous = 5,
}

export enum OrderStatus {
	Open = 1,
	InProgress = 2,
	Enroute = 3,
	Delivered = 4,
}

export interface TournamentEnrollment {
	score: number;
	userId: ID;
	tournamentId: ID;
	currentHole: number;
	user: UserData;
}

export interface TournamentEnrollmentUser {
	score: number;
	user: UserData;
	currentHole: number;
}

export interface UserData {
	id: ID;
	username: string;
	birthdate: Date;
	role: UserRole;
	balance: number;
	enrollments: TournamentEnrollment[];
}

export interface DrinkData {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
	description: string;
}

export interface LocationData {
	lattitude: number;
	longitude: number;
}

export interface DrinkOrderQuantityData {
	drinkId: number;
	quantity: number;
}

export interface DrinkOrderData {
	id: number;
	customerId: number;
	customerName: string;
	orderStatus: OrderStatus;
	timeOrdered: Date;
	totalPrice: number;
	drinks: DrinkOrderQuantityData[];
	location: LocationData;
	drinkMeisterId: number;
}

export interface WinningDistributions {
	readonly first: number;
	readonly second: number;
	readonly third: number;
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
	readonly winningDistributions: WinningDistributions;
}

export type Layout = 'mobile' | 'desktop';

export type Status = { status: 'ok' | 'error' };

export type RedirectState = { redirectTo?: string };
