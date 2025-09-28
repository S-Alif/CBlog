"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import FormWrapper from "@/components/forms-ui/form-wrapper";
import { signupSchema } from "@/lib/schemas/auth.schema";
import InputField from "@/components/forms-ui/input-field";
import SelectField from "@/components/forms-ui/select-field";
import TextareaField from "@/components/forms-ui/textarea-field";
import { signUpAction } from "@/lib/actions/auth/sign-up-action";


// default values
const defaultValues = {
    name: "",
    email: "",
    phone: "",
    pass: "",
    confirmPass: "",
    gender: "male",
    approveCreds: "",
}

// form
const SignUpForm = () => {

    const router = useRouter()

    // resolver
    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues,
    })


    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            action={signUpAction}
            submitBtnText={"Submit sign-up request"}
            // loading={loading}
        >
            <div className="flex flex-col gap-4 max-h-80 overflow-y-auto">
                {/* name */}
                <InputField
                    type={"text"}
                    form={form}
                    label={"Your name"}
                    name={"name"}
                    placeholder={"Your name in the university"}
                />

                {/* email */}
                <InputField
                    type={"email"}
                    form={form}
                    label={"Email address"}
                    name={"email"}
                    placeholder={"your.email@gmail.com"}
                />

                {/* phone */}
                <InputField
                    type={"text"}
                    form={form}
                    label={"Phone number"}
                    name={"phone"}
                    placeholder={"018XXXXXXXXX"}
                />

                {/* gender */}
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
                </SelectField>

                {/* approve credentials */}
                <TextareaField
                    form={form}
                    label={"Approve credentials"}
                    name={"approveCreds"}
                    placeholder={"ID: CSE-02707XXX, Batch: 27-D-A"}
                />

                {/* password */}
                <InputField
                    type={"password"}
                    form={form}
                    label={"Password"}
                    name={"pass"}
                    placeholder={"Enter your password"}
                />

                {/* confirm password */}
                <InputField
                    type={"password"}
                    form={form}
                    label={"Confirm Password"}
                    name={"confirmPass"}
                    placeholder={"Re-enter your password"}
                />
            </div>

        </FormWrapper>
    )
}
export default SignUpForm