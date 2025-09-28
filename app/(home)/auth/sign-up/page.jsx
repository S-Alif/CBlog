import AuthPagesWrapper from "@/components/auth-pages-wrapper"
import SignUpForm from "@/components/forms/auth/sign-up-form"

// metadata
export const metadata = {
    title: 'Register to CBlog',
    description: 'Register an account to our website',
}

// page
const SignUpPage = () => {
    return (
        <AuthPagesWrapper
            title={"Sign up"}
            description={"Enter your credentials for a sign-up request"}
            footerBtnText={"Back to log in"}
            footerBtnLink={"/auth/login"}
        >
            <SignUpForm />
        </AuthPagesWrapper>
    )
}
export default SignUpPage