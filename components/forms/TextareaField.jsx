/**
 * TextareaField is a reusable textarea component that integrates with
 * react-hook-form using the FormField wrapper from ShadCN UI.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} [props.label="Form Label"] - The label text for the textarea.
 * @param {string} [props.name="FormLabel"] - The name used to register the field with react-hook-form.
 * @param {Object} props.form - The form object returned by useForm from react-hook-form.
 * @param {string} [props.placeholder="Form placeholder"] - Placeholder text displayed in the textarea.
 * @param {string|null} [props.description=null] - Optional description text shown below the textarea.
 *
 * @returns {JSX.Element} A styled textarea field component with label, description, and validation messages.
 *
 * @example
 * <TextareaField
 *   label="Your Message"
 *   name="message"
 *   form={form}
 *   placeholder="Type your message here..."
 *   description="Please keep your message under 500 characters."
 * />
 */

"use client"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";

export default function TextareaField({
    label = "Form Label",
    name="FormLabel",
    form,
    placeholder = "Form placeholder",
    description = null,
    disabled=false
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            placeholder={placeholder}
                            className="resize-none"
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