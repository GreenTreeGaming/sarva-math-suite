"use client";

import React, { useState } from "react";
import Link from "next/link";
import { evaluate } from "mathjs";
import nerdamer from "nerdamer";
import "nerdamer/Calculus";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Infinity as InfinityIcon,
  Sliders,
  Layers,
  XCircle,
  CheckCircle
} from "lucide-react";

export default function IntegralPage() {
  const [func, setFunc] = useState("x^2");
  const [lower, setLower] = useState("0");
  const [upper, setUpper] = useState("2");
  const [method, setMethod] = useState<string>("trapezoidal");
  const [subdivisions, setSubdivisions] = useState<number>(1000);
  const [indefinite, setIndefinite] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [antiderivative, setAntiderivative] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Numeric methods
  const trapezoidalRule = (expr: string, a: number, b: number, n: number) => {
    const h = (b - a) / n;
    let sum = evaluate(expr, { x: a }) + evaluate(expr, { x: b });
    for (let i = 1; i < n; i++) {
      sum += 2 * evaluate(expr, { x: a + i * h });
    }
    return (h / 2) * sum;
  };

  const simpsonRule = (expr: string, a: number, b: number, n: number) => {
    if (n % 2 !== 0) n += 1; // make n even
    const h = (b - a) / n;
    let sum = evaluate(expr, { x: a }) + evaluate(expr, { x: b });
    for (let i = 1; i < n; i++) {
      const coef = i % 2 === 0 ? 2 : 4;
      sum += coef * evaluate(expr, { x: a + i * h });
    }
    return (h / 3) * sum;
  };

  const midpointRule = (expr: string, a: number, b: number, n: number) => {
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const xMid = a + i * h + h / 2;
      sum += evaluate(expr, { x: xMid });
    }
    return h * sum;
  };

  const handleCompute = () => {
    try {
      setError(null);
      setResult(null);
      setAntiderivative(null);
      if (indefinite) {
        const anti = nerdamer.integrate(func, "x").toString();
        setAntiderivative(`${anti} + C`);
        return;
      }
      const a = parseFloat(lower);
      const b = parseFloat(upper);
      if (isNaN(a) || isNaN(b) || subdivisions <= 0) throw new Error();
      let approx: number;
      switch (method) {
        case "simpson":
          approx = simpsonRule(func, a, b, subdivisions);
          break;
        case "midpoint":
          approx = midpointRule(func, a, b, subdivisions);
          break;
        default:
          approx = trapezoidalRule(func, a, b, subdivisions);
      }
      setResult(approx.toString());
    } catch {
      setError("Invalid input. Check function, bounds, and subdivisions.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link
          href="/"
          className="flex items-center text-sm text-gray-600 hover:text-purple-500 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold">🧮 Integral Calculator</h2>
      </motion.div>

      <motion.div
        className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 space-y-6 border border-gray-100"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Function */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium">Function f(x):</label>
          <input
            type="text"
            value={func}
            onChange={(e) => setFunc(e.target.value)}
            placeholder="e.g. x^2, sin(x)"
            className="w-full p-3 border rounded-md shadow-sm"
          />
        </motion.div>

        {/* Bounds */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium">Lower bound (a):</label>
            <input
              type="text"
              value={lower}
              onChange={(e) => setLower(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium">Upper bound (b):</label>
            <input
              type="text"
              value={upper}
              onChange={(e) => setUpper(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm"
            />
          </div>
        </motion.div>

        {/* Indefinite Toggle */}
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="checkbox"
            id="indefinite"
            checked={indefinite}
            onChange={() => setIndefinite(!indefinite)}
            className="mr-2"
          />
          <label htmlFor="indefinite" className="flex items-center text-sm text-gray-600">
            <InfinityIcon className="w-4 h-4 mr-1 text-gray-500" />
            Compute indefinite integral
          </label>
        </motion.div>

        {/* Numeric Settings */}
        {!indefinite && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>
              <label className="block text-sm font-medium">Method:</label>
              <div className="relative">
                <Layers className="absolute left-3 top-3 text-gray-500" />
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-md shadow-sm"
                >
                  <option value="trapezoidal">Trapezoidal Rule</option>
                  <option value="simpson">Simpson’s 1/3 Rule</option>
                  <option value="midpoint">Midpoint Rule</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Subdivisions (n):</label>
              <div className="relative">
                <Sliders className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="number"
                  value={subdivisions}
                  min={1}
                  onChange={(e) => setSubdivisions(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-10 p-3 border rounded-md shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Compute Button */}
        <motion.button
          onClick={handleCompute}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-orange-400 text-white py-3 rounded-lg font-semibold shadow"
        >
          <Zap className="w-5 h-5" />
          <span>{indefinite ? "Integrate ∞" : "Integrate 🔢"}</span>
        </motion.button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center text-red-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XCircle className="w-5 h-5 mr-2" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Antiderivative */}
        <AnimatePresence>
          {antiderivative && (
            <motion.div
              className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center mb-1">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-blue-600">Antiderivative:</h3>
              </div>
              <p className="text-sm font-semibold text-gray-800">{antiderivative}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center mb-1">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-green-600">
                  Approximate Integral:
                </h3>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {method.charAt(0).toUpperCase() + method.slice(1)} from {lower} to {upper} = {result}
              </p>
              <p className="text-sm text-gray-500 italic">
                (n = {subdivisions})
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
