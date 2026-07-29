import { createContext, useState, useContext, type ReactNode } from 'react';
import type { UserData } from './DataInterfaces';

interface AuthContextType {
  user: UserData | null;
  setUserData: (data: UserData) => void;
  deleteUserData: () => void;
}

const AuthContext = createContext<AuthContextType>({});

export default function AuthProvider({children} : {children : ReactNode}) {
	const [user, setUser] = useState<UserData | null>(null);

	const setUserData = (data: UserData) => {
		setUser(data);
	}
	const deleteUserData = () => {
		setUser(null);
	}

	return (<AuthContext.Provider value={{user, setUserData, deleteUserData}}>
		{children}
	</AuthContext.Provider>);
}

export const useAuth = () => useContext(AuthContext);