import React from 'react';
import User from './user';
import { UserData } from './types';

export interface GlobalState {
	user: User;
	setUser: (data: UserData) => void;
}

const GlobalContext = React.createContext<GlobalState>({} as GlobalState);

export const GlobalProvider = GlobalContext.Provider;
export const GlobalConsumer = GlobalContext.Consumer;
export default GlobalContext;
