"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, ChevronDown, CircleHelp, Code, TriangleAlert, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavDropdown() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme =
      currentTheme === "system"
        ? "dark"
        : currentTheme === "dark"
        ? "light"
        : "system";
    setTheme(nextTheme);
  };

  return (
    <div className="flex sm:hidden items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-5 mt-[7px]">
          <DropdownMenuLabel>
            <p className="font-normal">nmath.com</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <CircleHelp className="mr-2 h-4 w-4" />
              <span>about</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TriangleAlert className="mr-2 h-4 w-4" />
              <span>disclaimer</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Code className="mr-2 h-4 w-4" />
              <span>source code</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={toggleTheme}>
            {currentTheme === "dark" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : currentTheme === "light" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Monitor className="mr-2 h-4 w-4" />
            )}

              <span>
                {(currentTheme ?? "system").charAt(0).toUpperCase() + (currentTheme ?? "system").slice(1)}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
