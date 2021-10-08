export type FormError<Keys extends string, Values = string[]> = Record<
	Keys,
	Values
>;
export type DetailFormError = FormError<'detail', string>;

export type ID = string | number;

export enum UserRole {
	Player = 1,
	DrinkerMeister = 2,
	Sponsor = 3,
	Manager = 4,
}

export interface User {
	id: ID;
	username: string;
	birthdate: Date;
	role: UserRole;
}
