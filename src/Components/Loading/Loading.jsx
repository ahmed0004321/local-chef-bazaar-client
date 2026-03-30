import React from "react";
import { FadeLoader } from "react-spinners";

const Loading = ({ 
  loading = true, 
  color = "#f38b0c", 
  inline = false,
  height = 15,
  width = 5,
  radius = 2,
  margin = 2
}) => {
  if (inline) {
    return (
      <div className="flex flex-col items-center justify-center py-4 w-full animate-fade-in">
        <FadeLoader 
          color={color} 
          loading={loading} 
          height={height} 
          width={width} 
          radius={radius} 
          margin={margin} 
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm z-[9999] animate-fade-in">
      <div className="relative">
        <FadeLoader color={color} loading={loading} />
      </div>
      <p className="mt-8 text-primary font-bold animate-pulse tracking-widest uppercase text-[10px]">
        Local Chef Bazaar
      </p>
    </div>
  );
};

export default Loading;
