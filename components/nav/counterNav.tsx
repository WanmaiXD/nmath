"use client";
import React from "react";
import { ModeToggle } from "../theming/themeToggle";
import Link from "next/link";
import CounterCard from "./counterCard";
import NavDropdown from "./navDropdown";

const CounterNav = () => {
  return (
    <nav className="rounded-md animate-all ease-in-out duration-300">
      <div className="mx-auto flex justify-between items-center">
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
