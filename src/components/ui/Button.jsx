import React from 'react';

/**
 * Button component with various styles
 *
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, danger, success, or text)
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take the full width
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Button({
                                   variant = 'primary',
                                   disabled = false,
                                   leftIcon,
                                   rightIcon,
                                   size = 'md',
                                   fullWidth = false,
                                   children,
                                   onClick,
                                   className = '',
                                   ...props
                               }) {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none";

    // Size classes
    const sizeClasses = {
        sm: "text-xs px-2 py-1 gap-1",
        md: "text-sm px-3 py-2 gap-2",
        lg: "text-base px-4 py-2 gap-2"
    };

    // Variant classes
    const variantClasses = {
        primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/80",
        danger: "bg-danger text-white hover:bg-danger/90 active:bg-danger/80",
        success: "bg-success text-white hover:bg-success/90 active:bg-success/80",
        text: "bg-transparent text-text-primary hover:bg-card active:bg-card/80"
    };

    // Full width class
    const widthClass = fullWidth ? "w-full" : "";

    // Disabled class
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

    const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${disabledClass}
    ${className}
  `;

    return (
        <button
            className={classes}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            {...props}
        >
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
}
