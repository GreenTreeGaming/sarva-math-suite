'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-[#fdfcf9] px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <XCircle className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-8">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      {/* Link now renders <a> itself */}
      <Link
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow"
      >
        Go back home
      </Link>
    </motion.div>
  );
}