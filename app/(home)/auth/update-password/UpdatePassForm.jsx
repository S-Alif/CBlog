"use client"

import FormWrapper from "@/components/forms/FormWrapper";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import InputField from "@/components/forms/InputField";
import {useRouter} from "next/navigation";
import apiHandler from "@/helpers/api/apiHandler";
import {POST, routes} from "@/helpers/api/apiConstants";

// update password form schema
const formSchema = z.object({
    pass: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(15, { message: "Password must be at most 15 characters" }),
    confirmPass: z.string()
        .min(8, { message: "Confirm password must be at least 8 characters" })
        .max(15, { message: "Confirm password must be at most 15 characters" }),
}).refine((data) => data.pass === data.confirmPass, {
    message: "Passwords must match",
    path: ["confirmPass"],
})

// default values
const defaultValues = {
    pass: "",
    confirmPass: ""
}

export default function UpdatePassForm() {
    
    const router = useRouter()
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    })
    
    // form field list
    const formFields = [
        <InputField
            type={"password"}
            form={form}
            label={"New Password"}
            name={"pass"}
            placeholder={"Enter new password"}
        />,
        <InputField
            type={"password"}
            form={form}
            label={"Re-type new password"}
            name={"confirmPass"}
            placeholder={"Re-type your new password"}
        />
    ]
    
    // loading state
    const [loading, setLoading] = useState(false)
    const additionalDataToUpdatePass = useRef(null)
    
    // form submit
    const handleFormSubmit = async (values) => {
        // console.log(values)
        const data = {
            ...additionalDataToUpdatePass.current,
            ...values,
        }
        setLoading(true)
        const result = await apiHandler(
            routes.auth.updateForgetPass,
            POST,
            data,
            true
        )
        
        if(result) {
            form.reset(defaultValues)
            sessionStorage.removeItem("sendOtpData")
            return router.replace("/auth/login")
        }
        setLoading(false)
    }
    
    // set the data from session storage
    useEffect(() => {
        const additionalDataFromStorage = JSON.parse(sessionStorage.getItem("sendOtpData"))
        if(!additionalDataFromStorage) {
            return router.replace("/auth/login")
        }
        additionalDataToUpdatePass.current = additionalDataFromStorage
    }, [])
    
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Reset password"}
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