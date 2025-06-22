/**
 * SelectField is a reusable select (dropdown) component that integrates with
 * react-hook-form and ShadCN UI components.
 *
 * It handles form registration, validation messages, and allows you to pass in
 * custom `<SelectItem>` elements as children for options.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} [props.label="Form Label"] - The label displayed above the select field.
 * @param {string} [props.name="FormLabel"] - The name of the field used by react-hook-form.
 * @param {Object} props.form - The form object returned by `useForm` from `react-hook-form`.
 * @param {string} [props.placeholder="Form placeholder"] - Placeholder text shown when no value is selected.
 * @param {string|null} [props.description=null] - Optional description displayed below the field.
 * @param {React.ReactNode} props.children - The select options (`<SelectItem>`) to render inside the dropdown.
 *
 * @returns {JSX.Element} A select field integrated with form control and validation handling.
 *
 * @example
 * <SelectField
 *   label="Choose role"
 *   name="role"
 *   form={form}
 *   placeholder="Select a role"
 *   description="You can change this later"
 * >
 *   <SelectItem value="admin">Admin</SelectItem>
 *   <SelectItem value="editor">Editor</SelectItem>
 *   <SelectItem value="viewer">Viewer</SelectItem>
 * </SelectField>
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
import {
    Select,
    SelectContent,
    SelectValue,
    SelectTrigger
} from "@/components/ui/select";

export default function SelectField ({
    label = "Form Label",
    name="FormLabel",
    form,
    placeholder = "Form placeholder",
    description = null,
    disabled = false,
    children
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {children}
                        </SelectContent>
                    </Select>
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