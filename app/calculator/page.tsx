"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Slash, X, Plus, Minus } from "lucide-react";

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const evaluateExpression = () => {
    try {
      // use eval carefully
      const evalResult = eval(expression);
      setResult(Number(evalResult).toLocaleString());
    } catch {
      setResult("Error");
    }
  };

  const handleClick = (value: string) => {
    if (value === "C") {
      setExpression("");
      setResult("");
    } else if (value === "=") {
      evaluateExpression();
    } else {
      setExpression((prev) => prev + value);
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "C"
  ];

  // map label to icon if operator
  const renderLabel = (btn: string) => {
    switch (btn) {
      case "/": return <Slash size={20} />;
      case "*": return <X size={20} />;
      case "+": return <Plus size={20} />;
      case "-": return <Minus size={20} />;
      case "C": return <X size={20} className="text-red-500" />;
      default: return btn;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] text-gray-800 px-4 py-8 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Sarva Math Suite
      </motion.h1>

      {/* Back Link */}
      <Link
        href="/"
        className="mb-6 text-sm text-gray-600 hover:text-purple-500 transition flex items-center gap-1"
      >
        <ArrowLeft size={16} /> <span>Back to Home</span>
      </Link>

      <motion.h2
        className="text-4xl font-extrabold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🧮 Calculator
      </motion.h2>

      {/* Calculator Container */}
      <motion.div
        className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Display */}
        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && evaluateExpression()}
            placeholder="0"
            className="w-full bg-transparent text-right text-md text-gray-500 focus:outline-none"
          />
          <div className="text-2xl font-semibold text-gray-900 mt-1 break-words">
            {result}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-4">
          {buttons.map((btn) => (
            <motion.button
              key={btn}
              onClick={() => handleClick(btn)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`p-4 rounded-xl text-lg font-semibold focus:outline-none transition
                ${btn === "="
                  ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white"
                  : btn === "C"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-50 text-gray-700"
                }
              `}
            >
              {renderLabel(btn)}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
