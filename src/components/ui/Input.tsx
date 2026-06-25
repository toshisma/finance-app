import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[#a1a1aa]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-white placeholder-[#52525b] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[#ef4444] focus:ring-[#ef4444]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[#a1a1aa]">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-white placeholder-[#52525b] transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[#ef4444] focus:ring-[#ef4444]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
