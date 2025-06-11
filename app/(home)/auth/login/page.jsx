import LoginForm from "@/app/(home)/auth/login/LoginForm";
import AuthPageWrapper from "@/components/AuthPageWrapper";

// page metadata
export const metadata = {
    title: 'Login to CBlog',
    description: 'Login to our website',
}

// login page
export default function LoginPage () {
    
    return (
        <AuthPageWrapper
            title={"Login"}
            description={"Enter your credentials to access your account"}
            footerBtnText={"Forgot password"}
            footerBtnLink={"/auth/send-otp"}
        >
            <LoginForm />
        </AuthPageWrapper>
    )
}