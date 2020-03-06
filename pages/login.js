import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "../utils/auth";

const Login = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data, e) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const { token } = await response.json();
        login({ token });
      } else {
        // https://github.com/developit/unfetch#caveats
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      e.target.reset();
    } catch (error) {
      console.error(
        "You have an error in your code or there are Network issues.",
        error
      );
    }
  };

  return (
    <>
      <p>
        <Link href="/">
          <a>Go to index</a>
        </Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={register({ required: true })}
            className="form-control"
          />
          {errors.email && <p>This is required</p>}
          <small id="emailHelp" className="form-text text-muted">
            We’ll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={register({ required: true })}
            className="form-control"
          />
          {errors.password && <p>This is required</p>}
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Check me out
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default Login;
