import React from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import "../assets/css/login.css";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),  // Added username validation
    name: Yup.string().required("Name is required"),
    location: Yup.string().required("Location is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    deviceID: Yup.string().required("Device ID is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",  // Initialize username field
      name: "",
      location: "",
      email: "",
      phone: "",
      deviceID: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (data) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/register", // Your backend register endpoint
          data
        );
        console.log(response.data);
        if (response.data.success) {
          alert("Registration successful! Redirecting to login...");
          // Navigate to login or show success message
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit } = formik;

  return (
    <div className="form-box">
      <div className="fullHeight p-ai-center p-d-flex p-jc-center">
        <div className="shadow card m-3 px-3 py-4 px-sm-4 py-sm-5">
          <h4 className="text-center">Sign Up to App</h4>
          <p className="text-center mb-3">Enter your details below.</p>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit} className="p-fluid">
              {/* Username Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.username && errors.username),
                    })}
                  />
                  <label
                    htmlFor="username"
                    className={classNames({
                      "p-error": Boolean(touched.username && errors.username),
                    })}
                  >
                    Username*
                  </label>
                </span>
                {Boolean(touched.username && errors.username) && (
                  <small className="p-error">{formik.errors["username"]}</small>
                )}
              </div>

              {/* Name Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.name && errors.name),
                    })}
                  />
                  <label
                    htmlFor="name"
                    className={classNames({
                      "p-error": Boolean(touched.name && errors.name),
                    })}
                  >
                    Name*
                  </label>
                </span>
                {Boolean(touched.name && errors.name) && (
                  <small className="p-error">{formik.errors["name"]}</small>
                )}
              </div>

              {/* Location Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.location && errors.location),
                    })}
                  />
                  <label
                    htmlFor="location"
                    className={classNames({
                      "p-error": Boolean(touched.location && errors.location),
                    })}
                  >
                    Location*
                  </label>
                </span>
                {Boolean(touched.location && errors.location) && (
                  <small className="p-error">{formik.errors["location"]}</small>
                )}
              </div>

              {/* Email Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.email && errors.email),
                    })}
                  />
                  <label
                    htmlFor="email"
                    className={classNames({
                      "p-error": Boolean(touched.email && errors.email),
                    })}
                  >
                    Email*
                  </label>
                </span>
                {Boolean(touched.email && errors.email) && (
                  <small className="p-error">{formik.errors["email"]}</small>
                )}
              </div>

              {/* Phone Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <InputMask
                    id="phone"
                    name="phone"
                    mask="(999) 999-9999"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.phone && errors.phone),
                    })}
                  />
                  <label
                    htmlFor="phone"
                    className={classNames({
                      "p-error": Boolean(touched.phone && errors.phone),
                    })}
                  >
                    Phone*
                  </label>
                </span>
                {Boolean(touched.phone && errors.phone) && (
                  <small className="p-error">{formik.errors["phone"]}</small>
                )}
              </div>

              {/* Device ID Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="deviceID"
                    name="deviceID"
                    value={formik.values.deviceID}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.deviceID && errors.deviceID),
                    })}
                  />
                  <label
                    htmlFor="deviceID"
                    className={classNames({
                      "p-error": Boolean(touched.deviceID && errors.deviceID),
                    })}
                  >
                    Device ID*
                  </label>
                </span>
                {Boolean(touched.deviceID && errors.deviceID) && (
                  <small className="p-error">{formik.errors["deviceID"]}</small>
                )}
              </div>

              {/* Password Field */}
              <div className="p-field">
                <span className="p-float-label">
                  <Password
                    id="password"
                    name="password"
                    toggleMask
                    feedback={false}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.password && errors.password),
                    })}
                  />
                  <label
                    htmlFor="password"
                    className={classNames({
                      "p-error": Boolean(touched.password && errors.password),
                    })}
                  >
                    Password*
                  </label>
                </span>
                {Boolean(touched.password && errors.password) && (
                  <small className="p-error">{formik.errors["password"]}</small>
                )}
              </div>

              {/* Submit Button */}
              <div className="submitBtnBox">
                <Button
                  type="submit"
                  label="Register"
                  iconPos="right"
                  loading={isSubmitting}
                  className="mt-4 submitBtn"
                  disabled={isSubmitting}
                />
              </div>

              {/* Login Link */}
              <div className="signupBox mt-3 text-center">
                Already have an account? <Link to="/login">Log In</Link>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
}
