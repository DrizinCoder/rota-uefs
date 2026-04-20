interface CurrentDayHeaderProps {
  dayName?: string;
}

export function CurrentDayHeader({ dayName }: CurrentDayHeaderProps) {
  if (!dayName) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold text-[#103173]/40 uppercase tracking-widest">{dayName}</span>
    </div>
  );
}
