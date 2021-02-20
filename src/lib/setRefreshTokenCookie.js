import cookie from "cookie";

export function setRefreshTokenCookie(res, refresh_token) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", refresh_token, {
      // maxAge in second
      httpOnly: true,

      maxAge: (process.env.REFRESH_TOKEN_EXPIRES || 43200) * 60,
      path: "/",
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    })
  );
}
