import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] focus:ring-[#8b5cf6] shadow-lg shadow-purple-500/25',
      secondary: 'bg-[#1f1f2e] text-white hover:bg-[#2a2a3d] border border-[#2a2a3d] focus:ring-[#8b5cf6]',
      ghost: 'text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2e] focus:ring-[#8b5cf6]',
      danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444] shadow-lg shadow-red-500/25',
      success: 'bg-[#10b981] text-white hover:bg-[#059669] focus:ring-[#10b981] shadow-lg shadow-green-500/25',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };
    
    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
