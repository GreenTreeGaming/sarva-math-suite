"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { matrix, det, transpose, inv } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";

const Header = () => (
  <motion.div
    className="max-w-4xl mx-auto flex flex-col items-center"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
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
    <h2 className="text-4xl font-extrabold mb-6">🧯 Matrix Operations</h2>
  </motion.div>
);

export default function MatrixOpsPage() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [operation, setOperation] = useState("add");
  const [matrixA, setMatrixA] = useState<string[][]>(
    Array(2).fill(null).map(() => Array(2).fill(""))
  );
  const [matrixB, setMatrixB] = useState<string[][]>(
    Array(2).fill(null).map(() => Array(2).fill(""))
  );
  const [result, setResult] = useState<number[][] | string | null>(null);

  // Reset matrices when dimensions change
  useEffect(() => {
    setMatrixA(Array(rowsA).fill(null).map(() => Array(colsA).fill("")));
  }, [rowsA, colsA]);

  useEffect(() => {
    setMatrixB(Array(rowsB).fill(null).map(() => Array(colsB).fill("")));
  }, [rowsB, colsB]);

  const handleMatrixChange = (
    setter: React.Dispatch<React.SetStateAction<string[][]>>,
    i: number,
    j: number,
    value: string
  ) => {
    setter(prev => {
      const copy = prev.map(row => [...row]);
      copy[i][j] = value;
      return copy;
    });
  };

  const parseMatrix = (m: string[][]) =>
    m.map(row => row.map(val => parseFloat(val) || 0));

  const addMatrices = (a: number[][], b: number[][]) =>
    a.map((row, i) => row.map((v, j) => v + b[i][j]));

  const subtractMatrices = (a: number[][], b: number[][]) =>
    a.map((row, i) => row.map((v, j) => v - b[i][j]));

  const multiplyMatrices = (a: number[][], b: number[][]) => {
    if (a[0].length !== b.length)
      return "Incompatible dimensions for multiplication.";
    const res = Array(a.length)
      .fill(null)
      .map(() => Array(b[0].length).fill(0));
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < b[0].length; j++)
        for (let k = 0; k < b.length; k++)
          res[i][j] += a[i][k] * b[k][j];
    return res;
  };

  const inverseMatrix = (m: number[][]) => {
    try {
      return inv(matrix(m)).toArray(); // ✅ convert to plain array
    } catch {
      return "Matrix is singular (non-invertible).";
    }
  };

  const determinantMatrix = (m: number[][]) => {
    try {
      return `Determinant: ${det(matrix(m)).toFixed(4)}`;
    } catch {
      return "Unable to compute determinant.";
    }
  };

  const transposeMatrix = (m: number[][]) => {
    try {
      return transpose(matrix(m)).toArray(); // ✅ convert to plain array
    } catch {
      return "Unable to compute transpose.";
    }
  };

  const handleCompute = () => {
    const A = parseMatrix(matrixA);
    const B = parseMatrix(matrixB);
    let res: number[][] | string = [];

    switch (operation) {
      case "add":
        res = addMatrices(A, B);
        break;
      case "subtract":
        res = subtractMatrices(A, B);
        break;
      case "multiply":
        if (colsA !== rowsB) {
          setResult("Incompatible matrix dimensions for multiplication.");
          return;
        }
        res = multiplyMatrices(A, B);
        break;
      case "inverse":
        res = inverseMatrix(A);
        break;
      case "determinant":
        res = determinantMatrix(A);
        break;
      case "transpose":
        res = transposeMatrix(A);
        break;
    }
    setResult(res);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow space-y-6 border border-gray-100"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-medium block mb-1">Matrix A Size</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={rowsA}
                onChange={e => setRowsA(Number(e.target.value))}
                className="w-20 p-2 border rounded-md"
              />
              <input
                type="number"
                min={1}
                value={colsA}
                onChange={e => setColsA(Number(e.target.value))}
                className="w-20 p-2 border rounded-md"
              />
            </div>
          </div>
          {["add", "subtract", "multiply"].includes(operation) && (
            <div>
              <label className="font-medium block mb-1">Matrix B Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={rowsB}
                  onChange={e => setRowsB(Number(e.target.value))}
                  className="w-20 p-2 border rounded-md"
                />
                <input
                  type="number"
                  min={1}
                  value={colsB}
                  onChange={e => setColsB(Number(e.target.value))}
                  className="w-20 p-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Operation:</label>
          <select
            value={operation}
            onChange={e => setOperation(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="add">Addition</option>
            <option value="subtract">Subtraction</option>
            <option value="multiply">Multiplication</option>
            <option value="inverse">Inverse (A only)</option>
            <option value="determinant">Determinant (A only)</option>
            <option value="transpose">Transpose (A only)</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Matrix A</h3>
            <div
              className="grid gap-1 overflow-x-auto"
              style={{ gridTemplateColumns: `repeat(${colsA}, minmax(60px, 1fr))` }}
            >
              {matrixA.map((row, i) =>
                row.map((val, j) => (
                  <input
                    key={`a-${i}-${j}`}
                    type="number"
                    value={val}
                    onChange={e =>
                      handleMatrixChange(setMatrixA, i, j, e.target.value)
                    }
                    className="p-2 border text-center border-gray-300 rounded"
                  />
                ))
              )}
            </div>
          </div>

          {["add", "subtract", "multiply"].includes(operation) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix B</h3>
              <div
                className="grid gap-1 overflow-x-auto"
                style={{ gridTemplateColumns: `repeat(${colsB}, minmax(60px, 1fr))` }}
              >
                {matrixB.map((row, i) =>
                  row.map((val, j) => (
                    <input
                      key={`b-${i}-${j}`}
                      type="number"
                      value={val}
                      onChange={e =>
                        handleMatrixChange(setMatrixB, i, j, e.target.value)
                      }
                      className="p-2 border text-center border-gray-300 rounded"
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <motion.button
          onClick={handleCompute}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-orange-400 text-white py-2 rounded-lg font-semibold shadow hover:opacity-90"
        >
          <Zap className="w-5 h-5" />
          <span>Compute</span>
        </motion.button>

        <AnimatePresence>
          {result !== null && (
            <motion.div
            className="bg-gray-50 p-4 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-2">
              {typeof result === "string" && result.toLowerCase().includes("matrix") ? (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              )}
              <h3 className="font-semibold">
                {typeof result === "string" && result.toLowerCase().includes("matrix")
                  ? "Error"
                  : "Result"}
              </h3>
            </div>

            {typeof result === "string" ? (
              <p
                className={`text-sm ${
                  result.toLowerCase().includes("matrix") ? "text-red-500" : "text-gray-800"
                }`}
              >
                {result}
              </p>
            ) : Array.isArray(result) && result.length > 0 && Array.isArray(result[0]) ? (
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${(result as number[][])[0].length}, 1fr)`
                }}
              >
                {(result as number[][]).map((row, i) =>
                  row.map((val, j) => (
                    <div
                      key={`res-${i}-${j}`}
                      className="p-2 text-center border border-gray-300 rounded"
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No output to display.</p>
            )}
          </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
