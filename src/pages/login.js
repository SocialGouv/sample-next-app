import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import LoginForm from "../components/login";

import { setToken } from "../lib/auth";
import { request } from "../lib/request";

export default function LoginPage() {
  const router = useRouter();

  const resetPassword = () => {
    router.push("/reset-password");
  };

  const goAdmin = () => {
    console.log("[goAdmin]");
    router.push("/admin");
  };

  const authenticate = ({ email, password }) => {
    return request("/api/login", {
      headers: {
        "Cache-Control": "no-cache",
      },
      body: { username: email, password },
    }).then((tokenData) => {
      setToken(tokenData);
    });
  };

  return (
    <>
      <Head>
        <title>login | sample next app</title>
      </Head>
      <LoginForm
        authenticate={authenticate}
        resetPassword={resetPassword}
        onSuccess={goAdmin}
      />
    </>
  );
}
