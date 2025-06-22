/**
 * InputField is a reusable form input component that integrates with
 * react-hook-form using the FormField wrapper from ShadCN UI.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} [props.label="Form Label"] - The label text for the input field.
 * @param {string} [props.name="FormLabel"] - The name used to register the field with react-hook-form.
 * @param {Object} props.form - The form object returned by useForm from react-hook-form.
 * @param {string} [props.placeholder="Form placeholder"] - Placeholder text displayed in the input.
 * @param {string} [props.type="text"] - The input type (e.g., "text", "email", "password").
 * @param {string|null} [props.description=null] - Optional description text shown below the input.
 *
 * @returns {JSX.Element} A styled form input field component with label, description, and validation messages.
 *
 * @example
 * <InputField
 *   label="Email"
 *   name="email"
 *   form={form}
 *   placeholder="Enter your email"
 *   type="email"
 *   description="We’ll never share your email with anyone else."
 * />
 */

"use client"

import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

export default function InputField ({
    label = "Form Label",
    name="FormLabel",
    form,
    placeholder = "Form placeholder",
    type = "text",
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
                        <Input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                        />
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