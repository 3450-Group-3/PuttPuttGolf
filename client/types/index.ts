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

export interface UserData {
	id: ID;
	username: string;
	birthdate: Date;
	role: UserRole;
	balance: number;
}

export interface DrinkData {
	id: number
	name: string;
	price: number;
	imageUrl: string;
	balance: number;
}

export type Layout = 'mobile' | 'desktop';
