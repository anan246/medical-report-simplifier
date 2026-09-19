/**
 * MediLens — Mock Report Data (Module 4 dev stub)
 *
 * TODO (Module 2): Replace this file with real MongoDB queries.
 *   - Connect to MongoDB using the MONGODB_URI env var
 *   - Query the `reports` collection filtered by authenticated userId
 *   - Return documents shaped as the Report interface in types/report.js
 */

/** @type {import("@/types/report").Report[]} */
export const MOCK_REPORTS = [
  {
    reportId: "rep_001",
    userId: "user_demo",
    reportName: "Complete Blood Count — Jan 2025",
    reportType: "Blood Panel",
    reportDate: "2025-01-15",
    originalFile: {
      filename: "CBC_Jan2025.pdf",
      mimeType: "application/pdf",
      size: 142080,
    },
    tests: [
      { testId: "t1", testName: "Hemoglobin",      value: 14.2, unit: "g/dL",   referenceRange: "13.5–17.5", status: "normal"  },
      { testId: "t2", testName: "WBC Count",        value: 7800, unit: "cells/µL", referenceRange: "4500–11000", status: "normal" },
      { testId: "t3", testName: "Platelet Count",   value: 145000, unit: "cells/µL", referenceRange: "150000–400000", status: "low" },
      { testId: "t4", testName: "RBC Count",        value: 4.9,  unit: "M/µL",  referenceRange: "4.5–5.9",   status: "normal"  },
      { testId: "t5", testName: "Hematocrit",       value: 42.1, unit: "%",     referenceRange: "41–53",      status: "normal"  },
      { testId: "t6", testName: "MCV",              value: 86,   unit: "fL",    referenceRange: "80–100",     status: "normal"  },
      { testId: "t7", testName: "Blood Glucose",    value: 98,   unit: "mg/dL", referenceRange: "70–100",     status: "normal"  },
      { testId: "t8", testName: "Creatinine",       value: 0.9,  unit: "mg/dL", referenceRange: "0.7–1.3",   status: "normal"  },
    ],
    aiSummary:
      "Your blood panel looks generally healthy. Platelet count is slightly below the reference range — monitor for any unusual bruising. Hemoglobin and glucose levels are within normal limits.",
    createdAt: "2025-01-15T09:30:00Z",
    updatedAt: "2025-01-15T09:35:00Z",
  },
  {
    reportId: "rep_002",
    userId: "user_demo",
    reportName: "Complete Blood Count — Apr 2025",
    reportType: "Blood Panel",
    reportDate: "2025-04-20",
    originalFile: {
      filename: "CBC_Apr2025.pdf",
      mimeType: "application/pdf",
      size: 138240,
    },
    tests: [
      { testId: "t1", testName: "Hemoglobin",      value: 12.8, unit: "g/dL",     referenceRange: "13.5–17.5",   status: "low"    },
      { testId: "t2", testName: "WBC Count",        value: 9200, unit: "cells/µL", referenceRange: "4500–11000",  status: "normal" },
      { testId: "t3", testName: "Platelet Count",   value: 178000, unit: "cells/µL", referenceRange: "150000–400000", status: "normal" },
      { testId: "t4", testName: "RBC Count",        value: 4.4, unit: "M/µL",      referenceRange: "4.5–5.9",     status: "low"    },
      { testId: "t5", testName: "Hematocrit",       value: 38.5, unit: "%",        referenceRange: "41–53",       status: "low"    },
      { testId: "t6", testName: "MCV",              value: 88,   unit: "fL",       referenceRange: "80–100",      status: "normal" },
      { testId: "t7", testName: "Blood Glucose",    value: 112,  unit: "mg/dL",    referenceRange: "70–100",      status: "high"   },
      { testId: "t8", testName: "Creatinine",       value: 1.1,  unit: "mg/dL",    referenceRange: "0.7–1.3",    status: "normal" },
    ],
    aiSummary:
      "Hemoglobin and hematocrit are below normal, which may indicate mild anaemia. Blood glucose is slightly elevated. WBC count is within range. Follow up with your doctor regarding the haemoglobin findings.",
    createdAt: "2025-04-20T11:00:00Z",
    updatedAt: "2025-04-20T11:05:00Z",
  },
  {
    reportId: "rep_003",
    userId: "user_demo",
    reportName: "Lipid Panel — Mar 2025",
    reportType: "Lipid Panel",
    reportDate: "2025-03-10",
    originalFile: {
      filename: "Lipid_Mar2025.pdf",
      mimeType: "application/pdf",
      size: 95000,
    },
    tests: [
      { testId: "t1", testName: "Total Cholesterol", value: 195, unit: "mg/dL", referenceRange: "<200",    status: "normal"  },
      { testId: "t2", testName: "LDL Cholesterol",   value: 128, unit: "mg/dL", referenceRange: "<100",   status: "high"    },
      { testId: "t3", testName: "HDL Cholesterol",   value: 42,  unit: "mg/dL", referenceRange: ">40",    status: "normal"  },
      { testId: "t4", testName: "Triglycerides",     value: 165, unit: "mg/dL", referenceRange: "<150",   status: "high"    },
      { testId: "t5", testName: "Blood Glucose",     value: 103, unit: "mg/dL", referenceRange: "70–100", status: "high"    },
    ],
    aiSummary:
      "Total cholesterol is within acceptable range. LDL (bad cholesterol) is elevated — lifestyle changes such as diet and exercise are recommended. HDL (good cholesterol) is just above the acceptable minimum.",
    createdAt: "2025-03-10T08:45:00Z",
  },
  {
    reportId: "rep_004",
    userId: "user_demo",
    reportName: "Thyroid Function — Feb 2025",
    reportType: "Thyroid Panel",
    reportDate: "2025-02-05",
    originalFile: {
      filename: "Thyroid_Feb2025.pdf",
      mimeType: "application/pdf",
      size: 88000,
    },
    tests: [
      { testId: "t1", testName: "TSH",  value: 2.1,  unit: "mIU/L", referenceRange: "0.4–4.0",  status: "normal" },
      { testId: "t2", testName: "Free T4", value: 1.2, unit: "ng/dL", referenceRange: "0.8–1.8", status: "normal" },
      { testId: "t3", testName: "Free T3", value: 3.8, unit: "pg/mL", referenceRange: "2.3–4.2", status: "normal" },
    ],
    aiSummary:
      "All thyroid hormone levels are within the normal reference ranges. No signs of hyper- or hypothyroidism based on these results.",
    createdAt: "2025-02-05T10:20:00Z",
  },
];
