import AuthPageWrapper from "@/components/AuthPageWrapper";
import RegisterForm from "@/app/(home)/auth/register/RegisterForm";

// page metadata
export const metadata = {
    title: 'Register to CBlog',
    description: 'Register an account to our website',
}

// login page
export default function RegisterPage () {
    
    return (
        <AuthPageWrapper
            title={"Register"}
            description={"Enter your credentials to register your account"}
            footerBtnText={"Back to log in"}
            footerBtnLink={"/auth/login"}
        >
            <RegisterForm />
        </AuthPageWrapper>
    )
}