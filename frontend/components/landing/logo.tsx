"use client"
import Image from "next/image";
import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3 group">
            <Image
                src="/images/logo_rota_white.svg"
                alt="Rota UEFS"
                width={40}
                height={40}
                className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                priority
            />
            <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-lg tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
                    Rota <span className="text-cyan-500">UEFS</span>
                </span>
            </div>
        </Link>
    );
}