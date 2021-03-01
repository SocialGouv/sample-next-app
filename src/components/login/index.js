import PropTypes from "prop-types";
import React, { useState } from "react";

import { Button, Callout } from "../dse";

const LoginForm = ({ authenticate, resetPassword, onSuccess }) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setError(null);
    setStatus("loading");
    try {
      const result = await authenticate({ email, password });
      onSuccess(result);
    } catch (err) {
      setError("Impossible de vous authentifier");
      setStatus("error");
    }
  };

  const isValidEmail = email && email.indexOf("@") > -1;
  const isValid = status !== "loading" && isValidEmail && !!password;

  return (
    <form onSubmit={submit}>
      <div className="rf-input-group">
        <label className="rf-label" htmlFor="email">
          Champ email :
        </label>
        <input
          className="rf-input"
          type="email"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email"
          required=""
        />
      </div>
      <div className="rf-input-group">
        <label className="rf-label" htmlFor="password">
          Mot de passe :
        </label>
        <input
          className="rf-input"
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="mot de passe"
          required=""
        />
      </div>

      {error && <Callout variant="danger">{error}</Callout>}

      <Button
        style={{ marginTop: 30 }}
        variant="primary"
        type="submit"
        onClick={submit}
        disabled={!isValid}
      >
        Se connecter
      </Button>

      <Button
        style={{ float: "right", marginTop: 30 }}
        variant="secondary"
        title="Saisissez votre email pour récupérer votre mot de passe"
        onClick={() => resetPassword(email)}
        type="button"
        size="sm"
      >
        Mot de passe perdu
      </Button>
    </form>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  authenticate: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};
