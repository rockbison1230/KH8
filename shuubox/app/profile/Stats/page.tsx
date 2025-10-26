import React from "react";
import Sidebars from "@/Components/Sidebara";
import Statspage from "@/Components/Statspage";
const page = () => {
  return (
    <div className="flex justify-between">
      <Sidebars />
      <Statspage/>
      </div>
  );
};

export default page;
