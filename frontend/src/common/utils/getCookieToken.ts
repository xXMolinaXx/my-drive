export function getCookieToken() {
  const cookieName = "access_token";
  const cookies = document.cookie.split(";");
  let cookieToken = "";
  cookies.forEach((cookie) => {
    const values = cookie.split("=");
    const key = values[0].trim();
    if (key === cookieName) {
      cookieToken = values[1];
    }
  });
  return cookieToken;
}
