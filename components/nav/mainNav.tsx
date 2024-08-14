'use client'
import React, { useState } from 'react';

const MainNav = () => {
  return (
    <nav className="rounded-md">
      <div className="mx-auto flex justify-between items-center">
        <div className="text-black dark:text-white text-2xl">
          nmath.com
        </div>

        <div className={`flex items-center space-x-4`}>
          <a href="#" className="text-black dark:text-white hover:text-gray-200">[a]</a>
          <a href="#" className="text-black dark:text-white hover:text-gray-200">[b]</a>
          <a href="#" className="text-black dark:text-white hover:text-gray-200">[c]</a>
          <a href="#" className="text-black dark:text-white hover:text-gray-200">[d]</a>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
