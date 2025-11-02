"use client";

import React, { useState } from "react";
import Link from "next/link";
import { simplify, parse, evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  Zap,
  XCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface RationalInfo {
  simplified: string;
  numerator: string;
  denominator: string;
  holes: string[];
  xIntercepts: string[];
  verticalAsymptotes: string[];
  yIntercept: number;
  limits: Record<string, string>;
  steps: string[];
}

export default function RationalAnalyzerPage() {
  const [input, setInput] = useState("(x^2 - 1)/(x^2 - x - 2)");
  const [info, setInfo] = useState<RationalInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      setError(null);
      const steps: string[] = [];

      // Simplify overall expression
      const original = input;
      const simplifiedNode = simplify(original);
      const simplified = simplifiedNode.toString();
      steps.push(`Simplified: ${original} → ${simplified}`);

      const node = parse(simplified);
      if (!node.isOperatorNode || node.op !== "/") {
        throw new Error("invalid");
      }

      // Numerator / Denominator
      const [numNode, denNode] = node.args;
      const numerator = simplify(numNode.toString()).toString();
      const denominator = simplify(denNode.toString()).toString();
      steps.push(`Numerator: ${numerator}`);
      steps.push(`Denominator: ${denominator}`);

      // Find zeros (x-intercepts) & domain restrictions
      const zeros = solveEquation(numerator);
      steps.push(`x-intercepts (numerator=0): ${zeros.join(", ")}`);
      const domainRestrictions = solveEquation(denominator);
      steps.push(`Domain restrictions (denominator=0): ${domainRestrictions.join(", ")}`);

      const holes = zeros.filter(z => domainRestrictions.includes(z));
      if (holes.length) {
        steps.push(`Hole(s) at: ${holes.join(", ")}`);
      }

      const verticalAsymptotes = domainRestrictions.filter(z => !holes.includes(z));
      const xIntercepts = zeros.filter(z => !domainRestrictions.includes(z));

      // y-intercept at x=0
      const yIntercept = evaluate(simplified, { x: 0 });
      steps.push(`y-intercept: y = ${yIntercept}`);

      // Limit behavior
      const limits: Record<string, string> = {};
      [...holes, ...verticalAsymptotes].forEach(val => {
        const left = evaluateLimit(simplified, parseFloat(val) - 1e-3);
        const right = evaluateLimit(simplified, parseFloat(val) + 1e-3);
        limits[val] = `Left: ${left}, Right: ${right}`;
        steps.push(`Behavior near x=${val}: ${limits[val]}`);
      });

      setInfo({
        simplified,
        numerator,
        denominator,
        holes,
        xIntercepts,
        verticalAsymptotes,
        yIntercept,
        limits,
        steps
      });
    } catch {
      setInfo(null);
      setError("Please enter a valid rational expression (num/den).");
    }
  };

  function solveEquation(expr: string): string[] {
    try {
      const facs = simplify(expr)
        .toString()
        .split("*")
        .map(t => t.trim())
        .filter(t => t.includes("x"));
      return facs
        .map(f => {
          let term = f.replace(/^\(|\)$/g, "");
          const m = term.match(/x\^?(-?\d+)?/);
          if (!m) return "?";
          if (m[1]) return `${Math.sign(-m[1]!) * Math.abs(parseInt(m[1]!))}`;
          return term === "x" ? "0" : "?";
        })
        .filter(r => r !== "?");
    } catch {
      return [];
    }
  }

  function evaluateLimit(expr: string, xVal: number): string {
    try {
      return evaluate(expr, { x: xVal }).toFixed(3);
    } catch {
      return "undef";
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-3xl mx-auto flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
        }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link
          href="/"
          className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mb-6">📉 Rational Analyzer</h2>

        <motion.div
          className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="(x^2 - 1)/(x^2 - x - 2)"
            className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm"
          />
          <motion.button
            onClick={handleAnalyze}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow transition flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" /> Analyze
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center text-red-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {info && (
            <motion.div
              className="bg-white border border-gray-200 shadow p-6 rounded-xl w-full text-sm"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-600">Results</h3>
              </div>

              <ul className="space-y-2">
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>Simplified:</strong> {info.simplified}
                </li>
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>Numerator:</strong> {info.numerator}
                </li>
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>Denominator:</strong> {info.denominator}
                </li>
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>Holes:</strong>{" "}
                  {info.holes.length > 0 ? info.holes.join(", ") : "None"}
                </li>
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>Vertical Asymptotes:</strong>{" "}
                  {info.verticalAsymptotes.length > 0
                    ? info.verticalAsymptotes.join(", ")
                    : "None"}
                </li>
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>X‑Intercepts:</strong>{" "}
                  {info.xIntercepts.length > 0
                    ? info.xIntercepts.join(", ")
                    : "None"}
                </li>
                <li>
                  <Info className="inline-block w-4 h-4 text-gray-500 mr-1" />
                  <strong>Y‑Intercept:</strong> {info.yIntercept.toFixed(3)}
                </li>
              </ul>

              {info.limits && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                    Behavior near Discontinuities
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(info.limits).map(([x, lim]) => (
                      <li key={x}>
                        <strong>x = {x}:</strong> {lim}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-1 text-blue-600" />
                  Step‑by‑Step Breakdown
                </h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                  {info.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
