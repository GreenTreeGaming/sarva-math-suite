"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart2, CheckCircle } from 'lucide-react';

const Header = () => (
  <motion.div
    className="max-w-4xl mx-auto flex flex-col items-center"
    initial={{ opacity: 0, y: -20 }}
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
    <h2 className="text-4xl font-extrabold mb-6 flex items-center">
      <BarChart2 className="w-6 h-6 mr-2 text-purple-600" />
      z Tests
    </h2>
  </motion.div>
);

const parseNumbers = (input) => input.split(/[\,\s]+/).map(Number).filter((n) => !isNaN(n));

const zTestCalculations = {
  oneSample: (sample, mu, sigma, tail) => {
    const n = sample.length;
    const mean = sample.reduce((a, b) => a + b, 0) / n;
    const z = (mean - mu) / (sigma / Math.sqrt(n));

    const pValue = (z) => {
      const x = Math.abs(z);
      const a = 1 / (1 + 0.2316419 * x);
      const poly = a * (0.319381530 + a * (-0.356563782 + a * (1.781477937 + a * (-1.821255978 + a * 1.330274429))));
      const zVal = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
      const p = zVal * poly;
      return z < 0 ? p : 1 - p;
    };

    let p;
    if (tail === "≠") {
      p = 2 * pValue(-Math.abs(z));
    } else if (tail === "<") {
      p = pValue(z);
    } else {
      p = 1 - pValue(z);
    }

    return {
      "Sample Size": n,
      "Sample Mean": mean.toFixed(4),
      "Population Std Dev (σ)": sigma,
      "Hypothesized Mean (μ₀)": mu,
      "Test Type": `μ ${tail} μ₀`,
      "z-Statistic": z.toFixed(4),
      "p-Value": p.toFixed(4)
    };
  }
};

const page = () => {
  const [input, setInput] = useState("");
  const [mu, setMu] = useState("");
  const [sigma, setSigma] = useState("");
  const [tail, setTail] = useState("≠");
  const [result, setResult] = useState(null);

  const handleRun = () => {
    const sample = parseNumbers(input);
    const output = zTestCalculations.oneSample(sample, parseFloat(mu), parseFloat(sigma), tail);
    setResult(output);
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Perform a one-sample z-test for population means when the population standard deviation is known.
        </p>

        <div className="space-y-4">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-3 border rounded-md shadow-sm" placeholder="Enter sample data (comma or space separated)" />
          <input type="number" value={mu} onChange={(e) => setMu(e.target.value)} className="w-full p-2 border rounded-md shadow-sm" placeholder="Enter hypothesized mean (μ₀)" />
          <input type="number" value={sigma} onChange={(e) => setSigma(e.target.value)} className="w-full p-2 border rounded-md shadow-sm" placeholder="Enter population standard deviation (σ)" />
          <div className="flex space-x-2">
            {["≠", "<", ">"].map(symbol => (
              <button
                key={symbol}
                onClick={() => setTail(symbol)}
                className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${tail === symbol ? "bg-purple-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
              >
                μ {symbol} μ₀
              </button>
            ))}
          </div>
          <button onClick={handleRun} className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Run z-Test</button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold">Results</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(result).map(([key, val]) => (
                  <div key={key} className="text-sm text-gray-700">
                    <span className="font-medium">{key}: </span>{val}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default page;