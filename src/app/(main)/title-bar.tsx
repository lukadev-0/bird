"use client";

import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export interface TitleBarProps extends React.HTMLAttributes<HTMLDivElement> {}

const TitleBar = React.forwardRef<HTMLDivElement, TitleBarProps>(
  ({ className, ...props }, ref) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 0);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <div
        className={cn(
          "sticky top-0 z-10 flex h-12 items-center bg-background px-6 text-lg font-semibold shadow-[0_0_16px_20px] shadow-transparent transition-shadow",
          { "shadow-background": scrolled },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

TitleBar.displayName = "TitleBar";
export { TitleBar };
