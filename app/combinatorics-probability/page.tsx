"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Grid,
  Percent,
  List,
  Zap,
  XCircle,
  CheckCircle,
  Info,
} from "lucide-react";

// factorial
function factorial(n: number): number {
  if (n < 0) return NaN;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

export default function CombinatoricsProbabilityPage() {
  // permutations & combinations
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [perm, setPerm] = useState<number | null>(null);
  const [comb, setComb] = useState<number | null>(null);

  // binomial expansion
  const [bn, setBn] = useState(4);
  const [binomCoeffs, setBinomCoeffs] = useState<number[] | null>(null);

  // probability events
  const [pA, setPA] = useState(0.5);
  const [pB, setPB] = useState(0.5);
  const [pAgB, setPAgB] = useState(0.5);
  const [results, setResults] = useState<Record<string, any> | null>(null);

  const handlePermComb = () => {
    const nFact = factorial(n);
    const rFact = factorial(r);
    const nrFact = factorial(n - r);
    setPerm(nFact / nrFact);
    setComb(nFact / (rFact * nrFact));
  };

  const handleBinomial = () => {
    const coeffs: number[] = [];
    for (let k = 0; k <= bn; k++) {
      coeffs.push(factorial(bn) / (factorial(k) * factorial(bn - k)));
    }
    setBinomCoeffs(coeffs);
  };

  const handleProbability = () => {
    const add = pA + pB - pA * pB; // P(A ∪ B)
    const inter = pA * pB; // independent intersection
    const cond = pAgB; // P(B|A)
    const interCond = pA * cond; // P(A∩B)
    const pBA = interCond / (pB || 1);
    setResults({ add, inter, interCond, pBA });
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link href="/" className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mb-8 flex items-center gap-2">
          <List className="w-6 h-6 text-purple-600" /> Combinatorics & Probability
        </h2>

        {/* Permutations & Combinations */}
        <motion.div
          className="w-full bg-white p-6 rounded-xl shadow space-y-4 mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-2 gap-2">
            <Grid className="w-5 h-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Permutations &amp; Combinations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">n:</label>
              <input
                type="number" value={n} onChange={(e) => setN(+e.target.value)}
                className="w-full p-2 border rounded" min={0}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">r:</label>
              <input
                type="number" value={r} onChange={(e) => setR(+e.target.value)}
                className="w-full p-2 border rounded" min={0}
              />
            </div>
            <motion.button
              onClick={handlePermComb}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="mt-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" /> Compute
            </motion.button>
          </div>
          <AnimatePresence>
            {(perm !== null || comb !== null) && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="pt-4 border-t flex space-x-6"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>P(n,r): {perm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>C(n,r): {comb}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Binomial Expansion */}
        <motion.div
          className="w-full bg-white p-6 rounded-xl shadow space-y-4 mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-2 gap-2">
            <Grid className="w-5 h-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Binomial Theorem Expansion</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm mb-1">n (power):</label>
              <input
                type="number" value={bn} onChange={(e) => setBn(+e.target.value)}
                className="w-full p-2 border rounded" min={0}
              />
            </div>
            <motion.button
              onClick={handleBinomial}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" /> Coefficients
            </motion.button>
          </div>
          <AnimatePresence>
            {binomCoeffs && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="pt-4 border-t"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Coefficients:</span>
                </div>
                <pre className="overflow-auto bg-gray-50 p-3 rounded">
                  {`[ ${binomCoeffs.join(", ")} ]`}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Probability Events */}
        <motion.div
          className="w-full bg-white p-6 rounded-xl shadow space-y-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-2 gap-2">
            <Percent className="w-5 h-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Basic Probability</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">P(A):</label>
              <input type="number" step="0.01" value={pA} onChange={(e) => setPA(+e.target.value)} className="w-full p-2 border rounded" min={0} max={1} />
            </div>
            <div>
              <label className="block text-sm mb-1">P(B):</label>
              <input type="number" step="0.01" value={pB} onChange={(e) => setPB(+e.target.value)} className="w-full p-2 border rounded" min={0} max={1} />
            </div>
            <div>
              <label className="block text-sm mb-1">P(B|A):</label>
              <input type="number" step="0.01" value={pAgB} onChange={(e) => setPAgB(+e.target.value)} className="w-full p-2 border rounded" min={0} max={1} />
            </div>
            <motion.button
              onClick={handleProbability}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="col-span-1 sm:col-span-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" /> Evaluate
            </motion.button>
          </div>
          <AnimatePresence>
            {results && (
              <motion.div className="pt-4 border-t space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> P(A∪B): {results.add.toFixed(3)}</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> P(A∩B) (independent): {results.inter.toFixed(3)}</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> P(A∩B) (conditional): {results.interCond.toFixed(3)}</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> P(A|B): {results.pBA.toFixed(3)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}