"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Music2 } from "lucide-react";

const LOGO_PATH = "/logo.png";

type LogoProps = {
  className?: string;
  showText?: boolean;
  href?: string;
};

export function Logo({ className, showText = true, href = "/" }: LogoProps) {
  const [imgError, setImgError] = React.useState(false);

  const icon = imgError ? (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-10">
      <Music2 className="size-5 sm:size-6" aria-hidden />
    </span>
  ) : (
    <span className="relative flex size-9 shrink-0 sm:size-10">
      <Image
        src={LOGO_PATH}
        alt="Reedio Music"
        width={40}
        height={40}
        className="object-contain dark:invert-0 invert"
        unoptimized
        onError={() => setImgError(true)}
      />
    </span>
  );

  const content = (
    <>
      {icon}
      {showText && (
        <span className="tracking-tight font-semibold text-foreground">
          Reedio Music
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2.5 text-foreground hover:text-primary transition-colors duration-200 ${className ?? ""}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {content}
    </span>
  );
}
