"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import googleIcon from "../../../../public/auth/googleLogo.png";
import githubIcon from "../../../../public/auth/githubLogo.png";

const SignUp = () => {
    const { signUp, isLoaded } = useSignUp();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress: formData.email,
                password: formData.password,
            });

            await signUp.prepareEmailAddressVerification();
            alert("Check your email for verification!");
        } catch (error: any) {
            console.error("Sign-up error:", error.errors);
        }
    };

    const handleProviderSignIn = async (provider: "oauth_google" | "oauth_github") => {
        if (!isLoaded) return;

        try {
            await signUp.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/dashboard",
                redirectUrlComplete: "/dashboard",
            });
        } catch (error: any) {
            console.error("OAuth sign-in error:", error.errors);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>

                    {/* Social Sign-In Buttons */}
                    <div className="mt-4 flex flex-col gap-3">
                        <Button
                            onClick={() => handleProviderSignIn("oauth_google")}
                            variant="outline"
                            className="flex items-center gap-3 justify-center"
                        >
                            <Image src={googleIcon} alt="Google" width={20} height={20} />
                            Sign up with Google
                        </Button>

                        <Button
                            onClick={() => handleProviderSignIn("oauth_github")}
                            variant="outline"
                            className="flex items-center gap-3 justify-center"
                        >
                            <Image src={githubIcon} alt="GitHub" width={20} height={20} />
                            Sign up with GitHub
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;
