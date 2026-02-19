"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mail, Shield } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      redirect: false,
      callbackUrl: "/",
    });
    
    if (result?.ok) {
      window.location.href = "/";
    } else {
      alert("Email not authorized. Please contact administrator.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dynasty-blue to-dynasty-purple">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dynasty AI Stack ⚙️
          </h1>
          <p className="text-gray-600">Mission Control Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dynasty-blue focus:border-transparent"
              placeholder="your-email@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-dynasty-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign in with Email
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <Shield className="w-4 h-4 mr-1" />
          <span>Restricted access - authorized users only</span>
        </div>
      </div>
    </div>
  );
}
