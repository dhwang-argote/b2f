import { useMemo } from "react";

export type AuthUser = {
	id: number
	email?: string
	username?: string
	firstName?: string
	lastName?: string
}

export function useAuth(): { user: AuthUser | null; isAuthenticated: boolean } {
	// Placeholder: in absence of a real auth provider, default to logged out
	return useMemo(() => ({ user: null, isAuthenticated: false }), []);
}
