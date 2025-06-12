import AuthPageWrapper from "@/components/AuthPageWrapper";
import UpdatePassForm from "@/app/(home)/auth/update-password/UpdatePassForm";

// page metadata
export const metadata = {
    title: 'Update password',
    description: 'Change your password',
}

// verify otp page
export default function UpdatePassPage () {
    return (
        <AuthPageWrapper
            title={"Change your password"}
            description={"Create a strong password mixed with numbers, letters and symbols"}
            footerBtnText={"Back to log in"}
            footerBtnLink={"/auth/login"}
        >
            <UpdatePassForm />
        
        </AuthPageWrapper>
    )
}