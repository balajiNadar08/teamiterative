"use client";

import { useState } from "react";
import Link from "next/link";
import { diseases } from "@/data/diseases";
import Navbar from "../../../context/Navbar";

// Define the Disease type based on your data structure
type Disease = {
  namaste: string;
  name: string;
  description: string;
  icdBiomedicine: string;
  icdTM2: string;
  snomed: string;
  loinc: string;
};

type CodingSystemKey = keyof Omit<Disease, "name" | "description">;

type TranslationResult = {
  disease: string;
  description: string;
  fromCode: string;
  toCode: string;
  allCodes: {
    namaste: string;
    icdBiomedicine: string;
    icdTM2: string;
    snomed: string;
    loinc: string;
  };
};

type CodingSystem = {
  value: CodingSystemKey;
  label: string;
  description: string;
};

export default function TranslatePage() {
  const [fromSystem, setFromSystem] = useState<CodingSystemKey | "">("");
  const [toSystem, setToSystem] = useState<CodingSystemKey | "">("");
  const [inputCode, setInputCode] = useState("");
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const codingSystems: CodingSystem[] = [
    { value: "namaste", label: "NAMASTE", description: "AYUSH System Codes" },
    {
      value: "icdBiomedicine",
      label: "ICD-11 Biomedicine",
      description: "International Classification of Diseases",
    },
    {
      value: "icdTM2",
      label: "ICD-11 TM2",
      description: "Traditional Medicine Classification",
    },
    {
      value: "snomed",
      label: "SNOMED CT",
      description: "Systematized Nomenclature of Medicine",
    },
    {
      value: "loinc",
      label: "LOINC",
      description: "Logical Observation Identifiers Names and Codes",
    },
  ];

  const handleTranslate = () => {
    if (!fromSystem || !toSystem || !inputCode.trim()) {
      alert("Please select both coding systems and enter a code to translate.");
      return;
    }

    if (fromSystem === toSystem) {
      alert("Please select different coding systems for translation.");
      return;
    }

    setLoading(true);

    // Search for diseases that match the input code in the 'from' system
    const matchingDiseases = diseases.filter((disease) => {
      const codeValue = disease[fromSystem as CodingSystemKey];
      return (
        codeValue && codeValue.toLowerCase().includes(inputCode.toLowerCase())
      );
    });

    // Transform results to include the target system codes
    const translationResults: TranslationResult[] = matchingDiseases.map(
      (disease) => ({
        disease: disease.name,
        description: disease.description,
        fromCode: disease[fromSystem as CodingSystemKey],
        toCode: disease[toSystem as CodingSystemKey],
        allCodes: {
          namaste: disease.namaste,
          icdBiomedicine: disease.icdBiomedicine,
          icdTM2: disease.icdTM2,
          snomed: disease.snomed,
          loinc: disease.loinc,
        },
      })
    );

    setResults(translationResults);
    setLoading(false);
  };

  const handleReset = () => {
    setFromSystem("");
    setToSystem("");
    setInputCode("");
    setResults([]);
  };

  const getSystemLabel = (systemValue: string): string => {
    return (
      codingSystems.find((sys) => sys.value === systemValue)?.label ||
      systemValue
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="navbar px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium text-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Demo</Link>
              </li>
              <li>
                <Link href="/translate">Translate</Link>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            NavaSetu
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Demo</Link>
            </li>
            <li>
              <Link href="/translate">Translate</Link>
            </li>
            <li>
              <Link href="/documentation">Documentation</Link>
            </li>
            <li>
              <Link href="/analytics">Analytics</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Login</a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Medical Code Translator
          </h1>
          <p className="text-gray-600 text-lg">
            Convert between different medical coding systems
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Code Translation
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* From System */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From System <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={fromSystem}
                onChange={(e) =>
                  setFromSystem(e.target.value as CodingSystemKey | "")
                }
              >
                <option value="">Select source system</option>
                {codingSystems.map((system) => (
                  <option key={system.value} value={system.value}>
                    {system.label}
                  </option>
                ))}
              </select>
              {fromSystem && (
                <p className="text-xs text-gray-500 mt-1">
                  {
                    codingSystems.find((sys) => sys.value === fromSystem)
                      ?.description
                  }
                </p>
              )}
            </div>

            {/* To System */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To System <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={toSystem}
                onChange={(e) =>
                  setToSystem(e.target.value as CodingSystemKey | "")
                }
              >
                <option value="">Select target system</option>
                {codingSystems
                  .filter((system) => system.value !== fromSystem)
                  .map((system) => (
                    <option key={system.value} value={system.value}>
                      {system.label}
                    </option>
                  ))}
              </select>
              {toSystem && (
                <p className="text-xs text-gray-500 mt-1">
                  {
                    codingSystems.find((sys) => sys.value === toSystem)
                      ?.description
                  }
                </p>
              )}
            </div>

            {/* Input Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code to Translate <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter code..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleTranslate}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Translating...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  Translate Code
                </span>
              )}
            </button>

            <button
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Translation Results ({results.length} found)
              </h3>

              <div className="space-y-6">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {result.disease}
                      </h4>
                      <span className="text-sm text-gray-500">
                        Match #{index + 1}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{result.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">
                          {getSystemLabel(fromSystem)}
                        </h5>
                        <p className="font-mono text-lg text-blue-600">
                          {result.fromCode}
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-2">
                          {getSystemLabel(toSystem)}
                        </h5>
                        <p className="font-mono text-lg text-green-600">
                          {result.toCode || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* All Codes Section */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                        View all codes for this condition
                      </summary>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {Object.entries(result.allCodes).map(
                          ([system, code]) => (
                            <div
                              key={system}
                              className="bg-white p-3 rounded border"
                            >
                              <div className="text-xs text-gray-500 mb-1">
                                {getSystemLabel(system)}
                              </div>
                              <div className="font-mono text-sm text-gray-700">
                                {code || "N/A"}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!loading &&
            results.length === 0 &&
            inputCode &&
            fromSystem &&
            toSystem && (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No translations found
                </h3>
                <p className="text-gray-500">
                  No diseases found with the code "{inputCode}" in the{" "}
                  {getSystemLabel(fromSystem)} system.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
