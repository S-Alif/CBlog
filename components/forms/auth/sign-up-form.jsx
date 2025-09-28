"use client"

import InputField from "@/components/forms/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import SelectField from "@/components/forms/SelectField";
import { SelectItem } from "@/components/ui/select";
import TextareaField from "@/components/forms/TextareaField";
import { useRouter } from "next/navigation";



// form
const SignUpForm = () => {
    return (
        <div>SignUpForm</div>
    )
}
export default SignUpForm