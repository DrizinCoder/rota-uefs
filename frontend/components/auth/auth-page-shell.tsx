import { cn } from "@/lib/utils";

type AuthPageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AuthPageShell({ children, className }: AuthPageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center bg-white p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
