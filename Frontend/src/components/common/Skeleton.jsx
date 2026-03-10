import React from "react";

const Skeleton = ({
  className = "",
  width,
  height,
  borderRadius = "0.75rem",
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200 animate-pulse ${className}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
        borderRadius,
      }}
    >
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export default Skeleton;
