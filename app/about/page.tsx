import React from "react";
import MainNav from "@/components/nav/mainNav";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Footer from "@/components/footer/gitFooter";

export default function Page() {
  const currentDate = new Date();
  const targetDate = new Date("2025-08-14");

  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  let daysUntilTarget = daysDifference;
  return (
    <main className="py-5">
      <div className="max-w-4xl mx-auto px-5">
        <div className="mb-10">
          <MainNav />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/about">about</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <p className="text-2xl">about</p>
          <p>
            this website was created purely for fun, and we certainly do not intend to offend anyone. if you spot a mistake or encounter any issues, please feel free to open a pull request or report the problem on our github repository.
          </p>
          <br />
          <p>
            this domain was purchased on 2024-15-07, and will expires in approximately {daysUntilTarget}{" "}
            days. we currently have no intention of renewing it.
          </p>
        </div>

        <Footer />
      </div>
    </main>
  );
}
