/**
 * AuthPageWrapper is a layout component for authentication pages.
 * It provides a consistent structure including a title, description, and an optional footer button.
 *
 * Useful for login, register, reset password, or similar pages where consistent styling and layout is desired.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} [props.title="Give a title"] - The main heading/title for the auth page.
 * @param {string} [props.description="Write something"] - A short description or subtitle for the page.
 * @param {string} [props.footerBtnText="Footer button"] - The text shown on the optional footer button.
 * @param {string} [props.footerBtnLink="/"] - The URL path to navigate to when the footer button is clicked.
 * @param {React.ReactNode} props.children - The form or other content to display within the wrapper.
 *
 * @returns {JSX.Element} A styled wrapper layout for authentication-related pages.
 *
 * @example
 * <AuthPageWrapper
 *   title="Login"
 *   description="Enter your credentials to access your account"
 *   footerBtnText="Sign up"
 *   footerBtnLink="/register"
 * >
 *   <LoginForm />
 * </AuthPageWrapper>
 */


import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import DisplayMagicCard from "@/components/DisplayMagicCard";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";


export default function AuthPageWrapper ({
    title="Give a title",
    description="Write something",
    footerBtnText = "Footer button",
    footerBtnLink= "/",
    children,
}) {
    return (
        <section className={"w-full min-h-screen flex items-center justify-center px-3"}>
            <Card className="p-0 max-w-sm w-full shadow-none border-none z-10">
                <DisplayMagicCard>
                    <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        {children}
                    </CardContent>
                    <CardFooter className="p-4 border-t border-border [.border-t]:pt-4 flex items-center justify-center">
                        <Link
                            href={footerBtnLink}
                            className={buttonVariants({
                                size: "lg", variant: "link"
                            })}
                        >
                            {footerBtnText}
                        </Link>
                    </CardFooter>
                </DisplayMagicCard>
            </Card>
        </section>)
}