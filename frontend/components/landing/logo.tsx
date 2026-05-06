"use client"
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center">
      <Image
        src="/images/logo_rota_horizontal.png"
        alt="Rota UEFS"
        width={480}
        height={120}
        className="h-10 w-auto max-w-[220px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );
}