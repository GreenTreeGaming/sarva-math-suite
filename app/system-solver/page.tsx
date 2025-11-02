"use client";

import React, { useState } from "react";
import Link from "next/link";
import { evaluate, lusolve, matrix } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Zap,
  XCircle,
  CheckCircle
} from "lucide-react";

export default function SystemsSolverPage() {
  const [equations, setEquations] = useState<string[]>([
    "2x + 3y = 5",
    "x - y = 1"
  ]);
  const [solution, setSolution] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEquationChange = (idx: number, value: string) => {
    const copy = [...equations];
    copy[idx] = value;
    setEquations(copy);
  };

  const addEquation = () => setEquations([...equations, ""]);

  const removeEquation = (idx: number) => {
    setEquations(equations.filter((_, i) => i !== idx));
  };

  const handleSolve = () => {
    try {
      setError(null);
      setSolution(null);

      const lines = equations.filter((e) => e.trim());
      const vars = Array.from(
        new Set(
          lines.flatMap((line) =>
            Array.from(line.matchAll(/[a-zA-Z]+/g), (m) => m[0])
          )
        )
      );
      if (vars.length === 0) throw new Error("No variables found.");

      const A: number[][] = [];
      const b: number[] = [];

      lines.forEach((line) => {
        const [lhs, rhs] = line.split("=").map((s) => s.trim());
        const expr = `(${lhs})-(${rhs})`;

        const zeroSubs: Record<string, number> = {};
        vars.forEach((v) => (zeroSubs[v] = 0));
        const constant = evaluate(expr, zeroSubs);

        const row = vars.map((v) => {
          const oneSubs = { ...zeroSubs, [v]: 1 };
          return evaluate(expr, oneSubs) - constant;
        });

        A.push(row);
        b.push(-constant);
      });

      const solMatrix = lusolve(matrix(A), matrix(b));
      const solArr = solMatrix.toArray().flat();
      const solObj: Record<string, number> = {};
      vars.forEach((v, i) => {
        solObj[v] = parseFloat(solArr[i].toFixed(6));
      });

      setSolution(solObj);
    } catch (e: any) {
      setError(e.message || "Could not solve system.");
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
        className="max-w-4xl mx-auto flex flex-col items-center mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
        }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link
          href="/"
          className="flex items-center mt-2 text-sm text-gray-600 hover:text-purple-500 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </motion.div>

      {/* Solver Form */}
      <motion.div
        className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-extrabold mb-4">🔢 Systems Solver</h2>

        {equations.map((eq, i) => (
          <div key={i} className="flex items-center mb-3 space-x-2">
            <motion.input
              layout
              type="text"
              value={eq}
              onChange={(e) => handleEquationChange(i, e.target.value)}
              placeholder={`Equation ${i + 1}`}
              className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <motion.button
              layout
              onClick={() => removeEquation(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-red-500 hover:text-red-600 transition"
              aria-label="Remove equation"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        ))}

        <motion.button
          layout
          onClick={addEquation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center space-x-2 mb-6 text-purple-600 hover:text-purple-800 transition"
        >
          <Plus size={16} /> <span>Add Equation</span>
        </motion.button>

        <motion.button
          layout
          onClick={handleSolve}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow flex items-center justify-center"
        >
          <Zap className="w-5 h-5 mr-2" />
          Solve System
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p
              className="flex items-center text-red-500 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Solution Display */}
      <AnimatePresence>
        {solution && (
          <motion.div
            className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-green-600">Solution</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(solution).map(([v, val]) => (
                <motion.div
                  key={v}
                  layout
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="font-medium text-gray-700">{v}</p>
                  <p className="text-2xl font-bold text-gray-900">{val}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
