"use client"
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center">
      <Image
        src="/images/logo_rota_white.png"
        alt="Rota UEFS"
        width={320}
        height={100}
        className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        priority
      />
    </Link>
  );
}