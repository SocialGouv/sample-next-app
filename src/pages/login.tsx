import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import LoginForm from "src/components/login";
import { setToken } from "src/lib/auth";
import { request } from "src/lib/request";

export default function LoginPage() {
  const router = useRouter();

  const resetPassword = (email) => {
    //router.push("/reset-password");
    fetch("/api/reset_password", {
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
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
      body: { password, username: email },
      // headers: {
      //   "Cache-Control": "no-cache",
      // },
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
