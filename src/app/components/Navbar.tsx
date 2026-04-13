import React from "react";

import MobileSidebar from "@/app/components/MobileSidebar";
import { Button } from "@/app/components/ui/button";
import { Menu } from "lucide-react";
import UserIcon from "@/app/components/UserIcon";

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-transparent"
      ></Button>
      <MobileSidebar />
      <div className=" w-full flex justify-end">
        <UserIcon />
      </div>
    </div>
  );
};

export default Navbar;
