'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

const Footer: React.FC = () => {
  const [latestCommit, setLatestCommit] = useState<Commit | null>(null);
  const currentYear = new Date().getFullYear();
  const enableApiFetch = true;

  useEffect(() => {
    const fetchLatestCommit = async () => {
      if (enableApiFetch) {
        try {
          const response = await axios.get<Commit[]>(
            'https://api.github.com/repos/wanmaixd/nmath/commits'
          );
          if (response.data.length > 0) {
            setLatestCommit(response.data[0]);
          }
        } catch (err) {
          console.error('Failed to fetch the latest commit:', err);
        }
      }
    };

    fetchLatestCommit();
  }, [enableApiFetch]);

  return (
    <footer className="mt-10 flex text-xs text-center dark:text-gray-400 text-gray-500 font-mono">
      <div className="grow text-left">
        commit{" "}
        {latestCommit ? (
          <Link target="_blank" rel="noopener noreferrer" href={latestCommit.html_url} className="transition-colors duration-200 ease-in-out hover:text-orange-600">
            @{latestCommit.sha.substring(0, 7)} on {latestCommit.commit.author.date}
          </Link>
        ) : (
          "is loading"
        )}
      </div>
      <div>&copy; {currentYear}</div>
    </footer>
  );
};

export default Footer;