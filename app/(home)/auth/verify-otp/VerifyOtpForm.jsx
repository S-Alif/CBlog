"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import FormWrapper from "@/components/forms/FormWrapper";
import InputOtpField from "@/components/forms/InputOtpField";
import {useRouter} from "next/navigation";
import apiHandler from "@/helpers/api/apiHandler";
import {POST, routes} from "@/helpers/api/apiConstants";
import {Button} from "@/components/ui/button";

// form schema
const formSchema = z.object({
    otp: z.string().length(6, {message: "Otp is required"})
})

// default values
const defaultValues = {
    otp: ""
}

// verify otp form
export default function VerifyOtpForm() {
    
    const router = useRouter()
    
    // resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    })
    
    // loading state
    const [loading, setLoading] = useState(false)
    
    // get the send-otp data
    // there will a key name "type" with value "10"(number), when navigating from the register page
    const otpData= useRef(null)
    const [timer, setTimer] = useState(0)
    const [isDisabled, setIsDisabled] = useState(true)
    
    // form submit - verify otp
    const handleFormSubmit = async (values) => {
        let verifyOtpData = {
            ...otpData.current,
            ...values
        }
        setLoading(true)
        const result = await apiHandler(
            routes.auth.verifyOtp,
            POST,
            verifyOtpData,
            true
        )
        
        if(result) {
            form.reset(defaultValues)
            if(otpData.current?.type && otpData.current.type == 10) {
                sessionStorage.removeItem("sendOtpData")
                localStorage.removeItem("timer")
                return router.replace("/auth/login")
            }
            return router.replace("/auth/update-password")
        }
        setLoading(false)
    }

    // sendOtp
    const sendOtp = async () => {
        if(!otpData?.current?.email) return console.log(otpData)
        const result = await apiHandler(
            routes.auth.sendOtp,
            POST,
            otpData.current,
            true
        )
        if(!result) return
        setTimer(200)
        setIsDisabled(true)
        form.reset(defaultValues)
    }
    
    // timer
    useEffect(() => {
        if (timer > 0) {
            const countDown = setInterval(() => {
                setTimer(prev => {
                    localStorage.setItem("timer", JSON.stringify(prev-1))
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(countDown)
        } else {
            setIsDisabled(false)
        }
    }, [timer])
    
    // fetch the email
    useEffect(() => {
        // check if there was an otp sent before if the timer is less than 120 but not 0
        // the otp was sent and have to wait until the timer is finished
        const getTimerFromLocalStorage = JSON.parse(localStorage.getItem("timer"))
        if(getTimerFromLocalStorage && getTimerFromLocalStorage > 0){
            setIsDisabled(true)
            return setTimer(getTimerFromLocalStorage)
        }
        
        const data = JSON.parse(sessionStorage.getItem("sendOtpData"))
        console.log(data)
        if(!data || !data?.email) {
            return router.replace("/auth/login")
        }
        let dataOtp = {}
        if(data?.email){
            dataOtp.email = data?.email
        }
        if(data?.type){
            dataOtp.type = data?.type
        }
        
        otpData.current = dataOtp
        
        // call send otp for otp sending
        sendOtp()
    }, [])
    
    return (
        <div>
            <FormWrapper
                form={form}
                defaultValues={defaultValues}
                onSubmit={handleFormSubmit}
                submitBtnText={"Verify account"}
                loading={loading}
            >
                <div className="mb-4">
                    <InputOtpField
                        label="Otp code"
                        name="otp"
                        form={form}
                    />
                </div>
            </FormWrapper>
            
            <div className="pt-5 text-center">
                <Button variant={"link"} onClick={sendOtp} disabled={isDisabled}>
                    Didn't get a code ? Send again {timer > 0 && <span>({timer}s)</span>}
                </Button>
            </div>
        </div>
    )
}