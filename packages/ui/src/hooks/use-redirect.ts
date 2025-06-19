export function useRedirect(): string {
	if (typeof window === 'undefined') return '/dashboard';
	return new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
}