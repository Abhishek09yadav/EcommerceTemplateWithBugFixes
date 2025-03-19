import Link from "next/link";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

//internal imports
import { getUserSession } from "@lib/auth";
import Dashboard from "@pages/user/dashboard";
import Error from "@components/form/Error";
import CustomerServices from "@services/CustomerServices";

const MyAccount = () => {
  const userInfo = getUserSession();

  const { data, error, isLoading } = useQuery({
    queryKey: ["shippingAddress", { id: userInfo?.id }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: userInfo?.id,
      }),
    select: (data) => data?.shippingAddress,
  });

  const hasShippingAddress = data && Object.keys(data).length > 0;

  // console.log("data", data?.shippingAddress);

  return (
    <Dashboard title="my-account" description="This is my account page">
      <div className="overflow-hidden">
        <div className="grid gap-4 mb-8 sm:grid-cols-2 grid-cols-1">
          {/* User Info Card */}
          <div className="flex h-full relative">
            <div className="flex items-center border border-gray-200 w-full rounded-lg p-4 relative">
              <Link
                href="/user/update-profile"
                className="absolute top-2 right-2 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
              >
                Edit
              </Link>
              <div className="flex items-center justify-center rounded-full text-xl text-center mr-4 bg-gray-200">
                {userInfo?.image ? (
                  <img
                    src={userInfo.image}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full bg-gray-50"
                    alt={userInfo?.name[0]}
                  />
                ) : (
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 text-xl font-bold text-center mr-4">
                    {userInfo?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h5 className="leading-none mb-2 text-base font-medium text-gray-700">
                  {userInfo?.name}
                </h5>
                <p className="text-sm text-gray-500">{userInfo?.email}</p>
                <p className="text-sm text-gray-500">{userInfo?.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          {hasShippingAddress ? (
            <div className="flex h-full relative">
              <div className="flex items-center border border-gray-200 w-full rounded-lg p-4 relative">
                <Link
                  href={`/user/add-shipping-address?id=${userInfo?.id}`}
                  className="absolute top-2 right-2 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
                >
                  Edit
                </Link>
                <div className="flex-grow">
                  {!isLoading && error ? (
                    <Error error={error} />
                  ) : (
                    <>
                      <h5 className="leading-none mb-2 text-base font-medium text-gray-700">
                        {data?.name}{" "}
                        <span className="text-xs text-gray-500">
                          (Default Shipping Address)
                        </span>
                      </h5>
                      <p className="text-sm text-gray-500">{data?.contact} </p>
                      <p className="text-sm text-gray-500">{data?.address} </p>
                      <p className="text-sm text-gray-500">
                        {data?.country}, {data?.city}, {data?.area} -
                        {data?.zipCode}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full relative">
              <Link
                href="/user/add-shipping-address"
                className="flex items-center bg-cyan-600 text-white hover:bg-cyan-700 w-full rounded-lg py-3 px-4 text-center relative"
              >
                <FiPlus className="text-xl font-bold text-center mr-4" /> Add
                Default Shipping Address
              </Link>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default MyAccount;
