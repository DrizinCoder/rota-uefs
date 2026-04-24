import { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LabeledIconInputProps = React.ComponentProps<typeof Input> & {
  label: string;
  icon: LucideIcon;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

const baseInputClassName =
  "pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium";

export function LabeledIconInput({
  label,
  icon: Icon,
  containerClassName,
  labelClassName,
  inputClassName,
  ...inputProps
}: LabeledIconInputProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label
        htmlFor={inputProps.id}
        className={cn("text-[#103173] font-bold ml-1", labelClassName)}
      >
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
        <Input {...inputProps} className={cn(baseInputClassName, inputClassName)} />
      </div>
    </div>
  );
}
