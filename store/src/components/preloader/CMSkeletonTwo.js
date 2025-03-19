import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CMSkeletonTwo = ({
  count,
  height,
  width,
  color,
  error,
  textAlign,
  loading = false,
  highlightColor,
}) => {
  return (
    <>
      {loading ? (
        <div className={textAlign ? "text-right" : "text-center"}>
          <Skeleton
            count={count || 6}
            height={height || 22}
            width={`${width}%` || "100%"}
            // className="bg-gray-200"
            baseColor={color || "#f1f5f9"}
            // direction="left"
            highlightColor={highlightColor || "#cbd5e1"}
          />
        </div>
      ) : error ? (
        <span className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
          {error?.response?.data?.message || error?.message}
        </span>
      ) : null}
    </>
  );
};

export default CMSkeletonTwo;
