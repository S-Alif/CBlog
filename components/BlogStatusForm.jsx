// This component is only for admin and moderators

"use client"


import { z } from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useState} from "react";
import { PUT, routes } from "@/helpers/api/apiConstants";
import apiHandler from "@/helpers/api/apiHandler";
import FormWrapper from "@/components/forms/FormWrapper";
import SelectField from "@/components/forms/SelectField";
import {SelectItem} from "@/components/ui/select";
import TextareaField from "@/components/forms/TextareaField";

// blog status change schema for admin
const formSchema = z.object({
    isBlocked: z.enum(["true", "false"]),
    blockReason: z.string()
        .min(100, {message: "Block reason must be at least 100 characters"})
        .max(1000, { message: "Block reason must be at most 1000 characters" })
        .optional()
        .or(z.literal(""))
        .refine((val, ctx) => {
            const isBlocked = ctx?.isBlocked === "true"
            return !(isBlocked && (!val || val.trim() === ""))
            
        }, {
            message: "Block reason is required when isBlocked is true."
        }),
    isFeatured: z.enum(["true", "false"])
})

// blog status change form
export default function BlogStatusForm({data, handleStatusUpdate}) {
    const defaultValues = {
        isFeatured: data?.isFeatured?.toString() ?? "false",
        blockReason: data?.blockReason || "",
        isBlocked: data?.isBlocked?.toString() ?? "false",
    }
    const [loading, setLoading] = useState(false)
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })
    
    // form submit
    const handleFormSubmit = async (values) => {
        
        values = {
            ...values,
            isBlocked: values.isBlocked === "true",
            isFeatured: values.isFeatured === "true",
        }
        
        // return console.log(values)
        setLoading(true)
        const result = await apiHandler(
            `${routes.blog.admin}/${data?._id}`,
            PUT,
            values,
            true,
            true
        )
        if(result) handleStatusUpdate(result)
        setLoading(false)
    }
    
    
    // form fields
    const formFields = [
        <SelectField
            label={"Feature blog"}
            name={"isFeatured"}
            form={form}
            placeholder={"Select feature status"}
            disabled={loading}
        >
            <SelectItem value={"true"}>Yes</SelectItem>
            <SelectItem value={"false"}>No</SelectItem>
        </SelectField>,
        <SelectField
            label={"Block blog"}
            name={"isBlocked"}
            form={form}
            placeholder={"Select action"}
            disabled={loading}
        >
            <SelectItem value={"true"}>Yes</SelectItem>
            <SelectItem value={"false"}>No</SelectItem>
        </SelectField>,
        <TextareaField
            label={"Blocking reason"}
            name={"blockReason"}
            form={form}
            placeholder={"Describe block reason (100 - 1000) characters"}
            disabled={loading}
            description={"Must provide blocking reason if the blog is blocked"}
        />
    ]
    
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Change blog status"}
            loading={loading}
        >
            <div className={"pt-5"}>
                {
                    formFields.map((field, index) => (
                        <div key={index} className={"mb-4"}>
                            {field}
                        </div>
                    ))
                }
            </div>
        
        </FormWrapper>
    );
}
