import { useStorageState } from '@/hooks/useStorageState';
import React from 'react';

const AuthContext = React.createContext<{
    signIn: (token: string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    userParams?: any;
    updateUserParams: (params: any) => void;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
    userParams: null,
    updateUserParams: () => null,
});

export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[isParamsLoading, userParamsString], setUserParams] = useStorageState('userParams');

    const userParams = userParamsString ? JSON.parse(userParamsString) : null;

    return (
        <AuthContext.Provider
            value={{
                signIn: (token) => {
                    setSession(token);
                },
                signOut: () => {
                    setSession(null);
                    setUserParams(null);
                },
                session,
                isLoading,
                userParams,
                updateUserParams: (params) => {
                    setUserParams(JSON.stringify(params));
                }
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
