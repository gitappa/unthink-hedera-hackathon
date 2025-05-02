// src/app/page.tsx
'use client'; // Needed for useState, FormEvent handlers, axios

import { useState, useId, FormEvent } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addUserId } from '@/lib/userIds';

// Define the API endpoint (replace with your actual URL if different)
const BACKEND_URL = 'http://localhost:8000' //process.env.NEXT_PUBLIC_BACKEND_URL;
const API_ENDPOINT = `${BACKEND_URL}/create_agent`;

export default function CreateAgentPage() {
    const id = useId(); // Hook for generating unique IDs for form elements

    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [igUserName, setIgUserName] = useState('');

    // State variables for managing UI feedback
    const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the form has been submitted
    const [submissionError, setSubmissionError] = useState<string | null>(null); // For local validation errors before submission

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior
        setSubmissionError(null); // Clear previous validation errors

        // --- Basic client-side validation ---
        if (!name || !email || !igUserName) {
            setSubmissionError('All fields are mandatory. Please fill them out.');
            return; // Stop submission if fields are empty
        }
        addUserId(igUserName);
        // --- Prepare payload ---
        const payload = {
            name: name,
            email_id: email,
            ig_user_name: igUserName,
        };

        // --- "Fire and Forget" API call ---
        // Send the request but don't wait for the response to update the UI
        axios.post(API_ENDPOINT, payload)
            .then(response => {
                // Optional: Log success for debugging, but UI already changed
                console.log('Agent creation request sent successfully:', response.data);
            })
            .catch(error => {
                // Optional: Log error for debugging. User won't see this specific error.
                console.error('Error sending agent creation request:', error);
                // You could potentially implement a background error reporting service here
            });

        // --- Immediately show the success message ---
        setIsSubmitted(true);

        // Optional: Clear form fields after submission if desired
        // setName('');
        // setEmail('');
        // setIgUserName('');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gradient-to-br from-white to-purple-100">
            {/* Container for the form or success message */}
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">

                {/* --- Conditional Rendering: Show Success Message or Form --- */}
                {isSubmitted ? (
                    // --- Success Message Display ---
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                         <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Request Submitted!
                        </h2>
                        <p className="text-sm text-gray-600 px-4">
                            Thank you! Once the agent is ready, we will notify you
                            via email at{' '}
                            <span className="font-medium text-purple-700">{email}</span>.
                            <br />
                            <br />
                            You can expect the email within 15 minutes.
                        </p>
                    </div>
                ) : (
                     // --- Form Display ---
                     <>
                        {/* Header Section */}
                        <div className="flex flex-col items-center gap-2 mb-6">
                            {/* Logo Placeholder */}
                            <div
                                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-purple-50"
                                aria-hidden="true"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot text-purple-600"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                            </div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Create Your AI Agent
                            </h1>
                            <p className="text-sm text-gray-600 text-center">
                                We just need a few details to get started.
                            </p>
                        </div>

                        {/* Form for user input */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                {/* Full Name Input */}
                                <div>
                                    <Label htmlFor={`${id}-name`} className="text-sm font-medium text-gray-700">
                                        Full name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`${id}-name`}
                                        placeholder="e.g., Matt Welsh"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="mt-1 w-full"
                                    />
                                </div>

                                {/* Email Input */}
                                <div>
                                    <Label htmlFor={`${id}-email`} className="text-sm font-medium text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`${id}-email`}
                                        placeholder="you@yourcompany.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1 w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Please ensure your email is correct for notifications.
                                    </p>
                                </div>

                                {/* Instagram Username Input */}
                                <div>
                                    <Label htmlFor={`${id}-ig`} className="text-sm font-medium text-gray-700">
                                        Instagram Username <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`${id}-ig`}
                                        placeholder="e.g., your_instagram_handle"
                                        type="text"
                                        value={igUserName}
                                        onChange={(e) => setIgUserName(e.target.value)}
                                        required
                                        className="mt-1 w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter the correct Instagram username (without @).
                                    </p>
                                </div>
                            </div>

                            {/* Display Validation Error Message */}
                            {submissionError && (
                                <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">
                                    {submissionError}
                                </p>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5"
                            >
                                Create Agent
                            </Button>
                        </form>
                    </>
                 )} {/* End Conditional Rendering */}

            </div> {/* End Card Container */}
        </main>
    );
}