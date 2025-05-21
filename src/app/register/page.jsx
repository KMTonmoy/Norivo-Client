"use client";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { imageUpload } from "../../api/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();
  const axiosPublic = useAxiosPublic();

  const { createUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!image) {
      return Swal.fire({
        title: "Profile Picture Required",
        text: "Please upload a profile picture.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    try {
      const imageUrl = await imageUpload(image);
      await createUser(email, password);
      await updateUserProfile(name, imageUrl);

      Swal.fire({
        title: "Signup Successful",
        text: "Welcome to Norivo!",
        icon: "success",
        confirmButtonText: "OK",
      });
      router.push("/");
    } catch (err) {
      Swal.fire({
        title: "Signup Failed",
        text: err.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        const userInfo = {
          email: result.user.email || "",
          name: result.user.displayName || "",
        };
        await axiosPublic.post("/users", userInfo);
      }
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: error.message || "An unknown error occurred.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-[#f9f9f9]">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[#1E4620]">
          Create a Norivo Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#37B24D]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#37B24D]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#37B24D]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              required
              className="w-full px-4 py-2 border rounded-lg cursor-pointer focus:outline-none focus:border-[#37B24D]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#37B24D] hover:bg-[#2F9E44] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-3 mt-4 border rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 256 262"
              preserveAspectRatio="xMidYMid"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              />
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              />
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              />
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              />
            </svg>
            Sign up with Google
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2F9E44] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
