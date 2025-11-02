"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Percent,
  Shuffle,
  Zap,
  XCircle,
  CheckCircle,
  Info,
} from "lucide-react";

// Extended Euclidean for inverse and gcd
function egcd(a: number, b: number): { g: number; x: number; y: number } {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const { g, x: x1, y: y1 } = egcd(b, a % b);
  return { g, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

export default function ModularArithmeticPage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [m, setM] = useState("");
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);

  const handleCompute = () => {
    setError(null);
    setResult(null);
    setSteps([]);
    const ai = parseInt(a, 10);
    const bi = parseInt(b, 10);
    const mi = parseInt(m, 10);
    if (isNaN(ai) || isNaN(mi)) {
      setError("Enter valid integers for A and modulus M.");
      return;
    }
    const seq = [];

    // addition
    if (!isNaN(bi)) {
      const add = ((ai + bi) % mi + mi) % mi;
      seq.push(`Addition: (${ai} + ${bi}) mod ${mi} = ${add}`);
    }
    // multiplication
    if (!isNaN(bi)) {
      const mul = ((ai * bi) % mi + mi) % mi;
      seq.push(`Multiplication: (${ai} × ${bi}) mod ${mi} = ${mul}`);
    }
    // inverse
    const { g, x } = egcd(ai, mi);
    if (g !== 1) {
      seq.push(`No inverse: gcd(${ai}, ${mi}) = ${g} ≠ 1`);
    } else {
      const inv = ((x % mi) + mi) % mi;
      seq.push(`Inverse: ${ai}⁻¹ mod ${mi} = ${inv}`);
    }
    // solve ax ≡ b mod m
    if (!isNaN(bi)) {
      seq.push(`Solving: ${ai}x ≡ ${bi} (mod ${mi})`);
      if (bi % g !== 0) {
        seq.push(`No solutions: ${bi} not divisible by gcd ${g}`);
      } else {
        // general solution x0 = inv * (b/g) mod (m/g)
        if (g === 1) {
          const { x: invx } = egcd(ai, mi);
          const invmod = ((invx % mi) + mi) % mi;
          const sol = ((invmod * bi) % mi + mi) % mi;
          seq.push(`Unique solution: x ≡ ${sol} (mod ${mi})`);
        } else {
          // multiple solutions
          const m2 = mi / g;
          const b2 = bi / g;
          const { x: invx } = egcd(ai / g, mi / g);
          const invm2 = ((invx % m2) + m2) % m2;
          const x0 = (invm2 * b2) % m2;
          const sols = [];
          for (let k = 0; k < g; k++) sols.push((x0 + k * m2) % mi);
          seq.push(`Solutions: x ≡ {${sols.join(", ")}} mod ${mi}`);
        }
      }
    }

    setSteps(seq);
    setResult(true);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="max-w-3xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link href="/" className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-2">
          <Shuffle className="w-6 h-6 text-purple-600" /> Modular Arithmetic Helper
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Percent className="w-4 h-4 text-gray-500" /> A:
            </label>
            <input
              type="number" value={a} onChange={(e) => setA(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm" placeholder="a"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Percent className="w-4 h-4 text-gray-500" /> B:
            </label>
            <input
              type="number" value={b} onChange={(e) => setB(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm" placeholder="b (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Percent className="w-4 h-4 text-gray-500" /> M:
            </label>
            <input
              type="number" value={m} onChange={(e) => setM(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm" placeholder="modulus"
            />
          </div>
        </div>

        <motion.button
          onClick={handleCompute}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow flex items-center mb-4"
        >
          <Zap className="w-5 h-5 mr-2" /> Compute
        </motion.button>

        <AnimatePresence>
          {error && <motion.div className="flex items-center text-red-500 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <XCircle className="w-5 h-5 mr-2" /> {error}
          </motion.div>}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div className="bg-white border border-gray-200 shadow p-6 rounded-xl w-full text-sm space-y-4"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            >
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-600">Results</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                {steps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
