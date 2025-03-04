"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import github from '../../../../public/auth/githubLogo.png'
import google from '../../../../public/auth/googleLogo.png'

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Form submitted:", formData);
    };

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
                <p className="text-center text-gray-600">Sign up to get started</p>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Social login buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-around gap-4">
                    <button
                        onClick={() => handleProviderSignIn("google")}
                        className="flex items-center justify-center gap-3 px-5 py-3 w-full sm:w-auto border border-gray-300 rounded-full shadow-md bg-white hover:bg-gray-100 transition-all"
                    >
                        <Image src={google} alt="Google Icon" width={28} height={28} />
                        <span className="text-gray-700 font-semibold">Sign up with Google</span>
                    </button>

                    <button
                        onClick={() => handleProviderSignIn("github")}
                        className="flex items-center justify-center gap-3 px-5 py-3 w-full sm:w-auto border border-gray-300 rounded-full shadow-md bg-white text-black hover:bg-gray-100 transition-all"
                    >
                        <Image src={github} alt="GitHub Icon" width={28} height={28} />
                        <span className="font-semibold">Sign up with GitHub</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
