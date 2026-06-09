import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingQuickFeatures } from "@/components/landing/landing-quick-features";
import { LandingRouteMap } from "@/components/landing/landing-route-map";
import { LandingContact } from "@/components/landing/landing-contact";

export default function PaginaInicial() {
  return (
    <main className="min-h-screen bg-[#f0f4f8]">
      <LandingNavbar />
      <LandingHero />
      <LandingQuickFeatures />
      <LandingRouteMap />
      <LandingContact />    </main>
  );
}
