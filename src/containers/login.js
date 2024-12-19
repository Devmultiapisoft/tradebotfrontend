import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { authenticateUser } from "../library/store/authentication";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "../assets/css/login.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function LoginPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  // Yup validation schema for login
  const LoginSchema = Yup.object().shape({
    userid: Yup.string().required("User ID is required"),
    password: Yup.string().required("Password is required"),
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      userid: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (data, { setSubmitting, setFieldError }) => {
      try {
        // Dispatch login user action
        const response = await dispatch(authenticateUser(data)).unwrap();
        
        if (response.success) {
          const { token } = response;
          localStorage.setItem("token", token);  // Save token in localStorage
          
          // After login is successful, redirect to dashboard
          // Make sure history.push is executed after state is updated
          history.push("/dashboard");
          window.location.href = "/dashboard";
        } else {
          setFieldError("password", response.message || "Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);
        setFieldError("password", "Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, handleChange, values } = formik;

  return (
    <div className="form-box">
      <div className="fullHeight p-ai-center p-d-flex p-jc-center">
        <div className="shadow card m-3 px-3 py-4 px-sm-4 py-sm-5">
          <h4 className="text-center">Sign in to App</h4>
          <p className="text-center mb-3">Enter your details below.</p>
          <FormikProvider value={formik}>
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="userid"
                    name="userid"
                    value={values.userid}
                    onChange={handleChange}
                    className={classNames({
                      "p-invalid": touched.userid && errors.userid,
                    })}
                  />
                  <label
                    htmlFor="userid"
                    className={classNames({
                      "p-error": touched.userid && errors.userid,
                    })}
                  >
                    User ID*
                  </label>
                </span>
                {touched.userid && errors.userid && (
                  <small className="p-error">{errors.userid}</small>
                )}
              </div>

              <div className="p-field">
                <span className="p-float-label">
                  <Password
                    id="password"
                    name="password"
                    toggleMask
                    feedback={false}
                    value={values.password}
                    onChange={handleChange}
                    className={classNames({
                      "p-invalid": touched.password && errors.password,
                    })}
                  />
                  <label
                    htmlFor="password"
                    className={classNames({
                      "p-error": touched.password && errors.password,
                    })}
                  >
                    Password*
                  </label>
                </span>
                {touched.password && errors.password && (
                  <small className="p-error">{errors.password}</small>
                )}
              </div>

              <div className="forgotPassword text-right">
                <Link to="/forgot-password">
                  <u>Forgot Password</u>
                </Link>
              </div>

              <div className="submitBtnBox">
                <Button
                  type="submit"
                  label="Login"
                  iconPos="right"
                  loading={isSubmitting}
                  className="mt-4 submitBtn"
                  disabled={isSubmitting}
                />
              </div>

              <div className="signupBox mt-3 text-center">
                Don’t have an account? <Link to="/register">Get started</Link>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
}
