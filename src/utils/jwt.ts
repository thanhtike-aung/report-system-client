export function decodeJWT(token: string | null) {
  if (!token || token === null) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function isJWTExpired(token: string | null) {
  if (!token || token === null) return null;

  try {
    const decodedJWT = decodeJWT(token);
    const expiredAt = decodedJWT.exp * 1000;
    return Date.now() > expiredAt;
  } catch (error) {
    console.error(error);
    return null;
  }
}
