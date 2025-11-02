"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Layers3 } from "lucide-react";
import numeric from 'numeric';

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
      <Layers3 className="w-6 h-6 mr-2 text-purple-600" />
      Vector Spaces
    </h2>
  </motion.div>
);

const Page = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [vectors, setVectors] = useState<string[][]>([
    ["", ""],
    ["", ""]
  ]);
  const [result, setResult] = useState<{ span: string; dimension: number; basis: string[][]; isBasis: boolean } | null>(null);

  const handleChange = (i: number, j: number, value: string) => {
    const updated = vectors.map(row => [...row]);
    updated[i][j] = value;
    setVectors(updated);
  };

  const handleCalculate = () => {
    const numericMatrix = vectors.map(row => row.map(val => parseFloat(val) || 0));
    const svd = numeric.svd(numericMatrix);
    const r = svd.S.filter(s => s > 1e-10).length;

    const isBasis = r === rows;
    const basis = numericMatrix.slice(0, r).map(row => row.map(val => val.toFixed(4)));
    const dimension = r;
    const span = `The set of all linear combinations of the ${rows} input vectors in ${cols}-D space.`;

    setResult({ span, dimension, basis, isBasis });
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Explore basis, dimension, and span of vector spaces.
        </p>

        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium"># of Vectors</label>
            <input type="number" min={1} value={rows} onChange={(e) => {
              const newRows = parseInt(e.target.value);
              setRows(newRows);
              setVectors(Array(newRows).fill(null).map(() => Array(cols).fill("")));
            }} className="w-24 p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Vector Dimension</label>
            <input type="number" min={1} value={cols} onChange={(e) => {
              const newCols = parseInt(e.target.value);
              setCols(newCols);
              setVectors(Array(rows).fill(null).map(() => Array(newCols).fill("")));
            }} className="w-32 p-2 border rounded" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Vectors</h3>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))` }}>
            {vectors.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`cell-${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={(e) => handleChange(i, j, e.target.value)}
                  className="p-2 border text-center border-gray-300 rounded"
                />
              ))
            )}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Analyze
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold mb-2">Results</h3>
              <p className="text-sm text-gray-700 mb-2">{result.span}</p>
              <p className="text-sm text-gray-700 mb-2">Dimension: {result.dimension}</p>
              <p className="text-sm text-gray-700 mb-2">
                {result.isBasis
                  ? "The input vectors form a basis."
                  : "The input vectors do not form a basis (they are linearly dependent)."}
              </p>
              <p className="text-sm text-gray-700 mb-1">Basis:</p>
              <div className="ml-2 grid gap-1 text-sm" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
                {result.basis.map((vec, i) => (
                  <div key={i} className="flex gap-2">
                    ({vec.join(", ")})
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

export default Page;
