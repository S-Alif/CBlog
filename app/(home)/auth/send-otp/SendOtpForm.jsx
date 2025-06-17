"use client"

import FormWrapper from "@/components/forms/FormWrapper";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import InputField from "@/components/forms/InputField";
import {useRouter} from "next/navigation";

// send-otp form schema
const formSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"})
})

// default values
const defaultValues = {
    email: "",
}

// send otp form
export default function SendOtpForm() {
    
    const router = useRouter()
    
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
        sessionStorage.setItem("sendOtpData", JSON.stringify(values))
        form.reset(defaultValues)
        router.replace("/auth/verify-otp")
    }
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Send otp"}
            loading={loading}
        >
            <div className={"mb-4"}>
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your account email"
                    form={form}
                />
            </div>
        </FormWrapper>
    )
}