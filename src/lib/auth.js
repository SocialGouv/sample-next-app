import Router from "next/router";
import { request } from "./request";
import { parse, serialize } from "cookie";
import { setRefreshTokenCookie } from "./setRefreshTokenCookie";
let inMemoryToken;

async function getToken(ctx) {
  console.log("[getToken]", { inMemoryToken });
  if (!inMemoryToken) {
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
        body: {},
      });
      if (ctx && ctx.res) {
        setRefreshTokenCookie(ctx.res, tokenData.refresh_token);
      }
      setToken(tokenData);
    } catch (error) {
      console.error("[getToken]", { error });
      if (ctx && ctx.res) {
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
        return;
      } else {
        Router.push("/login");
        return;
      }
    }
  }
  console.log("--[gettoken]--", { inMemoryToken });
  return inMemoryToken.token;
}

function setToken({ jwt_token, jwt_token_expiry, refresh_token }) {
  console.log("[setToken]", { jwt_token, jwt_token_expiry, refresh_token });
  inMemoryToken = {
    refresh_token,
    token: jwt_token,
    expiry: jwt_token_expiry,
  };
}

async function logout() {
  inMemoryToken = null;
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    // to support logging out from all windows
    window.localStorage.setItem("logout", Date.now());
  } catch (error) {
    console.error("[client logout] failed");
  }
}

export { setToken, logout, getToken };
