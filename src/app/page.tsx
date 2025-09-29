"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { diseases } from "@/data/diseases";
import Navbar from "../../context/Navbar";

import SimpleLanguageSwitcher from "../../context/SimpleLanguageSwitcher";
import { usePreTranslation } from "../../context/PreTranslatedContext";

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

type Patient = {
  id: string;
  name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: {
    line: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
};

export default function HomePage() {
  const router = useRouter();
  const { t } = usePreTranslation();

  const [patient, setPatient] = useState<Patient>({
    id: `patient-${Date.now()}`,
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: {
      line: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
  });

  const [query, setQuery] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredDiseases = query
    ? diseases
        .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
    : [];

  const handleSelectDisease = (disease: Disease) => {
    setSelectedDisease(disease);
    setQuery(disease.name);
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    if (!selectedDisease || !patient.name || !patient.dob || !patient.gender) {
      alert("Please fill all required patient details and select a disease.");
      return;
    }

    setLoading(true);

    try {
      const fhirCondition = {
        resourceType: "Condition",
        id: `condition-${Date.now()}`,
        meta: {
          profile: ["http://hl7.org/fhir/StructureDefinition/Condition"],
        },
        clinicalStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active",
              display: "Active",
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              code: "confirmed",
              display: "Confirmed",
            },
          ],
        },
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-category",
                code: "problem-list-item",
                display: "Problem List Item",
              },
            ],
          },
        ],
        severity: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "24484000",
              display: "Severe",
            },
          ],
        },
        code: {
          coding: [
            {
              system: "http://id.who.int/icd/release/11/mms",
              code: selectedDisease.icdBiomedicine,
              display: selectedDisease.name,
            },
            {
              system: "http://namaste.local/code-system",
              code: selectedDisease.namaste,
              display: `${selectedDisease.name} (NAMASTE)`,
            },
          ],
          text: selectedDisease.name,
        },
        subject: {
          reference: `Patient/${patient.id}`,
          display: patient.name,
        },
        onsetDateTime: new Date().toISOString(),
        recordedDate: new Date().toISOString(),
        recorder: {
          display: "AYUSH Healthcare System",
        },
        note: [
          {
            text: `Patient history: ${
              patient.medicalHistory || "Not specified"
            }. Allergies: ${
              patient.allergies || "None reported"
            }. Current medications: ${
              patient.currentMedications || "None reported"
            }.`,
          },
        ],
      };

      const fhirPatient = {
        resourceType: "Patient",
        id: patient.id,
        meta: {
          profile: ["http://hl7.org/fhir/StructureDefinition/Patient"],
        },
        identifier: [
          {
            use: "usual",
            system: "http://ayush.gov.in/patient-id",
            value: patient.id,
          },
        ],
        active: true,
        name: [
          {
            use: "official",
            text: patient.name,
            family: patient.name.split(" ").pop(),
            given: patient.name.split(" ").slice(0, -1),
          },
        ],
        telecom: [
          ...(patient.phone
            ? [
                {
                  system: "phone",
                  value: patient.phone,
                  use: "mobile",
                },
              ]
            : []),
          ...(patient.email
            ? [
                {
                  system: "email",
                  value: patient.email,
                  use: "home",
                },
              ]
            : []),
        ],
        gender: patient.gender as "male" | "female" | "other" | "unknown",
        birthDate: patient.dob,
        address: patient.address.line
          ? [
              {
                use: "home",
                type: "physical",
                line: [patient.address.line],
                city: patient.address.city,
                state: patient.address.state,
                postalCode: patient.address.postalCode,
                country: patient.address.country,
              },
            ]
          : [],
        contact: patient.emergencyContact.name
          ? [
              {
                relationship: [
                  {
                    coding: [
                      {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                        code: "EP",
                        display: "Emergency contact person",
                      },
                    ],
                  },
                ],
                name: {
                  text: patient.emergencyContact.name,
                },
                telecom: [
                  {
                    system: "phone",
                    value: patient.emergencyContact.phone,
                  },
                ],
              },
            ]
          : [],
      };

      const bundle = {
        resourceType: "Bundle",
        id: `bundle-${Date.now()}`,
        type: "collection",
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: fhirPatient,
          },
          {
            resource: fhirCondition,
          },
        ],
      };

      router.push(`/fhir?data=${encodeURIComponent(JSON.stringify(bundle))}`);
    } catch (error) {
      console.error("Error creating FHIR bundle:", error);
      alert("Error creating FHIR data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t("NavaSetu")}
          </h1>
          <p className="text-gray-600 text-lg">
            {t("Bridging Traditional Medicine with Modern Standards")}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {t("Patient Information")}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                {t("Basic Details")}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Full Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t("Enter patient's full name")}
                  value={patient.name}
                  onChange={(e) =>
                    setPatient({ ...patient, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Date of Birth")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={patient.dob}
                  onChange={(e) =>
                    setPatient({ ...patient, dob: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Gender")} <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={patient.gender}
                  onChange={(e) =>
                    setPatient({ ...patient, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Phone Number")}
                </label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t("Enter phone number")}
                  value={patient.phone}
                  onChange={(e) =>
                    setPatient({ ...patient, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Email Address")}
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t("Enter email address")}
                  value={patient.email}
                  onChange={(e) =>
                    setPatient({ ...patient, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                Additional Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("")}Address
                </label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t("Street address")}
                  value={patient.address.line}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      address: { ...patient.address, line: e.target.value },
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={t("City")}
                    value={patient.address.city}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        address: { ...patient.address, city: e.target.value },
                      })
                    }
                  />
                  <input
                    className="border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={t("State")}
                    value={patient.address.state}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        address: { ...patient.address, state: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Emergency Contact")}
                </label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t("Emergency contact name")}
                  value={patient.emergencyContact.name}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      emergencyContact: {
                        ...patient.emergencyContact,
                        name: e.target.value,
                      },
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Relationship"
                    value={patient.emergencyContact.relationship}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        emergencyContact: {
                          ...patient.emergencyContact,
                          relationship: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    className="border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={t("Phone")}
                    value={patient.emergencyContact.phone}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        emergencyContact: {
                          ...patient.emergencyContact,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Medical History")}
                </label>
                <textarea
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Brief medical history..."
                  rows={3}
                  value={patient.medicalHistory}
                  onChange={(e) =>
                    setPatient({ ...patient, medicalHistory: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Known Allergies")}
                </label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="List any known allergies"
                  value={patient.allergies}
                  onChange={(e) =>
                    setPatient({ ...patient, allergies: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Current Medications")}
                </label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t("Current medications")}
                  value={patient.currentMedications}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      currentMedications: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4 flex items-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              AYUSH Disease Information
            </h3>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Disease <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={t("Type to search AYUSH diseases...")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedDisease(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {filteredDiseases.length > 0 &&
                showDropdown &&
                !selectedDisease && (
                  <ul className="absolute z-10 w-full border border-gray-300 rounded-lg bg-white shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredDiseases.map((d) => (
                      <li
                        key={d.icdBiomedicine}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                        onClick={() => handleSelectDisease(d)}
                      >
                        <div className="font-medium text-gray-800">
                          {d.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          NAMASTE: {d.namaste} | ICD-11-Biomedicine:{" "}
                          {d.icdBiomedicine} | ICD-11-TM2: {d.icdTM2}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {selectedDisease && (
              <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h4 className="font-semibold text-green-800">
                    Selected Disease
                  </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Disease Name</p>
                    <p className="font-medium text-black">
                      {selectedDisease.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Namaste Code</p>
                    <p className="font-mono text-blue-600">
                      {selectedDisease.namaste}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      ICD-11-Biomedicine Code
                    </p>
                    <p className="font-mono text-blue-600">
                      {selectedDisease.icdBiomedicine}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ICD-11-TM2 Code</p>
                    <p className="font-mono text-green-600">
                      {selectedDisease.icdTM2}
                    </p>
                  </div>

                  {/* NEW SNOMED */}
                  <div>
                    <p className="text-sm text-gray-600">SNOMED Code</p>
                    <p className="font-mono text-purple-600">
                      {selectedDisease.snomed}
                    </p>
                  </div>

                  {/* NEW LOINC */}
                  <div>
                    <p className="text-sm text-gray-600">LOINC Code</p>
                    <p className="font-mono text-pink-600">
                      {selectedDisease.loinc}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-800">
                      {selectedDisease.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleSubmit}
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
                  Generating FHIR...
                </span>
              ) : (
                <span className="flex items-center">
                  Generate FHIR Bundle
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
