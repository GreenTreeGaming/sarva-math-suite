"use client";

import React, { useState, JSX } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, XCircle, Calculator, Search, CheckCircle } from "lucide-react";
import { create, all, parse, fraction } from "mathjs";

const math = create(all);

// Newton-Raphson's method to find real roots
function findRealRootsGeneral(
  fx: (x: number) => number,
  dfx: (x: number) => number,
  maxIterations = 50,
  tolerance = 1e-7,
  maxRoots = 10
): number[] {
  const roots: number[] = [];
  const initialGuesses: number[] = [];
  for (let x = -10; x <= 10; x += 0.5) initialGuesses.push(x);

  for (const guess of initialGuesses) {
    let x = guess;
    for (let iter = 0; iter < maxIterations; iter++) {
      const y = fx(x);
      const dy = dfx(x);
      if (Math.abs(dy) < 1e-12) break;
      const xNew = x - y / dy;
      if (Math.abs(xNew - x) < tolerance) {
        if (!roots.some((r) => Math.abs(r - xNew) < 1e-4)) {
          roots.push(xNew);
        }
        break;
      }
      x = xNew;
    }
    if (roots.length >= maxRoots) break;
  }

  return roots.sort((a, b) => a - b);
}

function toFraction(value: number): string {
  try {
    const frac = fraction(value);
    return `${frac.n}/${frac.d}`;
  } catch {
    return value.toFixed(6);
  }
}

function parseGeneralEquation(equation: string): ((x: number) => number)[] | null {
  try {
    const [lhsRaw, rhsRaw] = equation.split("=");
    if (!lhsRaw || !rhsRaw) return null;

    const expr = parse(`(${lhsRaw}) - (${rhsRaw})`);
    const compiled = expr.compile();
    const derivativeExpr = math.derivative(expr, "x").compile();

    return [
      (x: number) => compiled.evaluate({ x }),
      (x: number) => derivativeExpr.evaluate({ x }),
    ];
  } catch {
    return null;
  }
}

export default function EquationSolverPage() {
  const [equation, setEquation] = useState("");
  const [solutionSteps, setSolutionSteps] = useState<JSX.Element[] | null>(null);

  const solveEquation = () => {
    const steps: JSX.Element[] = [];
    const push = (content: JSX.Element, key: string) => {
      steps.push(
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2"
        >
          {content}
        </motion.div>
      );
    };

    const parsed = parseGeneralEquation(equation);
    if (!parsed) {
      push(
        <p className="text-red-600 font-semibold flex items-center gap-2">
          <XCircle size={20} /> Invalid equation format or unsupported functions!
        </p>,
        "invalid"
      );
    } else {
      const [f, df] = parsed;
      const realRoots = findRealRootsGeneral(f, df);

      if (realRoots.length === 0) {
        push(
          <p className="text-red-500 font-semibold flex items-center gap-2">
            <XCircle size={18} /> No real solutions found.
          </p>,
          "no-real"
        );
      } else {
        push(
          <div className="space-y-2">
            <p className="text-green-700 font-semibold flex items-center gap-2">
              <CheckCircle size={18} /> Solutions:
            </p>
            {realRoots.map((r, i) => (
              <p key={i} className="ml-4 text-gray-800 flex items-center gap-1">
                x<sub>{i + 1}</sub> = {r.toFixed(6)} <code className="text-sm text-gray-700">({toFraction(r)})</code>
              </p>
            ))}
          </div>,
          "roots"
        );
      }
    }

    setSolutionSteps(steps);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-8 text-gray-800 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
          <Calculator size={32} /> Sarva Math Suite
        </h1>
        <Link
          href="/"
          className="flex items-center text-sm text-gray-600 hover:text-purple-500 transition"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mt-4 flex items-center gap-2">
          <Search size={28} className="text-purple-600" /> Equation Solver
        </h2>
      </motion.div>

      <motion.div
        className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-gray-600"
        >
          <div className="flex items-center gap-2">
            <Search size={16} />
            <span>Enter an equation, e.g.:</span>
          </div>
          <ul className="ml-8 list-disc mt-1">
            <li><code>x^3 - 4x + 1 = 0</code></li>
            <li><code>e^(0.3x) = 2</code></li>
          </ul>
        </motion.div>

        <div className="flex space-x-2 mb-4">
          <motion.input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter equation here"
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-200"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            onClick={solveEquation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg shadow"
          >
            <Zap size={20} />
          </motion.button>
        </div>

        <AnimatePresence>
          {solutionSteps && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2 }}
              className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200 space-y-2"
            >
              {solutionSteps}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
