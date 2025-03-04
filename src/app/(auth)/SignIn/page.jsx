"use client"
import React from 'react'
import github from '../../../../public/auth/githubLogo.png'
import google from '../../../../public/auth/googleLogo.png'
import Image from 'next/image'

const page = () => {

    const handleProviderSignIn = async (provider) => {
        try {
            const result = await signIn(provider);
            if (result?.error) throw new Error(result.error);
            console.log("User signed in successfully:", result);
        } catch (error) {
            console.error("Error during sign-in:", error.message);
        }
    };
    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-center">Sign In to WebGenie</h1>
                    <p className="text-center text-gray-600">Welcome back! Please sign in to continue.</p>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    {/* Social login buttons */}
                    <div className="flex flex-col sm:flex-row sm:justify-around gap-4">
                        <button
                            onClick={() => handleProviderSignIn("google")}
                            className="flex items-center justify-center gap-3 px-5 py-3 w-full sm:w-auto border border-gray-300 rounded-full shadow-md bg-white hover:bg-gray-100 transition-all transform hover:-translate-y-1 hover:shadow-lg active:shadow-md active:translate-y-0 cursor-pointer"
                        >
                            <Image src={google} alt="Google Icon" width={28} height={28} />
                            <span className="text-gray-700 font-semibold">Sign in with Google</span>
                        </button>

                        <button
                            onClick={() => handleProviderSignIn("github")}
                            className="flex items-center justify-center gap-3 px-5 py-3 w-full sm:w-auto border border-gray-300 rounded-full shadow-md bg-white text-black hover:bg-gray-100 transition-all transform hover:-translate-y-1 hover:shadow-lg active:shadow-md active:translate-y-0 cursor-pointer"
                        >
                            <Image src={github} alt="GitHub Icon" width={28} height={28} />
                            <span className="font-semibold">Sign in with GitHub</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page