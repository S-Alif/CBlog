/**
 * FormWrapper is a reusable form component that integrates `react-hook-form` with `zod` validation.
 * It wraps form fields and handles submission and optional form reset.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {ZodSchema} props.formSchema - The Zod schema used for form validation.
 * @param {Object} props.defaultValues - Default values for the form fields.
 * @param {Function} props.onSubmit - Callback function to handle form submission.
 * @param {boolean} [props.resetFormBtn=false] - Whether to show a "Clear form" button that resets the form.
 * @param {string} [props.submitBtnText="Save"] - The text to display on the submit button.
 * @param {React.ReactNode} props.children - Form fields and elements to be rendered inside the form.
 *
 * @returns {JSX.Element} A form wrapper component with integrated validation, submission, and optional reset.
 *
 * @example
 * <FormWrapper
 *   formSchema={myZodSchema}
 *   defaultValues={{ name: "", email: "" }}
 *   onSubmit={(data) => console.log(data)}
 *   resetFormBtn={true}
 *   submitBtnText="Submit"
 * >
 *   <InputField name="name" label="Name" form={form} />
 *   <InputField name="email" label="Email" form={form} />
 * </FormWrapper>
 */


import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";


export default function FormWrapper({
    formSchema,
    defaultValues,
    onSubmit,
    resetFormBtn = false,
    submitBtnText = "Save",
    children
}) {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    // form submit
    function handleSubmit(values) {
        onSubmit(values)
        form.reset(defaultValues)
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                {children}

                {/*form buttons*/}
                <div>
                    <Button type="submit" size={"lg"}>
                        {submitBtnText}
                    </Button>
                    {
                        resetFormBtn &&
                        <Button type="submit" size={"lg"} variant={"outline"}>
                            Clear form
                        </Button>
                    }
                </div>
            </form>
        </Form>
    )
}