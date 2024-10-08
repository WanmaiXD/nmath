"use client";
import React from "react";
import { ModeToggle } from "../theming/themeToggle";
import Link from "next/link";
import CounterCard from "./counterCard";
import NavDropdown from "./navDropdown";

const CounterNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-300 dark:border-neutral-700 py-2 px-4">
      <div className="mx-auto flex justify-between items-center max-w-7xl">
        <Link href={"/"} className="text-black dark:text-white text-2xl">
          nmath.com
        </Link>

        <div>
          <CounterCard />
        </div>

        <div className={`hidden sm:flex items-center space-x-4`}>
          <Link
            href="/about"
            className="transition-colors duration-200 ease-in-out hover:text-orange-600"
          >
            [about]
          </Link>

          <Link
            href="/disclaimer"
            className="transition-colors duration-200 ease-in-out hover:text-orange-600"
          >
            [disclaimer]
          </Link>

          <div>
            <ModeToggle />
          </div>
        </div>
        <NavDropdown />
      </div>
    </nav>
  );
};

export default CounterNav;
