import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

//internal import
import { notifySuccess } from "@utils/toast";
import Loading from "@components/preloader/Loading";
import CustomerServices from "@services/CustomerServices";

const EmailVerification = ({ params }) => {
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // console.log("params", params);
  const { error, mutate, isPending, isError, isSuccess } = useMutation({
    mutationKey: ["registerCustomer", params?.token],
    mutationFn: async () =>
      await CustomerServices.registerCustomer(params?.token),
    onSuccess: async (data) => {
      notifySuccess(data.message || "Registration successful!");
      setSuccess(data.message);

      // Automatically sign in the user if credentials are returned
      if (data?.email && data?.password) {
        const signInRes = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInRes?.ok) {
          router.push("/");
        } else {
          notifyError("Sign-in failed. Please try manually.");
          router.push("/auth/login");
        }
      }
    },
    onError: (error) => {
      notifyError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during email verification."
      );
    },
  });

  // Automatically trigger the mutation when the component mounts
  useEffect(() => {
    let debounceTimer;

    if (params?.token) {
      debounceTimer = setTimeout(() => {
        mutate(); // Trigger the mutation after a delay
      }, 500); // Adjust delay as needed
    }

    return () => clearTimeout(debounceTimer); // Cleanup on unmount
  }, [params?.token, mutate]);

  //automatically go to home page
  useEffect(() => {
    if (isSuccess) {
      // Wait for a brief delay (optional) to ensure the user sees the success message
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 300); // Adjust delay as needed (optional)

      return () => clearTimeout(redirectTimer); // Cleanup on unmount
    }
  }, [isSuccess, router]);

  // console.log(
  //   "error",
  //   error,
  //   "isSuccess",
  //   isSuccess,
  //   "isError",
  //   isError,
  //   "isPending",
  //   isPending
  // );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {isPending ? (
        <Loading loading={isPending} />
      ) : isSuccess ? (
        <div className="text-emerald-500">
          <IoCheckmarkCircle className="mx-auto mb-2 text-center text-4xl" />
          <h2 className="text-xl font-medium"> {success} </h2>
        </div>
      ) : error ? (
        <div className="text-red-500">
          <IoCloseCircle className="mx-auto mb-2 text-center text-4xl" />
          <h2 className="text-xl font-medium">
            {" "}
            {error?.response?.data?.message || error?.message}{" "}
          </h2>
        </div>
      ) : null}
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: { params },
  };
};

export default EmailVerification;
