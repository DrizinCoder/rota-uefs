import { Clock, Navigation2 } from "lucide-react";
import { ROUTE_STOPS, ROUTE_INFO_ITEMS } from "@/components/shared/landing-constants";

export function LandingRouteMap() {
  return (
    <section id="trajeto" className="bg-[#f0f4f8] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#73AABF] uppercase tracking-widest">Trajeto</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#103173] mt-1">
            MAPA DA <span className="text-[#F2D022]">ROTA</span>
          </h2>
          <p className="text-sm text-[#73AABF] font-medium mt-2 max-w-md mx-auto">
            Confira o trajeto percorrido entre Salvador e o Campus da UEFS em Feira de Santana.
          </p>
          <div className="w-12 h-1 bg-[#F2D022] mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#e0e8f0]">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Map visual */}
            <div className="lg:col-span-3 relative min-h-[420px] bg-gradient-to-br from-[#e8f4f8] to-[#d0e8f0] overflow-hidden">
              {/* Embedded Google Maps — BR-324 Salvador ↔ Feira de Santana */}
              <iframe
                title="Trajeto Salvador — Feira de Santana"
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d497098.6!2d-39.1!3d-12.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x7161402750427e1%3A0xf3e71e61f2b53e0!2sSalvador%2C%20BA!3m2!1d-12.9714!2d-38.5124!4m5!1s0x71439d471b08d3d%3A0x8040a64e68c4f74!2sFeira%20de%20Santana%2C%20BA!3m2!1d-12.2669!2d-38.9666!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Route stops */}
            <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-[#103173]/8 px-3 py-1 rounded-full mb-6 w-fit">
                <Navigation2 className="h-3.5 w-3.5 text-[#103173]" />
                <span className="text-[10px] font-bold text-[#103173] uppercase tracking-widest">
                  Salvador ↔ Feira de Santana
                </span>
              </div>

              <div className="space-y-0">
                {ROUTE_STOPS.map((stop, i) => {
                  const isFirst = i === 0;
                  const isLast = i === ROUTE_STOPS.length - 1;
                  return (
                    <div key={stop.name} className="flex items-start gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-[3px] flex-shrink-0 ${
                            isFirst || isLast
                              ? "border-[#F2D022] bg-[#F2D022]"
                              : "border-[#73AABF] bg-white"
                          }`}
                        />
                        {!isLast && (
                          <div className="w-0.5 h-10 bg-gradient-to-b from-[#73AABF]/40 to-[#73AABF]/10" />
                        )}
                      </div>
                      {/* Info */}
                      <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                        <p className={`text-sm font-extrabold ${isFirst || isLast ? "text-[#103173]" : "text-[#103173]/70"}`}>
                          {stop.name}
                        </p>
                        <p className="text-xs text-[#73AABF] font-medium">{stop.sub}</p>
                        {stop.time && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F2D022] mt-1">
                            <Clock className="h-3 w-3" /> {stop.time}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-[#f0f4f8] rounded-xl p-4">
                <p className="text-[10px] font-bold text-[#103173]/50 uppercase tracking-wider mb-1">Informações</p>
                <ul className="space-y-1.5">
                  {ROUTE_INFO_ITEMS.map((item) => (
                    <li key={item.text} className="flex items-center gap-2 text-xs text-[#103173] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
