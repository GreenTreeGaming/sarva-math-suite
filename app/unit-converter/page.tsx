"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";

type UnitDefinition = {
  factor?: number;
  symbol?: string;
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
};

const units = {
  Length: {
    Meters: { factor: 1, symbol: "m" },
    Kilometers: { factor: 1000, symbol: "km" },
    Centimeters: { factor: 0.01, symbol: "cm" },
    Millimeters: { factor: 0.001, symbol: "mm" },
    Inches: { factor: 0.0254, symbol: "in" },
    Feet: { factor: 0.3048, symbol: "ft" },
    Yards: { factor: 0.9144, symbol: "yd" },
    Miles: { factor: 1609.34, symbol: "mi" },
  },
  Mass: {
    Grams: { factor: 1, symbol: "g" },
    Kilograms: { factor: 1000, symbol: "kg" },
    Milligrams: { factor: 0.001, symbol: "mg" },
    Pounds: { factor: 453.592, symbol: "lb" },
    Ounces: { factor: 28.3495, symbol: "oz" },
  },
  Temperature: {
    Celsius: { toBase: (v: number) => v, fromBase: (v: number) => v },
    Fahrenheit: {
      toBase: (v: number) => (v - 32) * (5 / 9),
      fromBase: (v: number) => v * (9 / 5) + 32,
    },
    Kelvin: {
      toBase: (v: number) => v - 273.15,
      fromBase: (v: number) => v + 273.15,
    },
  },
  Angle: {
    Degrees: { factor: 1, symbol: "°" },
    Radians: { factor: Math.PI / 180, symbol: "rad" },
    Gradians: { factor: 0.9, symbol: "gon" },
  },
};

type UnitsMap = typeof units;
type CategoryKey = keyof UnitsMap;
type UnitKey<C extends CategoryKey> = keyof UnitsMap[C];
const categories = Object.keys(units) as CategoryKey[];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<CategoryKey>("Length");
  const [fromUnit, setFromUnit] = useState<UnitKey<CategoryKey>>("Meters");
  const [toUnit, setToUnit] = useState<UnitKey<CategoryKey>>("Feet");
  const [inputValue, setInputValue] = useState<number | string>("");
  const [result, setResult] = useState<number | null>(null);
  const [formula, setFormula] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue.toString());
    if (isNaN(value)) return;
    let baseValue: number;
    let finalValue: number;
    const catUnits = units[category];
    if (category === "Temperature") {
      baseValue = catUnits[fromUnit].toBase!(value);
      finalValue = catUnits[toUnit].fromBase!(baseValue);
      setFormula(`Convert ${fromUnit} → °C → ${toUnit}`);
    } else {
      baseValue = value * catUnits[fromUnit].factor!;
      finalValue = baseValue / catUnits[toUnit].factor!;
      const mult = (catUnits[fromUnit].factor! / catUnits[toUnit].factor!).toFixed(4);
      setFormula(`Multiply by ${mult}`);
    }
    setResult(finalValue);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800">
      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <Link href="/" className="text-sm text-gray-600 hover:text-purple-500 mt-2 flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h2 className="text-4xl font-extrabold mt-4">🔁 Unit Converter</h2>
      </motion.div>

      <motion.div
        className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 space-y-6 border border-gray-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Category:</label>
          <select
            value={category}
            onChange={(e) => {
              const cat = e.target.value as CategoryKey;
              setCategory(cat);
              const defs = Object.keys(units[cat]) as UnitKey<CategoryKey>[];
              setFromUnit(defs[0]);
              setToUnit(defs[1] || defs[0]);
            }}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {['From', 'To'].map((label, idx) => (
            <motion.div key={label} whileHover={{ scale: 1.02 }} className="">
              <label className="block text-sm font-medium mb-1">{label} Unit:</label>
              <select
                value={idx === 0 ? fromUnit : toUnit}
                onChange={(e) => idx === 0 ? setFromUnit(e.target.value) : setToUnit(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200"
              >
                {(Object.keys(units[category]) as string[]).map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium mb-1">Value:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200"
            placeholder="Enter a number"
          />
        </motion.div>

        <motion.button
          onClick={handleConvert}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400 text-white font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <RefreshCw size={18} />
          <span>Convert</span>
        </motion.button>

        {result !== null && (
          <motion.div
            className="bg-gray-100 p-4 rounded-xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg font-semibold text-green-600">
              {result.toFixed(6)} {units[category][toUnit].symbol}
            </p>
            {formula && <p className="text-sm text-gray-500 mt-1 italic">{formula}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
