import PropTypes from "prop-types";
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

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
    <Form onSubmit={submit}>
      <Form.Group>
        <Form.Label>Adresse email</Form.Label>
        <Form.Control
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email"
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="mot de passe"
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        style={{ marginTop: 30 }}
        variant="primary"
        size="lg"
        block
        type="submit"
        onClick={submit}
        disabled={!isValid}
      >
        Se connecter
      </Button>

      <Button
        style={{ marginTop: 30 }}
        variant="light"
        title="Saisissez votre email pour récupérer votre mot de passe"
        size="sm"
        block
        onClick={() => resetPassword(email)}
        type="button"
      >
        Mot de passe perdu
      </Button>
    </Form>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  authenticate: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};
