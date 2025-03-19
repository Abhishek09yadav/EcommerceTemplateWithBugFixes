import Link from "next/link";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import phone from "phone";
import { Controller } from "react-hook-form";

//internal import
import Layout from "@layout/Layout";
import Label from "@components/form/Label";
import useLoginSubmit from "@hooks/useLoginSubmit";
import BottomNavigation from "@components/login/BottomNavigation";

const PhoneSignup = () => {
  const { errors, control, loading, handleSubmit, submitHandler } =
    useLoginSubmit();

  const name = "phone";

  const rules = {
    required: {
      value: true,
      message: "Phone Number is required!",
    },
    validate: (value) => {
      return phone(value)?.isValid || "Enter valid phone number!";
    },
  };

  // console.log("phoneError", errors);

  return (
    <Layout
      title="Phone Signup"
      description="this is phone number sign up page"
    >
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold font-serif">Signing Up</h2>
                  <p className="text-sm text-gray-500 mt-2 mb-8 sm:mb-10">
                    Create an account by phone number.
                  </p>
                </div>

                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(submitHandler)}
                  className="flex flex-col justify-center mb-6"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div className="form-group">
                      <Label label="Phone Number" />

                      <Controller
                        name={name}
                        control={control}
                        rules={rules}
                        defaultValue={formatPhoneNumberIntl("12345678900")}
                        render={({ field }) => {
                          return (
                            <PhoneInput
                              {...field}
                              name={name}
                              placeholder="Enter phone number"
                              international={true}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              className="rounded-md h-12"
                            />
                          );
                        }}
                      />
                      {errors?.phone && (
                        <span className="text-red-400 text-sm mt-2 ml-10">
                          {errors?.phone?.message}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex ms-auto">
                        <Link
                          href="/auth/signup"
                          className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                        >
                          Sign Up with Email?
                        </Link>
                      </div>
                    </div>
                    {loading ? (
                      <button
                        disabled={loading}
                        type="submit"
                        className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                      >
                        <img
                          src="/loader/spinner.gif"
                          alt="Loading"
                          width={20}
                          height={10}
                        />
                        <span className="font-serif ml-2 font-light">
                          Processing
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </form>

                <BottomNavigation
                  desc
                  route={"/auth/login"}
                  pageName={"Login"}
                  loginTitle="Sign Up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PhoneSignup;
