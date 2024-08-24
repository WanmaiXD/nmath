import React from "react";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen">
        <p
          className="text-center text-8xl text-transparent bg-clip-text bg-gradient-to-tr from-orange-500 to-yellow-400
 font-mono"
        >
          404
        </p>
        <p className="text-center text-3xl">this content is unavailable.</p>
        <p className="text-sm text-neutral-400">
          Please report any invalid links by creating an issue on GitHub.
        </p>
        <div className="flex justify-center pt-3">
          <div>
            <Link href="/">
              <Button className="transition-colors duration-200 ease-in-out hover:bg-orange-600">
                <Undo2 className="mr-2 h-4 w-4" />
                <p>go home</p>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
