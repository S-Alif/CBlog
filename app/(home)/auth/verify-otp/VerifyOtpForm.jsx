"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import InputOtpField from "@/components/forms/InputOtpField";

// form schema
const formSchema = z.object({
    otp: z.string().length(6, {message: "Otp is required"})
})

// default values
const defaultValues = {
    otp: ""
}

// verify otp form
export default function VerifyOtpForm() {
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    })
    
    // loading state
    const [loading, setLoading] = useState(false)
    
    // form submit
    const handleFormSubmit = async (values) => {
        console.log(values)
        form.reset(defaultValues)
    }
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Verify account"}
            loading={loading}
        >
            <div className="mb-4">
                <InputOtpField
                    label="Otp code"
                    name="otp"
                    form={form}
                />
            </div>
        </FormWrapper>
    )
}