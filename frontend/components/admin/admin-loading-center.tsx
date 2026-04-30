import { Loader2 } from "lucide-react";

type AdminLoadingCenterProps = {
  message: string;
};

export function AdminLoadingCenter({ message }: AdminLoadingCenterProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="h-8 w-8 text-[#103173] animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}
