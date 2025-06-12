import AuthPageWrapper from "@/components/AuthPageWrapper";
import SendOtpForm from "@/app/(home)/auth/send-otp/SendOtpForm";


export default function SendOtpPage () {
    return (
        <AuthPageWrapper
            title={"Send verification email"}
            description={"A verification code will be sent to your email if any account is associated with it"}
            footerBtnText={"Back to log in"}
            footerBtnLink={"/auth/login"}
        >
            <SendOtpForm />
        
        </AuthPageWrapper>
    )
}