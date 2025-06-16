"use client"

import InputField from "@/components/forms/InputField";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { useState } from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import apiHandler from "@/helpers/api/apiHandler";
import {POST, routes} from "@/helpers/api/apiConstants";
import {useRouter} from "next/navigation";
import actorStore from "@/stores/actorStore";

// login form schema
const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    pass: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(15, { message: "Password cannot be more than 15 characters" }),
})

// default values
const defaultValues = {
    email: "",
    pass: "",
}

// login form
export default function LoginForm() {
    
    const router = useRouter()
    const {setUser} = actorStore()
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    })
    
    // form field list
    const formFields = [
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
        />
    ]
    
    // loading state
    const [loading, setLoading] = useState(false)
    
    // form submit
    const handleFormSubmit = async (values) => {
        setLoading(true)
        const result = await apiHandler(
            routes.auth.login,
            POST,
            values,
            true
        )
        setLoading(false)
        if(!result) return
        
        await setUser()  // get user profile
        form.reset(defaultValues) // empty login form
        router.replace("/profile") // go to profile page
    }
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Login"}
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