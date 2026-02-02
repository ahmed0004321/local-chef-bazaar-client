import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = ({ loading = true, size = 50, color = "#6366F1" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <ClipLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Loading;
