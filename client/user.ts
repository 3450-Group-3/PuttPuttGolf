import { UserData, ID, UserRole } from './types';

interface UserOptions extends UserData {
	anonymous?: boolean;
}

export default class User {
	readonly id: ID;
	readonly username: string;
	readonly birthdate: Date;
	readonly anonymous: boolean;
	readonly balance: number;
	readonly role: UserRole;

	constructor(data: UserOptions) {
		this.id = data.id;
		this.username = data.username;
		this.birthdate = data.birthdate;
		this.role = data.role;
		this.balance = data.balance;
		this.anonymous = data.anonymous || false;
	}

	static anonymousUser(): User {
		return new User(this.anonymousData());
	}

	static anonymousData(): UserOptions {
		return {
			id: -1,
			username: 'Anonymous User',
			birthdate: new Date(),
			role: UserRole.Anonymous,
			balance: 0,
			anonymous: true,
		};
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
		return (
			this.role === UserRole.Player ||
			this.role === UserRole.Sponsor ||
			this.role == UserRole.Manager
		);
	}

	get isDrinkMeister(): boolean {
		return this.role === UserRole.DrinkMeister || this.role == UserRole.Manager;
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
