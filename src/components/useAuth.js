import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useQuery } from "urql";
import { useRouter } from "next/router";

import { getToken, setToken, refreshToken } from "src/lib/auth";
import { request } from "src/lib/request";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

const getUserQuery = `
query getUser {
  user: users {
    id
    email
    name
    active
    default_role
    roles {
      role
    }
  }
}
`;

export function AuthProvider({ children }) {
  const token = getToken();
  const [user, setUser] = useState(null);
  console.log({ token });
  const [result] = useQuery({ query: getUserQuery });
  useEffect(() => {
    if (result.data) {
      setUser(result.data.user[0]);
    }
  }, [result.data, token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  async function logout() {
    setToken(null);
    try {
      await request("/api/logout", {
        credentials: "include",
        mode: "same-origin",
      });
      setUser(null);
      router.push({ pathname: "/" });
    } catch (error) {
      console.error("[ client logout ] failed", error);
    }
  }

  const isAuth = Boolean(user);
  return {
    user,
    isAuth,
    logout,
  };
}

// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component) =>
  Component.displayName || Component.name || "Component";

export function withAuthProvider(WrappedComponent) {
  return class extends React.Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;
    static async getInitialProps() {
      const token = getToken();
      if (!token) {
        try {
          await refreshToken();
        } catch {
          console.error("no token");
        }
      }
    }
    render() {
      return (
        <AuthProvider>
          <WrappedComponent {...this.props} />
        </AuthProvider>
      );
    }
  };
}
