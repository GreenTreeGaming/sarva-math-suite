"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Hash, Zap, XCircle, CheckCircle, Info } from "lucide-react";

interface FactorInfo {
  number: number;
  factors: Record<number, number>;
}

interface PrimeInfo {
  inputs: number[];
  factorizations: FactorInfo[];
  gcd: number | null;
  lcm: number | null;
  steps: string[];
}

type TreeNode = { value: number; children: TreeNode[] };

export default function PrimeFactorizerPage() {
  const [input, setInput] = useState("");
  const [info, setInfo] = useState<PrimeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseInputs = (raw: string): number[] =>
    raw.split(/[ ,]+/).map((s) => parseInt(s, 10)).filter((n) => !isNaN(n) && n > 0);

  const factorize = (n: number): Record<number, number> => {
    const fac: Record<number, number> = {};
    let x = n;
    for (let p = 2; p * p <= x; p++) {
      while (x % p === 0) { fac[p] = (fac[p] || 0) + 1; x /= p; }
    }
    if (x > 1) fac[x] = (fac[x] || 0) + 1;
    return fac;
  };

  const buildFactorTree = (n: number): TreeNode => {
    const facs = factorize(n);
    if (facs[n] === 1 && Object.keys(facs).length === 1) return { value: n, children: [] };
    const p = Math.min(...Object.keys(facs).map((k) => parseInt(k, 10)));
    return { value: n, children: [buildFactorTree(p), buildFactorTree(n / p)] };
  };

  const gcd2 = (a: number, b: number): number => (b === 0 ? a : gcd2(b, a % b));
  const gcdAll = (nums: number[]): number => nums.reduce((a, b) => gcd2(a, b));
  const lcm2 = (a: number, b: number): number => (a * b) / gcd2(a, b);
  const lcmAll = (nums: number[]): number => nums.reduce((a, b) => lcm2(a, b));

  const handleAnalyze = () => {
    const nums = parseInputs(input);
    if (nums.length === 0) {
      setError("Enter at least one positive integer, e.g. '12 18 20'.");
      setInfo(null);
      return;
    }
    setError(null);

    const steps: string[] = [];
    const factorizations: FactorInfo[] = nums.map((n) => {
      const fac = factorize(n);
      const repr = Object.entries(fac).map(([p, e]) => (e > 1 ? `${p}^${e}` : p)).join(" × ");
      steps.push(`Prime factors of ${n}: ${repr}`);
      return { number: n, factors: fac };
    });

    let gcd: number | null = null;
    let lcm: number | null = null;
    if (nums.length > 1) {
      gcd = gcdAll(nums);
      lcm = lcmAll(nums);
      steps.push(`GCD of all numbers: ${gcd}`);
      steps.push(`LCM of all numbers: ${lcm}`);
    }

    setInfo({ inputs: nums, factorizations, gcd, lcm, steps });
  };

  const Tree: React.FC<{ node: TreeNode }> = ({ node }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex flex-col items-center">
      <div className="px-2 py-1 bg-purple-100 rounded border border-purple-300">{node.value}</div>
      {node.children.length > 0 && (
        <div className="flex space-x-4 mt-2">
          {node.children.map((child, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="h-4 border-l-2 border-b-2 border-purple-300"></span>
              <Tree node={child} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <motion.div className="max-w-3xl mx-auto flex flex-col items-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Sarva Math Suite</h1>
        <Link href="/" className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Home</Link>
        <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-2"><Hash className="w-6 h-6 text-purple-600" /> Prime Factorizer & GCD/LCM</h2>

        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter ints, e.g. '12 18 20'" className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm" />
          <motion.button onClick={handleAnalyze} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow flex items-center"><Zap className="w-5 h-5 mr-2" /> Analyze</motion.button>
        </div>

        <AnimatePresence>{error && <motion.div className="flex items-center text-red-500 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><XCircle className="w-5 h-5 mr-2" />{error}</motion.div>}</AnimatePresence>

        <AnimatePresence>
          {info && (
            <motion.div className="bg-white border border-gray-200 shadow p-6 rounded-xl w-full text-sm space-y-6" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center mb-4"><CheckCircle className="w-5 h-5 text-green-600 mr-2" /><h3 className="text-lg font-semibold text-purple-600">Results</h3></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {info.factorizations.map((fi) => (
                  <div key={fi.number} className="space-y-2">
                    <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-500" /><strong>{fi.number}:</strong></div>
                    <div className="relative overflow-auto p-4 bg-gray-50 rounded max-h-80 max-w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-gray-50 after:to-transparent"><Tree node={buildFactorTree(fi.number)} /></div>
                  </div>
                ))}
              </div>

              {(info.gcd !== null || info.lcm !== null) && (
                <div className="mt-4 flex flex-wrap gap-6">
                  {info.gcd !== null && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-500" /><strong>GCD:</strong> {info.gcd}</div>}
                  {info.lcm !== null && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-500" /><strong>LCM:</strong> {info.lcm}</div>}
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1"><Info className="w-4 h-4 text-blue-600" /> Step-by-Step Breakdown</h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-600">{info.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
