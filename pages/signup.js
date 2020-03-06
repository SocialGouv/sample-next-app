import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signup } from "../utils/auth";

const Signup = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data, e) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const { token } = await response.json();
        signup({ token });
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={register({ required: true })}
            className="form-control"
          />
          {errors.email && <p>This is required</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={register({ required: true })}
            className="form-control"
          />
          {errors.password && <p>This is required</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={register({ required: true })}
            className="form-control"
          />
          {errors.confirmPassword && <p>This is required</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default Signup;
