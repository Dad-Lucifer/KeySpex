import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-[15px] font-semibold transition-all duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0866F5] text-white shadow-[0_1px_2px_rgba(8,102,245,0.30),0_8px_20px_-6px_rgba(8,102,245,0.45)] hover:bg-[#0556D1] hover:-translate-y-px hover:shadow-[0_1px_2px_rgba(8,102,245,0.30),0_12px_28px_-8px_rgba(8,102,245,0.55)] active:bg-[#0445A8] active:translate-y-0 focus-visible:ring-[#0866F5]",
        outline:
          "border border-[#090B10]/16 bg-transparent text-[#090B10] hover:border-[#090B10] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] focus-visible:ring-[#0866F5]",
        link:
          "group relative bg-transparent text-[#090B10] p-0 h-auto font-semibold hover:text-[#090B10] focus-visible:ring-[#0866F5] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#0866F5] after:origin-left after:scale-x-0 after:transition-transform after:duration-250 after:ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:after:scale-x-100",
        inverse:
          "bg-white text-[#090B10] shadow-[0_1px_2px_rgba(9,11,16,0.04)] hover:bg-[#F8FAFC] focus-visible:ring-[#5B9BFF] focus-visible:ring-offset-[#090B10]",
        linkOnDark:
          "group relative bg-transparent text-white p-0 h-auto font-semibold hover:text-white focus-visible:ring-[#5B9BFF] focus-visible:ring-offset-[#090B10] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#5B9BFF] after:origin-left after:scale-x-0 after:transition-transform after:duration-250 after:ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:after:scale-x-100",
      },
      size: {
        md: "h-11 px-5",
        lg: "h-[52px] px-7 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }

