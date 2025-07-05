import { z } from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import infoStore from "@/stores/infoStore";
import {useState} from "react";
import apiHandler from "@/helpers/api/apiHandler";
import {PATCH, POST, routes} from "@/helpers/api/apiConstants";
import FormWrapper from "@/components/forms/FormWrapper";
import InputField from "@/components/forms/InputField";


// category schema
const formSchema = z.object({
    name: z
        .string({ required_error: "Tag name is required" })
        .min(2, { message: "Tag name must be at least 2 characters" })
        .max(20, { message: "Tag name must not exceed 20 characters" }),
})

// tags form
export default function TagsForm({data}) {
    
    const {getInitialData} = infoStore()
    const [loading, setLoading] = useState(false)
    const defaultValues = {
        name: data?.name || "",
    }
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })
    
    // form submit
    const handleFormSubmit = async (values) => {
        
        let url = routes.tags
        if(data?._id){
            url = `${routes.tags}/${data?._id}`
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
    
    return (
        <FormWrapper
            form={form}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            submitBtnText={"Save Category"}
            loading={loading}
        >
            <div className={"pb-4"}>
                <InputField
                    type={"text"}
                    form={form}
                    label={"Tag name"}
                    name={"name"}
                    placeholder={"Enter tag name"}
                    disabled={loading}
                />
            </div>
        
        </FormWrapper>
    );
 }
