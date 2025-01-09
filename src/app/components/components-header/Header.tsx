"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import LogoutModal from "../../../modules/auth/components/modal-logout";

const Header = () => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogoutModalOpen(false);
    router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-36 w-full bg-[#393939] rounded-b-[1rem] flex flex-col items-center">
      <div className="mx-auto flex justify-between max-w-[2000px] w-full md:p-6 p-3 md:items-center">
        <div onClick={handleBack} className="cursor-pointer">
          <Image src="/arrowBack.png" alt="Back Icon" width={20} height={20} className="w-10 h-10" />
        </div>

        <div className="mt-6 md:mt-0">
          <Image src="/iglesiaIcon.png" alt="Iglesia Icon" width={40} height={40} className="w-10 h-10" />
        </div>

        <div onClick={() => setLogoutModalOpen(true)}>
          <Image src="/userIcon.png" alt="User Icon" width={20} height={20} className="w-10 h-10 cursor-pointer" />
        </div>
      </div>
      <div className="border-b border-[#BD1400] w-[180px] text-center">
        <h1 className="text-xl font-semibold text-white">SANTA TERESA</h1>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Header;