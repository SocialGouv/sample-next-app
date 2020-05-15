import cookie from "cookie";

export function setRefreshTokenCookie(res, refresh_token) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", refresh_token, {
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: (process.env.REFRESH_TOKEN_EXPIRES || 43200) * 60, // maxAge in second
      httpOnly: true,
      path: "/",
    })
  );
}
