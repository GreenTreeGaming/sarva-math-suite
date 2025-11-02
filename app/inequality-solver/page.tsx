"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, XCircle, CheckCircle, Info } from "lucide-react";
import { parse } from "mathjs";

export default function InequalitySolverPage() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to format numeric boundaries in simplest radical form
  function formatNum(x: number): string {
    const eps = 1e-6;
    // integer check
    const i = Math.round(x);
    if (Math.abs(x - i) < eps) return `${i}`;
    // sqrt check
    const sq = x * x;
    const n = Math.round(sq);
    if (Math.abs(sq - n) < 1e-3) {
      return x < 0 ? `-√${n}` : `√${n}`;
    }
    return x.toFixed(3);
  }

  const handleSolve = () => {
    setError(null);
    setSolution(null);
    setSteps([]);

    // 1) Parse input
    const m = input.match(/\s*(.+?)\s*(<=|>=|<|>)\s*(.+)/);
    if (!m) {
      setError("Enter a valid inequality, e.g. '(x-4)/(x-1) > (x/3)+4'.");
      return;
    }
    const [, lhsRaw, op, rhsRaw] = m;

    // 2) Build f(x)
    const expr = parse(`(${lhsRaw}) - (${rhsRaw})`);
    const fn = expr.compile();

    // 3) Find critical points via sampling + bisection
    const xs: number[] = [];
    const SAMPLES = 1000;
    const MINX = -50, MAXX = 50;
    for (let i = 0; i <= SAMPLES; i++) xs.push(MINX + (MAXX - MINX) * (i / SAMPLES));
    const crit = new Set<number>();
    let yPrev = fn.evaluate({ x: xs[0] });
    for (let i = 1; i < xs.length; i++) {
      const xCurr = xs[i];
      const yCurr = fn.evaluate({ x: xCurr });
      if (!isFinite(yPrev) || !isFinite(yCurr)) {
        crit.add(xs[i - 1]);
        crit.add(xCurr);
      } else if (yPrev === 0) {
        crit.add(xs[i - 1]);
      } else if (yPrev * yCurr < 0) {
        let a = xs[i - 1], b = xCurr;
        for (let k = 0; k < 20; k++) {
          const m = (a + b) / 2;
          const ym = fn.evaluate({ x: m });
          if (ym === 0) { a = b = m; break; }
          if (Math.sign(ym) === Math.sign(yPrev)) a = m;
          else b = m;
        }
        crit.add((a + b) / 2);
      }
      yPrev = yCurr;
    }
    const boundaries = Array.from(crit).sort((a, b) => a - b);

    // 4) Test intervals
    const allBounds = [Number.NEGATIVE_INFINITY, ...boundaries, Number.POSITIVE_INFINITY];
    let solutionIntervals: [number, number][] = [];
    for (let i = 0; i < allBounds.length - 1; i++) {
      const a = allBounds[i], b = allBounds[i + 1];
      let mid: number;
      if (a === Number.NEGATIVE_INFINITY) mid = b - 1;
      else if (b === Number.POSITIVE_INFINITY) mid = a + 1;
      else mid = (a + b) / 2;
      const vm = fn.evaluate({ x: mid });
      if (!isFinite(vm)) continue;
      const holds =
        (op === '>'  && vm >  0) ||
        (op === '>=' && vm >= 0) ||
        (op === '<'  && vm <  0) ||
        (op === '<=' && vm <= 0);
      if (holds) solutionIntervals.push([a, b]);
    }

    // 5) Merge adjacent intervals
    const merged: [number, number][] = [];
    const epsMerge = 1e-6;
    for (let [a, b] of solutionIntervals) {
      if (merged.length === 0) merged.push([a, b]);
      else {
        const [pa, pb] = merged[merged.length - 1];
        if (Math.abs(a - pb) < epsMerge) merged[merged.length - 1][1] = b;
        else merged.push([a, b]);
      }
    }
    solutionIntervals = merged;

    // 6) Format solution in radical form when possible
    let solStr: string;
    if (solutionIntervals.length === 0) solStr = "∅";
    else {
      solStr = solutionIntervals
        .map(([a, b]) => {
          const left  = a === Number.NEGATIVE_INFINITY ? "(-∞" : `(${formatNum(a)}`;
          const right = b === Number.POSITIVE_INFINITY ? "∞)" : `${formatNum(b)})`;
          return `${left}, ${right}`;
        })
        .join(" ∪ ");
    }

    // 7) Save steps + solution
    setSteps([
      `Form f(x) = ${lhsRaw} − (${rhsRaw})`,
      `Critical points: ${boundaries.map(x => formatNum(x)).join(", ")}`,
      `Merge adjacent intervals where boundaries coincide`,
      `Test each merged interval to see where f(x) ${op} 0`,
      `Solution: ${solStr}`
    ]);
    setSolution(solStr);
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <motion.div className="max-w-2xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link href="/" className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-purple-600" /> Inequality Solver
        </h2>

        <div className="w-full mb-4">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g. (x-4)/(x-1) > (x/3) + 4" className="w-full p-3 border rounded-lg shadow-sm" />
        </div>
        <motion.button onClick={handleSolve} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow mb-6">
          <Zap className="w-5 h-5 mr-2 inline" /> Solve
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.div className="flex items-center text-red-500 mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <XCircle className="w-5 h-5 mr-2" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {solution !== null && (
          <motion.div className="bg-white border border-gray-200 shadow p-6 rounded-xl w-full text-sm space-y-4"
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-purple-600">Solution</h3>
            </div>
            <p className="pl-4">{solution}</p>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-600" /> Step-by-Step
              </h4>
              <ol className="list-decimal pl-6 space-y-1 text-gray-600">
                {steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}
