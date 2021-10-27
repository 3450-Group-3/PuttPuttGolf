import { UserData, ID, UserRole } from './types';

export default class User {
	readonly id: ID;
	readonly username: string;
	readonly birthdate: Date;
	readonly anonymous: boolean;
	readonly balance: number;
	private readonly role: UserRole;

	constructor(data: UserData, anonymous: boolean = false) {
		this.id = data.id;
		this.username = data.username;
		this.birthdate = data.birthdate;
		this.role = data.role;
		this.balance = data.balance;
		this.anonymous = anonymous;
	}

	static anonymousUser(): User {
		return new User(
			{
				id: -1,
				username: 'Anonymous User',
				birthdate: new Date(),
				role: UserRole.Anonymous,
				balance: 0,
			},
			true
		);
	}

	toString() {
		return `<User: ${this.username}, ${this.role}>`;
	}

	get roleName(): string {
		return ['Player', 'Drink Meister', 'Sponsor', 'Manager', 'Anonymous'][
			this.role - 1
		];
	}

	get isPlayer(): boolean {
		return this.role === UserRole.Player;
	}

	get isDrinkMeister(): boolean {
		return this.role === UserRole.DrinkMeister;
	}

	get isSponsor(): boolean {
		return this.role === UserRole.Sponsor || this.role == UserRole.Manager;
	}

	get isManager(): boolean {
		return this.role === UserRole.Manager;
	}

	get loggedIn(): boolean {
		return this.role !== UserRole.Anonymous;
	}
}
