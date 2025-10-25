'use client';
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { unstable_HistoryRouter } from 'react-router-dom';

// const SignUp = () => {
//   return (
//     <div>
//       <h1>Sign up!</h1>
//       <form></form>
//       </div>
//   );
// };

// export default SignUp;

export default function SignUp() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const router = useRouter();

  const handleEmailClick = () => setShowEmailForm(true);
  const handleClose = () => setShowEmailForm(false);

  const handleDiscordSignup = () => {
    // Handle Discord signup logic here
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-3 left-3 flex items-center space-x-2">
        <Image
          src="/shuubox.svg"
          alt="My Logo"
          width={250} 
          height={100} 
          className=""
        />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-black">Sign up!</h1>
          <button 
            onClick={handleEmailClick}
            className="w-full bg-blue-600 text-white py-2 rounded-md mb-4 hover:bg-blue-700 transition-colors">
            Continue with Email
          </button> 

        <button
          onClick={handleDiscordSignup}
          className="w-full bg-[#5865F2] text-white py-2 rounded-md hover:bg-[#4752C4] transition-colors">
          Continue with Discord
        </button>

        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>

        {showEmailForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-black">
              Sign up with email
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks!");
                setShowEmailForm(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Full name"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
          </div>
        )}
      </div>
    </main>
  )
}
