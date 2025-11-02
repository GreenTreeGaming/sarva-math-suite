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
      t Tests
    </h2>
  </motion.div>
);

const parseNumbers = (input) => input.split(/[\,\s]+/).map(Number).filter((n) => !isNaN(n));

const tTestCalculations = {
  oneSample: (sample, mu, tail) => {
    const n = sample.length;
    const mean = sample.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(sample.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (n - 1));
    const t = (mean - mu) / (std / Math.sqrt(n));
    const df = n - 1;

    const tcdf = (t, df) => {
      const x = Math.abs(t);
      const a = 1 / (1 + 0.2316419 * x);
      const poly = a * (0.319381530 + a * (-0.356563782 + a * (1.781477937 + a * (-1.821255978 + a * 1.330274429))));
      const z = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
      const p = z * poly;
      return t < 0 ? p : 1 - p;
    };

    let p;
    if (tail === "≠") {
      p = 2 * tcdf(-Math.abs(t), df);
    } else if (tail === "<") {
      p = tcdf(t, df);
    } else {
      p = 1 - tcdf(t, df);
    }

    return {
      "Sample Size": n,
      "Sample Mean": mean.toFixed(4),
      "Sample Std Dev": std.toFixed(4),
      "Hypothesized Mean (μ₀)": mu,
      "Test Type": `μ ${tail} μ₀`,
      "t-Statistic": t.toFixed(4),
      "p-Value": p.toFixed(4)
    };
  },
  twoSample: (sample1, sample2) => {
    const n1 = sample1.length, n2 = sample2.length;
    const mean1 = sample1.reduce((a, b) => a + b, 0) / n1;
    const mean2 = sample2.reduce((a, b) => a + b, 0) / n2;
    const var1 = sample1.reduce((sum, x) => sum + (x - mean1) ** 2, 0) / (n1 - 1);
    const var2 = sample2.reduce((sum, x) => sum + (x - mean2) ** 2, 0) / (n2 - 1);
    const pooledSE = Math.sqrt(var1 / n1 + var2 / n2);
    const t = (mean1 - mean2) / pooledSE;
    return {
      "Sample 1 Mean": mean1.toFixed(4),
      "Sample 2 Mean": mean2.toFixed(4),
      "Sample 1 Variance": var1.toFixed(4),
      "Sample 2 Variance": var2.toFixed(4),
      "t-Statistic": t.toFixed(4)
    };
  },
  paired: (x, y) => {
    const n = x.length;
    const d = x.map((val, i) => val - y[i]);
    const meanD = d.reduce((a, b) => a + b, 0) / n;
    const stdD = Math.sqrt(d.reduce((sum, val) => sum + (val - meanD) ** 2, 0) / (n - 1));
    const t = meanD / (stdD / Math.sqrt(n));
    return {
      "Number of Pairs": n,
      "Mean of Differences": meanD.toFixed(4),
      "Std Dev of Differences": stdD.toFixed(4),
      "t-Statistic": t.toFixed(4)
    };
  },
};

const page = () => {
  const [type, setType] = useState(null);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [mu, setMu] = useState("");
  const [tail, setTail] = useState("≠");
  const [result, setResult] = useState(null);

  const handleRun = () => {
    const sample1 = parseNumbers(input1);
    const sample2 = parseNumbers(input2);
    let output = null;

    if (type === 'one') output = tTestCalculations.oneSample(sample1, parseFloat(mu), tail);
    if (type === 'two') output = tTestCalculations.twoSample(sample1, sample2);
    if (type === 'paired') output = tTestCalculations.paired(sample1, sample2);

    setResult(output);
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Easily perform one-sample, two-sample, and paired t-tests to compare group means.
        </p>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select a Test Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => setType('one')} className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">One-Sample t-Test</button>
            <button onClick={() => setType('two')} className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Two-Sample t-Test</button>
            <button onClick={() => setType('paired')} className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Paired t-Test</button>
          </div>
        </div>

        {type && (
          <div className="space-y-4">
            <textarea value={input1} onChange={(e) => setInput1(e.target.value)} className="w-full p-3 border rounded-md shadow-sm" placeholder="Enter dataset 1 (comma or space separated)" />
            {(type === 'two' || type === 'paired') && (
              <textarea value={input2} onChange={(e) => setInput2(e.target.value)} className="w-full p-3 border rounded-md shadow-sm" placeholder="Enter dataset 2" />
            )}
            {type === 'one' && (
              <>
                <input type="number" value={mu} onChange={(e) => setMu(e.target.value)} className="w-full p-2 border rounded-md shadow-sm" placeholder="Enter hypothesized mean (μ₀)" />
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
              </>
            )}
            <button onClick={handleRun} className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Run t-Test</button>
          </div>
        )}

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
