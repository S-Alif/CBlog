import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import DisplayMagicCard from "@/components/DisplayMagicCard";
import LoginForm from "@/app/(home)/auth/login/LoginForm";

// page metadata
export const metadata = {
    title: 'Login to CBlog',
    description: 'Login to our website',
}

// login page
export default function LoginPage () {
    
    return (
        <section className={"w-full min-h-screen flex items-center justify-center"}>
            <Card className="p-0 max-w-sm w-full shadow-none border-none">
                <DisplayMagicCard>
                    <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <LoginForm />
                    </CardContent>
                    <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
                        <Button className="w-full">Sign In</Button>
                    </CardFooter>
                </DisplayMagicCard>
            </Card>
        </section>
    )
}