"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import googleIcon from "../../../../public/auth/googleLogo.png";
import githubIcon from "../../../../public/auth/githubLogo.png";
import { FC } from "react";

const SignInPage: FC = () => {
    const { signIn, isLoaded } = useSignIn();

    const handleProviderSignIn = async (provider: "oauth_google" | "oauth_github") => {
        if (!isLoaded) return;
        try {
            await signIn?.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/dashboard", // Change this to your desired redirect path
                redirectUrlComplete: "/dashboard",
            });
        } catch (error: any) {
            console.error("Error during sign-in:", error.message);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Sign In to WebGenie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-gray-600">Welcome back! Please sign in to continue.</p>
                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={() => handleProviderSignIn("oauth_google")} 
                            variant="outline" 
                            className="flex items-center justify-center gap-3 w-full"
                        >
                            <Image src={googleIcon} alt="Google Icon" width={24} height={24} />
                            Sign in with Google
                        </Button>
                        <Button 
                            onClick={() => handleProviderSignIn("oauth_github")} 
                            variant="outline" 
                            className="flex items-center justify-center gap-3 w-full"
                        >
                            <Image src={githubIcon} alt="GitHub Icon" width={24} height={24} />
                            Sign in with GitHub
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInPage;
