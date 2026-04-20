export function TripCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-4">
      {children}
    </div>
  );
}