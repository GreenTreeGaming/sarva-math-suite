"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Equal } from "lucide-react";
import { lusolve } from "mathjs";

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
      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
    </Link>
    <h2 className="text-4xl font-extrabold mb-6 flex items-center">
      <Equal className="w-6 h-6 mr-2 text-purple-600" />
      Linear Equation Solver
    </h2>
  </motion.div>
);

const Page = () => {
  const [size, setSize] = useState(2);
  const [matrixA, setMatrixA] = useState<string[][]>([]);
  const [vectorB, setVectorB] = useState<string[]>([]);
  const [solution, setSolution] = useState<string[] | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMatrixA(Array(size).fill(null).map(() => Array(size).fill("")));
    setVectorB(Array(size).fill(""));
  }, [size]);

  const handleMatrixChange = (i: number, j: number, value: string) => {
    setMatrixA(prev => {
      const copy = prev.map(row => [...row]);
      copy[i][j] = value;
      return copy;
    });
  };

  const handleVectorChange = (i: number, value: string) => {
    setVectorB(prev => {
      const copy = [...prev];
      copy[i] = value;
      return copy;
    });
  };

  const parseMatrix = (m: string[][]): number[][] =>
    m.map(row => row.map(val => parseFloat(val) || 0));

  const parseVector = (v: string[]): number[] =>
    v.map(val => parseFloat(val) || 0);

  const handleSolve = () => {
    try {
      const A = parseMatrix(matrixA);
      const b = parseVector(vectorB);
      const xRaw = lusolve(A, b).map(row => row[0]);
      const x = xRaw.map(val => val.toFixed(4));
      setSolution(x);

      const stepList = [
        `Given system: A·x = b`,
        `Matrix A: [${A.map(row => `[${row.join(", ")}]`).join(", ")}]`,
        `Vector b: [${b.join(", ")}]`,
        `Use matrix inversion or Gaussian elimination to solve A·x = b`,
        `Solution vector x: [${x.join(", ")}]`
      ];
      setSteps(stepList);

      setError(null);
    } catch (err) {
      setError("Could not solve the system. Make sure A is square and invertible.");
      setSolution(null);
      setSteps([]);
    }
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Solve systems of linear equations using matrices.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Matrix Size (n × n)</label>
          <input
            type="number"
            min={2}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-24 p-2 border rounded-md"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Matrix A</h3>
          <div className="grid gap-1 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))` }}>
            {matrixA.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`a-${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                  className="p-2 border text-center border-gray-300 rounded"
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Vector b</h3>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))` }}>
            {vectorB.map((val, i) => (
              <input
                key={`b-${i}`}
                type="number"
                value={val}
                onChange={(e) => handleVectorChange(i, e.target.value)}
                className="p-2 border text-center border-gray-300 rounded"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSolve}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Solve
        </button>

        <AnimatePresence>
          {(solution || error) && (
            <motion.div
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold">Solution</h3>
                  </div>
                  <div className="text-sm text-gray-700">
                    x = [ {solution?.join(", ")} ]
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Steps:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Page;