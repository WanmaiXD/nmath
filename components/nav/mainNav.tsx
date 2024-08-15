"use client";
import React, { useState } from "react";
import { ModeToggle } from "../theming/themeToggle";
import Link from "next/link";

const MainNav = () => {
  return (
    <nav className="rounded-md">
      <div className="mx-auto flex justify-between items-center">
        <Link href={'/'} className="text-black dark:text-white text-2xl">nmath.com</Link>

        <div className={`flex items-center space-x-4`}>
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
      </div>
    </nav>
  );
};

export default MainNav;
