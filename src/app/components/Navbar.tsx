import React from "react";

import MobileSidebar from "@/app/components/MobileSidebar";
import UserIcon from "@/app/components/UserIcon";

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="w-full flex justify-end">
        <UserIcon />
      </div>
    </div>
  );
};

export default Navbar;
