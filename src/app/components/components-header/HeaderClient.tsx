"use client";
import { usePathname } from 'next/navigation';
import Header from './Header';

const HeaderClient = () => {
  const pathname = usePathname();
  const showHeader = pathname !== "/";

  return showHeader ? <Header /> : null;
};

export default HeaderClient;
