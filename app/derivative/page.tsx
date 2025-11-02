"use client";

import React, { useState } from "react";
import Link from "next/link";
import { derivative, simplify, parse } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, XCircle, CheckCircle } from "lucide-react";

const Header = () => (
  <motion.div
    className="max-w-4xl mx-auto flex flex-col items-center"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
      Sarva Math Suite
    </h1>
    <Link
      href="/"
      className="flex items-center text-sm text-gray-600 hover:text-purple-500 mb-6 transition"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back to Home
    </Link>
    <h2 className="text-4xl font-extrabold mb-6">🧮 Derivative Calculator</h2>
  </motion.div>
);

export default function DerivativePage() {
  const [input, setInput] = useState("x^6");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  function beautifyResult(expr: string): string {
    return expr
      .replace(/\s+/g, "")
      .replace(/\*\*/g, "^")
      .replace(/\*([a-zA-Z])/g, "$1")
      .replace(/(\d+|\))([a-zA-Z])/g, "$1*$2");
  }

  function customSimplify(expr: string): string {
    try {
      const pattern = /e\s*\^\s*\(\s*(\d+|\w+)\s*\*\s*log\s*\(\s*x\s*\^\s*(\d+|\w+)\s*\)\s*\)/g;
      let res = expr, match;
      while ((match = pattern.exec(expr)) !== null) {
        const [full, n, m] = match;
        const power = simplify(`${n}*${m}`).toString();
        res = res.replace(full, `x^(${power})`);
      }
      const simple = /e\s*\^\s*\(\s*(\d+|\w+)\s*\*\s*log\s*\(\s*x\s*\)\s*\)/g;
      while ((match = simple.exec(expr)) !== null) {
        res = res.replace(match[0], `x^(${match[1]})`);
      }
      return res;
    } catch {
      return expr;
    }
  }

  const handleCompute = () => {
    try {
      setError(null);
      setSteps([]);
      const computation: string[] = [];

      const parsed = parse(input);
      const initSim = simplify(parsed).toString();
      computation.push(`Simplified input: ${initSim}`);

      const customSim = customSimplify(initSim);
      if (customSim !== initSim) computation.push(`Custom simplification: ${customSim}`);

      const fullSim = simplify(parse(customSim)).toString();
      computation.push(`Fully simplified: ${fullSim}`);

      const raw = derivative(parse(fullSim), "x").toString();
      computation.push(`Raw derivative: ${raw}`);

      const simpDer = simplify(parse(raw)).toString();
      computation.push(`Simplified derivative: ${simpDer}`);

      const pretty = beautifyResult(simpDer);

      setResult(pretty);
      setSteps(computation);
    } catch {
      setError("Invalid function or syntax. Please ensure correct mathjs format.");
      setResult(null);
      setSteps([]);
    }
  };

  const examples = [
    "x^6",
    "e^(3*log(x^2))",
    "sin(x)*cos(x)",
    "x*log(x)",
    "e^x*sin(x)",
    "e^(2*log(x))"
  ];

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <motion.div
        className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Instructions */}
        <motion.div
          className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-2 font-medium text-purple-600">How to type functions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Powers: <code>x^2</code>, <code>x^(1/2)</code></li>
            <li>Trig: <code>sin(x)</code>, <code>cos(x)</code></li>
            <li>Exp: <code>e^x</code>, <code>exp(x)</code></li>
            <li>Log: <code>log(x)</code> for natural log</li>
            <li>Example: <code>x*cos(x)/(sin(x)+1)</code></li>
            <li><code>e^(3*log(x^2))</code> = <code>x^6</code></li>
          </ul>
        </motion.div>

        {/* Input + Button */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. x*cos(x)/(sin(x)+1)"
            className="flex-1 p-3 rounded-md border border-gray-300 shadow-sm w-full"
          />
          <motion.button
            onClick={handleCompute}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-md font-semibold shadow flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" /> Derive
          </motion.button>
        </motion.div>

        {/* Steps Toggle */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="checkbox"
            id="showSteps"
            checked={showSteps}
            onChange={() => setShowSteps(!showSteps)}
            className="mr-2"
          />
          <label htmlFor="showSteps" className="text-sm text-gray-600">
            Show calculation steps
          </label>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="bg-white border border-gray-200 shadow p-6 rounded-xl text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold text-green-600">f'(x) = {result}</h3>
              </div>

              {showSteps && steps.length > 0 && (
                <motion.div
                  className="text-left mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Calculation Steps:</h4>
                  <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                    {steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </motion.div>
              )}

              <p className="text-sm text-gray-500 italic mt-4">
                (Computed via symbolic differentiation, then simplified)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Examples */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-medium text-gray-700">Try these examples:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {examples.map((ex) => (
              <motion.button
                key={ex}
                onClick={() => {
                  setInput(ex);
                  setResult(null);
                  setSteps([]);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition"
              >
                {ex}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
