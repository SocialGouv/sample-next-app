import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import LoginForm from "src/components/login";
import { setToken } from "src/lib/auth";
import { request } from "src/lib/request";

export default function LoginPage() {
  const router = useRouter();

  const resetPassword = (email) => {
    //router.push("/reset-password");
    fetch("/api/reset_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then(console.log)
      .catch(console.log);
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
