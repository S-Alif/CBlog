import {PageSection} from "@/components/Sections";
import ProfileTop from "@/app/(home)/profile/ProfileTop";
import {checkAuth} from "@/helpers/check-auth/check-auth";
import {roles} from "@/lib/constants/roleConstants";
import {redirect} from "next/navigation";

// page metadata
export const metadata = {
    title: "Your Profile",
    description: "User personal profile"
}

// profile root
export default async function ProfileRootLayout ({ userInfo }) {
    
    const validUser = await checkAuth([roles.USER])
    if (!validUser) redirect("/auth/login")
    
    
    return (
        <PageSection
            breadcrumbs={["Home", "Profile"]}
            id="user-personal-profile"
            className={"page-section"}
        >
            <ProfileTop />
            
            <div className="pt-10">
                {userInfo}
            </div>
        </PageSection>
    )
}