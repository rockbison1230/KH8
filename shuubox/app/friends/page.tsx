import React from "react";
import Sidebar from "@/Components/sidebar";

function ListFriend({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center space-y-2 px-40">
        <div className="bg-gray-200 rounded-full h-28 w-28 flex items-center justify-center border-4"></div>
        <span className="font-semibold text-center">{title}</span>
    </div>
  );
}

const Friendpage = () => {
  return (
    <div className="flex flex-col w-[80%] mx-auto py-10 px-10">
        <div className="flex">
            <Sidebar />

            {/* main section */}
            <div className="flex-1 ml-10">
                <div className="flex items-center gap-x-5 mb-6">
                <img src={"ShuubotIcon.svg"} alt="Shuubot" className="w-12 h-12" />

                <h1 className="text-4xl">Your Friends</h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-15" >
                    <ListFriend title="amana" />
                    <ListFriend title="cal" />
                    <ListFriend title="gabriel" />
                    <ListFriend title="sophia" />
                    <ListFriend title="KT" />
                    <ListFriend title="knightro" />
                </div>
            </div>

        </div>

    </div>
  );
};

export default Friendpage;