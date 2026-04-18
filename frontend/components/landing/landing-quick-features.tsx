import { QUICK_FEATURES } from "@/components/shared/landing-constants";

export function LandingQuickFeatures() {
  return (
    <section className="bg-[#f0f4f8] py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {QUICK_FEATURES.map((f) => (
            <div
              key={f.label}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-[#F2D022]/30 hover:-translate-y-1"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: f.color + "15" }}
              >
                <f.icon className="h-7 w-7" style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-extrabold text-[#103173] mb-1">{f.label}</h3>
              <p className="text-sm text-[#73AABF] font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
