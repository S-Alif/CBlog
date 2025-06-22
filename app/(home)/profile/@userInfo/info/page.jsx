"use client"

import {IndividualSection} from "@/components/Sections";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import actorStore from "@/stores/actorStore";
import {useState} from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {SelectItem} from "@/components/ui/select";
import TextareaField from "@/components/forms/TextareaField";
import apiHandler from "@/helpers/api/apiHandler";
import {PATCH, routes} from "@/helpers/api/apiConstants";

// user Update Schema
const formSchema = z.object({
    name: z.string()
        .min(5, { message: "Name must be at least 5 characters" })
        .max(100, { message: "Name must be at most 100 characters" }),
    pass: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(20, { message: "Password must be at most 20 characters" }).nullable().or(z.literal("")),
    about: z.string()
        .min(100, { message: "About must be at least 100 characters" })
        .max(500, { message: "About must be at most 500 characters" }),
    gender: z.enum(["male", "female", "other"]),
    image: z.string().url().max(1000),
    bannerImg: z.string().url().max(1000),
})


// user info
export default function UserInfo () {
    
    const {user, setUser} = actorStore()
    const [loading, setLoading] = useState(false)
    const defaultValues = {
        name: user?.name,
        email: user?.email,
        pass: "",
        about: user?.about || "",
        gender: user?.gender,
        image: user?.image,
        bannerImg: user?.bannerImg,
        approveCreds: user?.approveCreds,
    }
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })
    
    // form field list
    const formFields = [
        <InputField
            type={"text"}
            form={form}
            label={"Your name"}
            name={"name"}
            placeholder={"Enter your full name"}
            disabled={loading}
        />,
        <InputField
            type={"email"}
            form={form}
            label={"Email address"}
            name={"email"}
            placeholder={"Enter your email address"}
            disabled={true}
        />,
        <InputField
            type={"text"}
            form={form}
            label={"Your profile picture"}
            name={"image"}
            placeholder={"Enter a link/url/address to your profile picture"}
            disabled={loading}
        />,
        <InputField
            type={"text"}
            form={form}
            label={"Your banner image"}
            name={"bannerImg"}
            placeholder={"Enter a link/url/address to your banner image"}
            disabled={loading}
        />,
        <InputField
            type={"password"}
            form={form}
            label={"Password"}
            name={"pass"}
            placeholder={"Enter your password"}
            disabled={loading}
        />,
        <SelectField
            label={"Your gender"}
            name={"gender"}
            form={form}
            placeholder={"Select your gender"}
            disabled={loading}
        >
            {
                ["male", "female", "other"].map((item, index) => (
                    <SelectItem value={item} key={index}>{item.toUpperCase()}</SelectItem>
                ))
            }
        </SelectField>,
        <TextareaField
            form={form}
            label={"About yourself"}
            name={"about"}
            placeholder={"Say something in short about yourself"}
            disabled={loading}
        />,
        <TextareaField
            form={form}
            label={"Approve credentials"}
            name={"approveCreds"}
            placeholder={"ID: CSE-02707000, Batch: 28-D-A, phone: +8801632XXXXXX"}
            disabled={true}
        />
    ]
    
    // form submit
    const handleFormSubmit = async (values) => {
        if(values?.pass === "") delete values.pass
        setLoading(true)
        const result = await apiHandler(
            routes.user.update,
            PATCH,
            values,
            true
        )
        if(result) await setUser()
        setLoading(false)
    }
    
    
    return (
        <IndividualSection
            className={"individual-section"}
        >
            <div className={"w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10"}>
                {/*user image*/}
                <div className={"aspect-square rounded-md overflow-hidden"}>
                    <img
                        src={user?.image}
                        alt={user?.name}
                        className={"object-cover object-center block w-full h-full"}
                    />
                </div>
                
                <div>
                    <h2 className={"section-title"}>Account details</h2>
                    <FormWrapper
                        form={form}
                        defaultValues={defaultValues}
                        onSubmit={handleFormSubmit}
                        submitBtnText={"Update account"}
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
                </div>
            </div>
        
        </IndividualSection>
    )
}