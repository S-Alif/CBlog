"use client"

import {ZodSchema} from "zod";

/**
 * FormWrapper is a reusable form component that integrates `react-hook-form` with `zod` validation.
 * It wraps form fields and handles submission and optional form reset.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {ZodSchema} [props.form] - The Zod schema used for form validation.
 * @param {Object} [props.defaultValues] - Default values for the form fields.
 * @param {Function} [props.onSubmit] - Callback function to handle form submission.
 * @param {boolean} [props.resetFormBtn=false] - Whether to show a "Clear form" button that resets the form.
 * @param {string} [props.submitBtnText="Save"] - The text to display on the submit button.
 * @param {boolean} [props.loading=false] - Loading state for data submission, form will be disabled when loading.
 * @param {React.ReactNode} props.children - Form fields and elements to be rendered inside the form.
 *
 * @returns {JSX.Element} A form wrapper component with integrated validation, submission and optional reset.
 *
 * @example
 * <FormWrapper
 *   form={myZodSchema}
 *   defaultValues={{ name: "", email: "" }}
 *   onSubmit={(data) => console.log(data)}
 *   resetFormBtn={true}
 *   submitBtnText="Submit"
 * >
 *   <InputField name="name" label="Name" form={form} />
 *   <InputField name="email" label="Email" form={form} />
 * </FormWrapper>
 */



import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";


export default function FormWrapper({
    form,
    defaultValues,
    onSubmit,
    resetFormBtn = false,
    submitBtnText = "Save",
    loading=false,
    children
}) {

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {children}

                {/*form buttons*/}
                <div className={"flex gap-4"}>
                    <Button
                        type="submit"
                        size={"lg"}
                        disabled={loading}
                        className={"flex-grow"}
                    >
                        {submitBtnText} {loading && <span className="w-5 h-5 border-3 border-t-transparent border-gray-100 rounded-full animate-spin"></span>}
                    </Button>
                    {resetFormBtn &&
                        <Button
                            type="button"
                            size={"lg"}
                            variant={"outline"}
                            className={"flex-grow"}
                            disabled={loading}
                            onClick={() => {
                                form.reset(defaultValues)
                            }}
                        >
                            Clear form
                        </Button>
                    }
                </div>
            </form>
        </Form>
    )
}