export const DEFAULT_AUTH_REDIRECT = "/";

export function normalizeAuthRedirect(
  value: string | null | undefined,
  fallback: string = DEFAULT_AUTH_REDIRECT
) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function buildAuthPath(pathname: "/login" | "/signup", redirect: string) {
  const params = new URLSearchParams({
    redirect: normalizeAuthRedirect(redirect),
  });

  return `${pathname}?${params.toString()}`;
}
