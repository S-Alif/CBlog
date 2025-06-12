// page metadata
import AuthPageWrapper from "@/components/AuthPageWrapper";
import VerifyOtpForm from "@/app/(home)/auth/verify-otp/VerifyOtpForm";

export const metadata = {
    title: 'Verify your account',
    description: 'Verify your account with the otp',
}

// verify otp page
export default function VerifyOtpPage () {
    return (
        <AuthPageWrapper
            title={"Verify your account"}
            description={"A verification code was sent to your account email"}
            footerBtnText={"Back to log in"}
            footerBtnLink={"/auth/login"}
        >
            <VerifyOtpForm />
            
        </AuthPageWrapper>
    )
}