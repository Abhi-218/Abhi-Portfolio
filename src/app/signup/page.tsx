"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfettiExplosion from "@/components/ConfettiExplosion";
import useSoundPlayer from "@/hooks/useSoundPlayer";

export default function SignUp() {
  const router = useRouter();
  const { playClick, playPageChange } = useSoundPlayer();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpSuccess, setShowOtpSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    profileImage: null as File | null,
    otp: "",
  });

  useEffect(() => {
    playPageChange();
  }, [playPageChange]);

  useEffect(() => {
    console.log(step);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error message when user types
    if (errorMessage) setErrorMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSizeInBytes) {
        setErrorMessage("File size should not exceed 2MB");
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setErrorMessage("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    playClick();

    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    playClick();
    setStep((prev) => prev - 1);
  };

  const scrollToError = () => {
    const element = document.getElementById("Status");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick(); // This is not blocking, fine to keep

    // Reset errors and loading
    setErrorMessage("");
    setSuccessMessage("");

    // Client-side validation before sending request
    if (!formData.profileImage) {
      setErrorMessage("Profile image is required");
      scrollToError();
      return;
    }

    if (formData.role === "admin" && adminToken !== "AshvinBhai@4872") {
      setErrorMessage("Admin token is not valid");
      scrollToError();
      return;
    }

    setIsLoading(true); // <-- move here, only if validation passed

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("role", formData.role);
      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage(
        "Account created successfully! Please verify with OTP."
      );
      setStep(4); // Go to OTP step
    } catch (error: unknown) {
      if(error instanceof Error){
        setErrorMessage(error.message || "Something went wrong. Please try again.");
      }else{
        setErrorMessage('Something went wrong. Please try again.');
      }
      scrollToError();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    playClick();

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: formData.otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setShowOtpSuccess(true);

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        router.push("/me1");
      }, 3000);
    } catch (error: unknown) {
      if(error instanceof Error){
        setErrorMessage(error.message || "OTP verification failed. Please try again.");
      }else{
        setErrorMessage("OTP verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Set Your Password</h2>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>

            <div className="mb-6">
              <p className="block mb-2 font-medium">Account Type</p>
              <div className="flex gap-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-500">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  <span>User</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-500">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  <span>Admin</span>
                </label>
              </div>
            </div>
            {formData.role === "admin" ? (
              <>
                <p className="block mb-2 font-medium">Admin Token</p>
                <input
                  type="password"
                  id="admin_token"
                  name="admin_token"
                  value={adminToken}
                  onChange={(e) => {
                    setAdminToken(e.target.value);
                  }}
                  className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />{" "}
              </>
            ) : (
              ""
            )}
            <div></div>

            <div className="mb-8">
              <label htmlFor="profileImage" className="block mb-2 font-medium">
                Profile Picture
              </label>
              <div className="flex flex-col items-center relative p-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                {filePreview ? (
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
                    <Image
                      src={filePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  SVG, PNG, JPG or GIF (max. 2MB)
                </p>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                />
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">Verify Your Account</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We&apos;ve sent a verification code to your email. Please enter it
              below.
            </p>

            <div className="mb-6">
              <label htmlFor="otp" className="block mb-2 font-medium">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      <ConfettiExplosion trigger={showOtpSuccess} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Join Us Today</h1>
          {step < 4 ? (
            <p className="opacity-90">Step {step} of 3</p>
          ) : (
            <p className="opacity-90">Final Step</p>
          )}
        </div>

        {showOtpSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Account Verified!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your account has been successfully verified. Redirecting to
              dashboard...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={step === 4 ? verifyOtp : handleSubmit}
            className="p-6 md:p-8"
            id="Status"
          >
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 ">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400">
                {successMessage}
              </div>
            )}

            {renderStep()}

            <div
              className={`flex ${step > 1 ? "justify-between" : "justify-end"}`}
            >
              {step > 1 && step < 4 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Back
                </motion.button>
              )}

              {step < 3 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="px-6 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`px-6 py-2 text-white font-medium rounded-lg transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {step === 4 ? "Verifying..." : "Creating Account..."}
                    </span>
                  ) : step === 4 ? (
                    "Verify Account"
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Log in
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
