import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
  <div className="relative">
    <input
      type="checkbox"
      ref={ref}
      className="sr-only"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      {...props}
    />
    <div
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors",
        checked ? "bg-slate-900 text-slate-50 border-slate-900" : "bg-white",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
    >
      {checked && (
        <div className="flex items-center justify-center text-current h-full w-full">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }