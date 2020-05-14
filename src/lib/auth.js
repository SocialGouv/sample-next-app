import Router from "next/router";
import { request } from "./request";
import { parse, serialize } from "cookie";
import { setRefreshTokenCookie } from "./setRefreshTokenCookie";

let token = null;

function getToken() {
  console.log("[ getToken ]", token?.jwt_token);
  return token ? token.jwt_token : null;
}

function isTokenExpired() {
  if (!token) return true;
  return Date.now() > new Date(token.jwt_token_expiry);
}

async function refreshToken(ctx) {
  console.log("[ refreshToken ]", { token });

  try {
    let hostname = "";
    const headers = {
      "Cache-Control": "no-cache",
    };
    if (ctx && ctx.req) {
      // node-fetch needs absolute url
      hostname = `${ctx.req.protocol}://${ctx.req.headers.host}`;
      const cookies = parse(ctx.req.headers.cookie);
      if (cookies && cookies.refresh_token) {
        headers["Cookie"] = serialize("refresh_token", cookies.refresh_token);
      }
    }
    const tokenData = await request(`${hostname}/api/refresh_token`, {
      credentials: "same-origin",
      mode: "same-origin",
      headers,
    });

    // for ServerSide call, we need to set the Cookie header
    // to update the refresh_token value
    if (ctx && ctx.res) {
      setRefreshTokenCookie(ctx.res, tokenData.refresh_token);
    }

    setToken(tokenData);
  } catch (error) {
    console.error("[ refreshToken ]", { error });
    if (ctx && ctx.res) {
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
      return;
    } else {
      Router.push("/login");
      return;
    }
  }

  return getToken();
}

function setToken(tokenData) {
  console.log("[ setToken ]", { tokenData });
  token = { ...tokenData };
}

async function logout() {
  token = null;
  try {
    await request("/api/logout", {
      credentials: "same-origin",
      mode: "same-origin",
    });
  } catch (error) {
    console.error("[ client logout ] failed");
  }
}

export { getToken, isTokenExpired, logout, refreshToken, setToken };
