"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, XCircle, CheckCircle, Info } from "lucide-react";
import { simplify, parse } from "mathjs";

export default function FunctionSimplifierPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSimplify = () => {
    setError(null);
    setSteps([]);
    setResult(null);

    try {
      // Parse input
      const node = parse(input);

      // Combine two fraction terms if present
      let combined = node;
      if (
        node.isOperatorNode &&
        (node.op === '+' || node.op === '-') &&
        node.args.length === 2 &&
        node.args[0].isOperatorNode && node.args[0].op === '/' &&
        node.args[1].isOperatorNode && node.args[1].op === '/'
      ) {
        const left = node.args[0] as any;
        const right = node.args[1] as any;
        const a = left.args[0];
        const b = left.args[1];
        const c = right.args[0];
        const d = right.args[1];
        // numerator terms
        const num1 = a;
        const num2 = node.op === '+' ? c : new math.OperatorNode('-', 'subtract', [new math.ConstantNode(0), c]);
        // build new denom b*d
        const newDen = new math.OperatorNode('*', 'multiply', [b, d]);
        // term1 = a * d
        const term1 = new math.OperatorNode('*', 'multiply', [num1, d]);
        // term2 = ± c * b
        const term2 = new math.OperatorNode('*', 'multiply', [num2, b]);
        // numerator sum
        const newNum = new math.OperatorNode('+', 'add', [term1, term2]);
        combined = new math.OperatorNode('/', 'divide', [newNum, newDen]);
      }

      // Simplify the (possibly combined) expression
      const simplified = simplify(combined);
      const simpStr = simplified.toString();

      const newSteps: string[] = [];
      newSteps.push(`Original: ${input}`);
      if (combined.toString() !== node.toString()) newSteps.push(`Combined: ${combined.toString()}`);
      newSteps.push(`Simplified: ${simpStr}`);

      setSteps(newSteps);
      setResult(simpStr);
    } catch {
      setError("Invalid expression—please enter a valid algebraic function.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="max-w-3xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link
          href="/"
          className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-purple-600" /> Function Simplifier
        </h2>

        <div className="w-full mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. (x^2 - 1)/(x + 1)"
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>

        <motion.button
          onClick={handleSimplify}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow mb-6 flex items-center"
        >
          <Zap className="w-5 h-5 mr-2" /> Simplify
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center text-red-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XCircle className="w-5 h-5 mr-2" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {result !== null && (
          <motion.div
            className="bg-white border border-gray-200 shadow p-6 rounded-xl w-full text-sm space-y-4"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-purple-600">Result</h3>
            </div>
            <p className="pl-4 break-words">{result}</p>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-600" /> Step-by-Step
              </h4>
              <ol className="list-decimal pl-6 space-y-1 text-gray-600">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
