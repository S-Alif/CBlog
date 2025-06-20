"use client"

import InputField from "@/components/forms/InputField";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { useState } from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import SelectField from "@/components/forms/SelectField";
import {SelectItem} from "@/components/ui/select";
import TextareaField from "@/components/forms/TextareaField";
import apiHandler from "@/helpers/api/apiHandler";
import {routes, POST} from "@/helpers/api/apiConstants";
import {useRouter} from "next/navigation";


// form schema
const formSchema = z.object({
    name: z.string()
        .min(5, { message: "Name must be at least 5 characters" })
        .max(100, { message: "Name must be at most 100 characters" }),
    email: z.string()
        .email({ message: "Invalid email address" }),
    pass: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(20, { message: "Password must be at most 20 characters" }),
    about: z.string()
        .min(100, { message: "About must be at least 100 characters" })
        .max(500, { message: "About must be at most 500 characters" }).optional().nullable().or(z.literal("")),
    gender: z.enum(["male", "female", "other"]).default(""),
    approveCreds: z.string()
        .min(50, { message: "Credentials must be at least 50 characters" })
        .max(150, { message: "Credentials must be at most 150 characters" })
})

// default values
const defaultValues = {
    name: "",
    email: "",
    pass: "",
    gender: "male",
    approveCreds: "",
}

// register form
export default function RegisterForm () {
    
    const router = useRouter()
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    })
    
    // form field list
    const formFields = [
        <InputField
            type={"text"}
            form={form}
            label={"Your name"}
            name={"name"}
            placeholder={"Enter your full name"}
        />,
        <InputField
            type={"email"}
            form={form}
            label={"Email address"}
            name={"email"}
            placeholder={"Enter your email address"}
        />,
        <InputField
            type={"password"}
            form={form}
            label={"Password"}
            name={"pass"}
            placeholder={"Enter your password"}
        />,
        <SelectField
            label={"Your gender"}
            name={"gender"}
            form={form}
            placeholder={"Select your gender"}
        >
            {
                ["male", "female", "other"].map((item, index) => (
                    <SelectItem value={item} key={index}>{item.toUpperCase()}</SelectItem>
                ))
            }
        </SelectField>,
        <TextareaField
            form={form}
            label={"Approve credentials"}
            name={"approveCreds"}
            placeholder={"ID: CSE-02707000, Batch: 28-D-A, phone: +8801632XXXXXX"}
        />
    ]
    
    // loading state
    const [loading, setLoading] = useState(false)
    
    // form submit
    const handleFormSubmit = async (values) => {
        // console.log(values)
        setLoading(true)
        const result = await apiHandler(
            routes.auth.register,
            POST,
            values,
            true
        )
        
        if(result) {
            form.reset(defaultValues)
            // set the email and type to session storage
            const sendOtpData = {
                email: values.email,
                type: 10
            }
            sessionStorage.setItem("sendOtpData", JSON.stringify(sendOtpData))
            
            // go to send-otp page
            // otp will be sent from there
            router.replace("/auth/verify-otp")
            return
        }
        setLoading(false)
    }
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Register account"}
            loading={loading}
        >
            {
                formFields.map((field, index) => (
                    <div key={index} className={"mb-4"}>
                        {field}
                    </div>
                ))
            }
        
        </FormWrapper>
    )
}