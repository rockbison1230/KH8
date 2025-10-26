import React from "react";

const Statspage = () => {
  return (
    <div className="w-[80%] mx-auto, py-8 px-4">
      <div className="flex items-center gap-x-5 mb-6">
        <img
          className="w-20 h-20 rounded-full border-4 "
          src="/Images/PFPplaceholder.png"
          alt="user pfp"
        />
        <h1 className="text-4xl">Your Stats</h1>
      </div>
      <div className="mr-6">
      <div className="flex justify-between items-center gap-20 ">
        <div className="bg-[#FFEBFF] rounded-4xl border-4 w-2/3 h-80">
          <h2>g</h2>
        </div>
        <div className="bg-[#FFEBFF] rounded-4xl border-4 w-1/3 h-80">
          <h2>l</h2>
        </div>
      </div>
      <div className="bg-[#FFEBFF] rounded-4xl border-4 h-80 mt-7" ></div>
      </div>
    </div>
  );
};

export default Statspage;
