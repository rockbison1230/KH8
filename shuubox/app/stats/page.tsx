import React from "react";
import Sidebar from "@/Components/sidebar";


const Statspage = () => {
  return (
    <div className="flex w-[80%] mx-auto py-8 px-4">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-8">
        {/* Header */}
        <div className="flex items-center gap-x-4 mb-8">
          <img src="/ShuubotIcon.svg" alt="Shuubot" className="w-10 h-10" />
          <h1 className="text-4xl font-semibold">Stats</h1>
        </div>

        {/* Top Row */}
        <div className="flex justify-center gap-2 mb-6 mt-40">
          <div className="bg-[#FFEBFF] rounded-3xl border-4 w-60 h-50 flex items-center justify-center">
            <h2 className="text-xl font-semibold">2 lists completed!</h2>
          </div>
          <div className="bg-[#FFEBFF] rounded-3xl border-4 w-60 h-50 flex items-center justify-center">
            <h2 className="text-xl font-semibold">40 day streak!</h2>
          </div>
        </div>
        {/* Bottom Box */}
        <div className="flex justify-center gap-2 mb-6">
        <div className="bg-[#FFEBFF] rounded-3xl border-4 h-50 w-100 flex items-center justify-center">
            <h2 className="text-xl font-semibold">Added your first friend!</h2>
        </div>
            
        </div>

      </div>
    </div>
  );
};

export default Statspage;
