import AuthPagesWrapper from "@/components/auth-pages-wrapper"

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
            description={"Enter your credentials for a registration request"}
            footerBtnText={"Back to log in"}
            footerBtnLink={"/auth/login"}
        >


        </AuthPagesWrapper>
    )
}
export default SignUpPage