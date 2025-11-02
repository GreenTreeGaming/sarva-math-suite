"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart2, CheckCircle } from 'lucide-react';
import { det } from 'mathjs';

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
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back to Home
    </Link>
    <h2 className="text-4xl font-extrabold mb-6 flex items-center">
      <BarChart2 className="w-6 h-6 mr-2 text-purple-600" />
      Determinant & Rank
    </h2>
  </motion.div>
);

const page = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrixData, setMatrixData] = useState<string[][]>(
    Array(2).fill(null).map(() => Array(2).fill(""))
  );
  const [result, setResult] = useState<{ Determinant: number | string; Rank: number } | null>(null);
  const [detSteps, setDetSteps] = useState<string[]>([]);

  useEffect(() => {
    setMatrixData(Array(rows).fill(null).map(() => Array(cols).fill("")));
  }, [rows, cols]);

  const handleMatrixChange = (i: number, j: number, value: string) => {
    setMatrixData(prev => {
      const copy = prev.map(row => [...row]);
      copy[i][j] = value;
      return copy;
    });
  };

  const parseMatrix = (m: string[][]): number[][] =>
    m.map(row => row.map(val => parseFloat(val) || 0));

  const calculateDeterminant = (matrix: number[][]): { value: number | string; steps: string[] } => {
    const steps: string[] = [];

    const isSquare = matrix.length === matrix[0].length;
    if (!isSquare) return { value: "N/A", steps: ["Matrix is not square."] };

    const n = matrix.length;

    if (n === 2) {
      const [[a, b], [c, d]] = matrix;
      const formula = `det = (a × d) - (b × c) = (${a} × ${d}) - (${b} × ${c})`;
      const result = a * d - b * c;
      steps.push(formula);
      steps.push(`det = ${result}`);
      return { value: parseFloat(result.toFixed(4)), steps };
    }

    if (n === 3) {
      const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
      steps.push(`Using cofactor expansion along the first row:`);
      steps.push(`det = a(ei − fh) − b(di − fg) + c(dh − eg)`);
      steps.push(
        `= ${a}(${e}×${i} − ${f}×${h}) − ${b}(${d}×${i} − ${f}×${g}) + ${c}(${d}×${h} − ${e}×${g})`
      );
      const ei_fh = e * i - f * h;
      const di_fg = d * i - f * g;
      const dh_eg = d * h - e * g;
      const result = a * ei_fh - b * di_fg + c * dh_eg;
      steps.push(`= ${a * ei_fh} − ${b * di_fg} + ${c * dh_eg}`);
      steps.push(`= ${result}`);
      return { value: parseFloat(result.toFixed(4)), steps };
    }

    return {
      value: parseFloat(det(matrix).toFixed(4)),
      steps: ["Used general determinant algorithm (Laplace expansion or LU decomposition)."]
    };
  };

  const calculateRank = (matrix: number[][]): number => {
    const m = matrix.length;
    const n = matrix[0].length;
    const A = matrix.map(row => row.slice());

    let rank = 0;
    for (let r = 0, c = 0; r < m && c < n; ++c) {
      let i = r;
      while (i < m && A[i][c] === 0) i++;
      if (i === m) continue;
      [A[r], A[i]] = [A[i], A[r]];
      for (let j = r + 1; j < m; ++j) {
        const f = A[j][c] / A[r][c];
        for (let k = c; k < n; ++k) {
          A[j][k] -= f * A[r][k];
        }
      }
      rank++;
      r++;
    }
    return rank;
  };

  const handleCalculate = () => {
    const matrix = parseMatrix(matrixData);
    const detResult = calculateDeterminant(matrix);
    const rankResult = calculateRank(matrix);
    setResult({ Determinant: detResult.value, Rank: rankResult });
    setDetSteps(detResult.steps);
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Enter a matrix by selecting its number of rows and columns, then input the values. The tool will compute its rank and determinant (if it is a square matrix).
        </p>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rows</label>
            <input
              type="number"
              min={1}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-20 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Columns</label>
            <input
              type="number"
              min={1}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="w-20 p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Matrix</h3>
          <div
            className="grid gap-1 overflow-x-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))` }}
          >
            {matrixData.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`cell-${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                  className="p-2 border text-center border-gray-300 rounded"
                />
              ))
            )}
          </div>
        </div>

        <button onClick={handleCalculate} className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
          Calculate
        </button>

        <AnimatePresence>
          {result && (
            <motion.div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold">Results</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(result).map(([key, val]) => (
                  <div key={key} className="text-sm text-gray-700">
                    <span className="font-medium">{key}: </span>{val}
                    {key === "Determinant" && detSteps.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1 whitespace-pre-line">
                        {detSteps.join('\n')}
                      </div>
                    )}
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

export default page;