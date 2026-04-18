import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingQuickFeatures } from "@/components/landing/landing-quick-features";
import { LandingRouteMap } from "@/components/landing/landing-route-map";
import { LandingContact } from "@/components/landing/landing-contact";
import { FooterSection } from "@/components/landing/footer-section";

export default function PaginaInicial() {
  return (
    <main className="min-h-screen bg-[#f0f4f8]">
      <LandingNavbar />
      <LandingHero />
      <LandingQuickFeatures />
      <LandingRouteMap />
      <LandingContact />
      <FooterSection />
    </main>
  );
}