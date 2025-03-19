import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail } from "react-icons/fi";
import { ToastContainer } from "react-toastify";

//internal import
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { notifyError, notifySuccess } from "@utils/toast";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const password = useRef("");
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  password.current = watch("newPassword");

  const submitHandler = async ({ registerEmail, password, newPassword }) => {
    setLoading(true);

    try {
      if (newPassword) {
        // Reset password logic
        const res = await CustomerServices.resetPassword({
          newPassword,
          token: router.query?.token,
        });

        setLoading(false);
        setShowLogin(true);
        notifySuccess(res.message);
        setValue("newPassword");
      }

      if (registerEmail && password) {
        const signInRes = await signIn("credentials", {
          redirect: false,
          email: registerEmail,
          password: password,
        });

        if (signInRes?.ok) {
          router.push("/");
          notifySuccess("Login Success!");
        } else {
          notifyError("Sign-in failed. Please try again!");
          router.push("/auth/login");
        }
      }
    } catch (err) {
      setLoading(false);
      // Catch and handle errors from both resetPassword and loginCustomer
      notifyError(
        err?.response?.data?.message || err.message || "Something went wrong."
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow max-w-md w-full space-y-8 py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-serif">
              {showLogin ? "Login" : "Forget Password"}
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
              {showLogin
                ? "Login with your email and new password"
                : "Reset Your Password"}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col justify-center"
          >
            <div className="grid grid-cols-1 gap-5">
              {showLogin && (
                <>
                  <div className="form-group">
                    <InputArea
                      register={register}
                      label="Email"
                      name="registerEmail"
                      type="email"
                      placeholder="Email"
                      Icon={FiMail}
                    />
                    <Error errorName={errors.registerEmail} />
                  </div>
                  <div className="form-group">
                    <InputArea
                      register={register}
                      label="Password"
                      name="password"
                      type="password"
                      autocomplete="new-password"
                      placeholder="Password"
                      Icon={FiLock}
                    />

                    <Error errorName={errors.password} />
                  </div>
                </>
              )}

              {!showLogin && (
                <>
                  <div className="form-group">
                    <InputArea
                      Icon={FiLock}
                      name="newPassword"
                      type="password"
                      placeholder="New password"
                      register={register}
                      label="New password"
                      pattern={
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
                      }
                      patternMessage={[
                        "1. Password must be at least 8 characters long.",
                        "2. Password must contain at least one uppercase letter.",
                        "3. Password must contain at least one lowercase letter.",
                        "4. Password must contain at least one number.",
                        "5. Password must contain at least one special character.",
                      ]}
                    />

                    <Error errorName={errors.newPassword} />
                  </div>
                  <div className="form-group">
                    <input
                      name="confirm_password"
                      type="password"
                      placeholder="Confirm password"
                      {...register("confirm_password", {
                        validate: (value) =>
                          value === password.current ||
                          "The passwords do not match",
                      })}
                      className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-gray-100 border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
                    />

                    <Error errorName={errors.confirm_password} />
                  </div>
                </>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full text-center py-3 rounded bg-emerald-500 font-medium text-sm text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
              >
                {showLogin ? "Login" : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps = async ({ params }) => {
//   return {
//     props: { params },
//   };
// };

export default ForgetPassword;
