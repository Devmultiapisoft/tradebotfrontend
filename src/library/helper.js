import React from "react";
import { Route, Redirect } from "react-router-dom"; // Import Redirect
import LayoutPage from "../components/layout";

// PrivateRoute component to protect routes based on token
export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        CheckToken() ? (
          <LayoutPage>
            <Component {...props} />
          </LayoutPage>
        ) : (
          <Redirect to="/login" /> // Use Redirect instead of history.push
        )
      }
    />
  );
};

// CheckToken function to verify if the token exists
export const CheckToken = () => {
  const token = getToken();
  return token ? true : false; // Return true if token exists
};

// Function to get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token") || null; // Get token from localStorage
};
