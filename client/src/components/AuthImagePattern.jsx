import React from "react";

function AuthImagePattern({ title, subtitle }) {
  return (
    <div className="hidden md:flex justify-center items-center bg-base-200 p-10">
      <div className="max-w-fit text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-base-content/50 m-2">{subtitle}</p>
        <div className="grid grid-cols-3 gap-3 p-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${
                i % 2 === 0 ? "bg-primary/30 animate-pulse" : "bg-primary/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthImagePattern;
