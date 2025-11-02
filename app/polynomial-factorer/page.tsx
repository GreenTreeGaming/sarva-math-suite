"use client";

import React, { useState } from "react";
import Link from "next/link";
import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, XCircle, CheckCircle } from "lucide-react";

export default function PolynomialFactorerPage() {
  const [input, setInput] = useState("x^2 + 5x + 6");
  const [factored, setFactored] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const formatFactored = (expr: string) =>
    expr
      .split("*")
      .map(term => {
        const clean = term.replace(/^\(|\)$/g, "");
        const parts = clean.split("+").map(p => p.trim());
        parts.sort((a, b) => {
          const aVar = /[a-zA-Z]/.test(a), bVar = /[a-zA-Z]/.test(b);
          return aVar === bVar ? 0 : aVar ? -1 : 1;
        });
        return `(${parts.join(" + ")})`;
      })
      .join("");

  const handleFactor = () => {
    try {
      setError(null);
      setFactored(null);
      setSteps([]);
      const expr = input.replace(/\s+/g, "");
      const result = nerdamer(`factor(${expr})`).toString();
      const formatted = formatFactored(result);

      // verify
      const expOrig = nerdamer(expr).expand().toString();
      const expFact = nerdamer(formatted).expand().toString();
      if (expOrig !== expFact || result === expr) {
        throw new Error("no-factor");
      }

      setFactored(formatted);
      setSteps([
        `Original: ${expr}`,
        `Factored: ${formatted}`
      ]);
    } catch (e) {
      setFactored(null);
      setSteps([]);
      setError(
        e.message === "no-factor"
          ? "Cannot factor over the rationals."
          : "Invalid polynomial."
      );
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
        }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link
          href="/"
          className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mb-6">🧮 Polynomial Factorer</h2>
      </motion.div>

      <motion.div
        className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-orange-500 font-medium">
          🚧 Work in progress—currently factors quadratics. More soon!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. x^2 + 5x + 6"
            className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm"
          />
          <motion.button
            onClick={handleFactor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" /> Factor
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {factored && (
            <motion.div
              className="bg-white border border-gray-200 shadow p-4 rounded-xl w-full mt-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-600">
                  Factored Form
                </h3>
              </div>
              <p className="text-xl font-medium mb-4">{factored}</p>
              <div className="text-sm text-gray-700">
                <h4 className="font-medium mb-1">Steps:</h4>
                <ul className="list-disc ml-5 space-y-1">
                  {steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
