import React from "react";

function ListFriend({ title }: { title: string }) {
  return (
    <div>
      <div className="bg-gray-200 rounded-full h-60 w-60 flex items-end justify-center p-4 ml-5 border-4"></div>
      <span className="font-semibold">{title}</span>
    </div>
  );
}

const Friendpage = () => {
  return (
    <div className="w-[80%] mx-auto, py-8 px-4">
      <div className="flex items-center gap-x-5 mb-6">
        <img
          className="w-20 h-20 rounded-full border-4 "
          src="/Images/PFPplaceholder.png"
          alt="user pfp"
        />
        <h1 className="text-4xl">Your Friends</h1>
      </div>

      <div className="grid grid-cols-3  p-3" >
      <ListFriend title="1st addition" />
      <ListFriend title="1st addition" />
      <ListFriend title="1st addition" />
      <ListFriend title="1st addition" />
      <ListFriend title="1st addition" />
      <ListFriend title="1st addition" />
      </div>
    </div>
  );
};

export default Friendpage;
