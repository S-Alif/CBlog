"use client"

import infoStore from "@/stores/infoStore";
import { z } from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import apiHandler from "@/helpers/api/apiHandler";
import {PATCH, POST, routes} from "@/helpers/api/apiConstants";
import {useState} from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import InputField from "@/components/forms/InputField";


// category schema
const formSchema = z.object({
    name: z
        .string({ required_error: "Category name is required" })
        .min(3, { message: "Category name must be at least 3 characters" })
        .max(30, { message: "Category name must not exceed 30 characters" }),
    
    image: z
        .string({ required_error: "Category image URL is required" })
        .max(1000, { message: "Image URL must not exceed 1000 characters" })
        .url({ message: "Image must be a valid URL" }),
})

// category form
export default function CategoryForm({data}) {
    
    const {getInitialData} = infoStore()
    const [loading, setLoading] = useState(false)
    const defaultValues = {
        name: data?.name || "",
        image: data?.image || "",
    }
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })
    
    // form submit
    const handleFormSubmit = async (values) => {
        
        let url = routes.category
        if(data?._id){
            url = `${routes.category}/${data?._id}`
        }
        const method = data?._id ? PATCH : POST
        
        setLoading(true)
        const result = await apiHandler(
            url,
            method,
            values,
            true,
            true
        )
        if(result) await getInitialData()
        if(!data?._id) form.reset(defaultValues)
        setLoading(false)
    }
    
    // form fields
    const formFields = [
        <InputField
            type={"text"}
            form={form}
            label={"Category name"}
            name={"name"}
            placeholder={"Enter category name"}
            disabled={loading}
        />,
        <InputField
            type={"text"}
            form={form}
            label={"Category image URL"}
            name={"image"}
            placeholder={"Enter image URL"}
            disabled={loading}
        />
    ]
    
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Save Category"}
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