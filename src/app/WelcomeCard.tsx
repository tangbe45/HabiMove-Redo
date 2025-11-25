"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const WelcomeCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-2 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl text-center bg-slate-900 p-6 md:p-10 rounded-2xl mx-auto shadow-lg"
      >
        <h1 className="md:text-3xl font-bold mb-4">
          Find Your Next Home With Ease
        </h1>
        <p className="text-gray-300 text-base md:text-lg mb-8">
          Start your journey to discovering a comfortable and affordable home.
          Whether you're searching for a place to stay or exploring relocation
          services, we make the process simple and stress‑free.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/houses"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-400 font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeCard;
