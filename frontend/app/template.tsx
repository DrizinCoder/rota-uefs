"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/** TESTE: pôr a `0` para desativar o delay — único sítio a alterar */
const TEST_ROUTE_DELAY_MS = 0;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [gateOpen, setGateOpen] = useState(() => TEST_ROUTE_DELAY_MS <= 0);

  useEffect(() => {
    if (TEST_ROUTE_DELAY_MS <= 0) {
      setGateOpen(true);
      return;
    }
    setGateOpen(false);
    const id = window.setTimeout(
      () => setGateOpen(true),
      TEST_ROUTE_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [pathname]);

  const showOverlay = TEST_ROUTE_DELAY_MS > 0 && !gateOpen;

  return (
    <>
      {showOverlay ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <DotLottieReact
            src="/loading/Bus_carga_trackMile.lottie"
            loop
            autoplay
            style={{ width: 200, height: 200 }}
          />
        </div>
      ) : null}
      {children}
    </>
  );
}
