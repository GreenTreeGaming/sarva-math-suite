"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart2, CheckCircle } from 'lucide-react';
import { eigs, matrix } from 'mathjs';
import { type Complex } from "mathjs";
import { create, all } from 'mathjs';
const math = create(all);
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
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back to Home
    </Link>
    <h2 className="text-4xl font-extrabold mb-6 flex items-center">
      <BarChart2 className="w-6 h-6 mr-2 text-purple-600" />
      Eigenvalues & Eigenvectors
    </h2>
  </motion.div>
);

const page = () => {
  const [size, setSize] = useState(2);
  const [matrixData, setMatrixData] = useState<string[][]>(
    Array(2).fill(null).map(() => Array(2).fill(""))
  );
  const [result, setResult] = useState<{ eigenvalues: string[]; eigenvectors: string[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMatrixData(Array(size).fill(null).map(() => Array(size).fill("")));
  }, [size]);

  const handleMatrixChange = (i: number, j: number, value: string) => {
    setMatrixData(prev => {
      const copy = prev.map(row => [...row]);
      copy[i][j] = value;
      return copy;
    });
  };

  const parseMatrix = (m: string[][]): number[][] =>
    m.map(row => row.map(val => parseFloat(val) || 0));

  const formatComplex = (val: number | Complex): string => {
    if (typeof val === "object" && "re" in val && "im" in val) {
      const re = val.re.toFixed(4);
      const im = val.im.toFixed(4);
      const sign = val.im >= 0 ? "+" : "-";
      return `${re} ${sign} ${Math.abs(Number(im)).toFixed(4)}i`;
    }
    return Number(val).toFixed(4);
  };

  const handleCalculate = () => {
    const A = parseMatrix(matrixData);
    if (A.length !== A[0].length) {
      setError("Matrix must be square.");
      return;
    }

    // 1) Pull out both real & imaginary parts
    const { lambda, E } = numeric.eig(A);
    const reals = lambda.x;
    const imags = lambda.y || Array(reals.length).fill(0);

    // 2) Format eigenvalues with ±i
    const eigenvalues = reals.map((r, i) => {
      const im = imags[i];
      if (Math.abs(im) < 1e-8) return r.toFixed(4);
      const sign = im >= 0 ? "+" : "-";
      return `${r.toFixed(4)} ${sign} ${Math.abs(im).toFixed(4)}i`;
    });

    // 3) Build eigenvector columns, weaving real & imag parts
    //    E.x and E.y are both NxN row-major matrices
    const realMat = (E?.x as number[][]) || [];
    const imagMat = (E?.y as number[][]) || Array(realMat.length).fill(null).map(() =>
      Array(realMat[0]?.length || 0).fill(0)
    );
    const transpose = (m: number[][]) =>
      m.length > 0 ? m[0].map((_, i) => m.map(row => row[i])) : [];
    const realMatT = transpose(realMat);
    const imagMatT = transpose(imagMat);

    const eigenvectors = realMatT.map((_, i) =>
      realMatT[i].map((_, j) => {
        const re = realMatT[i][j];
        const im = imagMatT[i][j];
        if (Math.abs(im) < 1e-8) return re.toFixed(4);
        const sign = im >= 0 ? "+" : "-";
        return `${re.toFixed(4)} ${sign} ${Math.abs(im).toFixed(4)}i`;
      })
    );

    setResult({ eigenvalues, eigenvectors });
    setError(null);
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Enter a square matrix to compute its eigenvalues and eigenvectors.
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
          <h3 className="text-lg font-semibold mb-2">Matrix</h3>
          <div className="grid gap-1 overflow-x-auto\" style={{ gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))` }}>
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

        <button
          onClick={handleCalculate}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Compute
        </button>

        <AnimatePresence>
          {(result || error) && (
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
                    <h3 className="font-semibold">Results</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Eigenvalues:</span>
                      <div className="ml-2 mt-1 text-gray-800">
                        [{result.eigenvalues.join(', ')}]
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Eigenvectors:</span>
                      <div className="ml-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, auto)` }}>
                        {result.eigenvectors.map((vec, i) => (
                          <div key={i} className="flex gap-2">
                            ({vec.join(', ')})
                          </div>
                        ))}
                      </div>
                    </div>
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

export default page;