'use client';
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
    router.push("/pages/dashboard");
  };

  return (
    <header className="relative z-10 h-36 w-full bg-red-800 rounded-b-[1rem] flex flex-col items-center justify-between p-3 md:p-6">
      <div className="mx-auto flex justify-between w-full max-w-[2000px] items-center">
        {/* Icono de retroceso - Blanco */}
        <div onClick={handleBack} className="cursor-pointer">
          <div className="w-10 h-10 relative">
            <Image 
              src="/corner-up-left.svg" 
              alt="Back Icon" 
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>

        {/* Logo de iglesia y texto SANTA TERESA */}
        <div className="flex flex-col items-center">
          <div className="mt-2 md:mt-0">
            <Image src="/iglesiaIcon.png" alt="Iglesia Icon" width={40} height={40} className="w-10 h-10" />
          </div>
          <div className="border-b border-white w-[180px] text-center mt-2">
            <h1 className="text-xl font-semibold text-white">SANTA TERESA</h1>
          </div>
        </div>

        {/* Icono de usuario - Blanco */}
        <div onClick={() => setLogoutModalOpen(true)} className="cursor-pointer">
          <div className="w-10 h-10 relative">
            <Image 
              src="/user.svg" 
              alt="User Icon" 
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>
      </div>
      
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;