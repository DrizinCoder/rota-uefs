interface CurrentDayHeaderProps {
  dayName?: string;
}

export function CurrentDayHeader({ dayName }: CurrentDayHeaderProps) {
  if (!dayName) return null;

  return (
    <div className="flex items-center gap-3 mb-5 mt-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
      <span className="text-xs font-bold text-[#73AABF] uppercase tracking-widest">{dayName}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
    </div>
  );
}
