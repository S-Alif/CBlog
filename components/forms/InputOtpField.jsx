/**
 * InputOtpField is a form field component designed for OTP (One-Time Password) input.
 * It integrates with `react-hook-form` and supports optional labels and descriptions.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} [props.label="Form Label"] - The label displayed above the OTP input field.
 * @param {string} [props.name="FormLabel"] - The field name used by `react-hook-form`.
 * @param {Object} props.form - The `react-hook-form` object containing `control` for field registration.
 * @param {string|null} [props.description=null] - Optional helper text shown below the input.
 *
 * @returns {JSX.Element} A form field component for entering OTP codes.
 *
 * @example
 * <InputOtpField
 *   label="Enter OTP"
 *   name="otp"
 *   form={form}
 *   description="Check your email for the 6-digit code"
 * />
 */


"use client"

import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";

export default function InputOtpField ({
    label = "Form Label",
    name="FormLabel",
    form,
    description = null,
    disabled = false,
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <InputOTP {...field} maxLength={6} disabled={disabled} >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </FormControl>
                    {
                        description &&
                        <FormDescription>
                            {description}
                        </FormDescription>
                    }
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}