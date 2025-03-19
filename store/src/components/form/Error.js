import React from "react";

const Error = ({ error, errorName }) => {
  // console.log("errorName", errorName);

  return (
    <>
      {Array.isArray(errorName?.message) ? (
        <ul className="text-red-400 text-sm mt-2">
          {errorName?.message?.map((msg, index) => (
            <li key={index} className="mb-1">
              {msg}
            </li>
          ))}
        </ul>
      ) : errorName ? (
        <span className="text-red-400 text-sm mt-2">{errorName.message}</span>
      ) : (
        <span className="text-red-400 text-sm mt-2">
          {error?.response?.data?.message || error?.message}
        </span>
      )}
    </>
  );
};

export default Error;
