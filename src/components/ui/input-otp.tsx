"use client";

import * as React from "react";
import { DashIcon } from "@radix-ui/react-icons";
import { OTPInput, OTPInputContext } from "input-otp";

import { cn } from "@/lib/utils";

const InputOTP = ({
	ref,
	className,
	containerClassName,
	...props
}: React.ComponentPropsWithoutRef<typeof OTPInput> & {
	ref: React.RefObject<React.ElementRef<typeof OTPInput>>;
}) => (
	<OTPInput
		ref={ref}
		containerClassName={cn(
			"flex items-center gap-2 has-[:disabled]:opacity-50",
			containerClassName,
		)}
		className={cn("disabled:cursor-not-allowed", className)}
		{...props}
	/>
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = ({
	ref,
	className,
	...props
}: React.ComponentPropsWithoutRef<"div"> & {
	ref: React.RefObject<React.ElementRef<"div">>;
}) => (
	<div ref={ref} className={cn("flex items-center", className)} {...props} />
);
InputOTPGroup.displayName = "InputOTPGroup";

interface InputOTPSlotProps extends React.ComponentProps<"div"> {
  ref?: React.Ref<HTMLDivElement>;
  index: number;
  className?: string;
}

const InputOTPSlot = ({ ref, index, className, ...props }: InputOTPSlotProps) => {
	const inputOTPContext = React.useContext(OTPInputContext);
	const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

	return (
		<div
			ref={ref}
			className={cn(
				"relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
				isActive && "z-10 ring-1 ring-ring",
				className,
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
				</div>
			)}
		</div>
	);
};
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = ({
	ref,
	...props
}: React.ComponentPropsWithoutRef<"div"> & {
	ref: React.RefObject<React.ElementRef<"div">>;
}) => (
	<div ref={ref} role="separator" {...props}>
		<DashIcon />
	</div>
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
