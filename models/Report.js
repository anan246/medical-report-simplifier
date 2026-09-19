import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    testId: { type: String, required: true },
    testName: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, default: "" },
    referenceRange: { type: String, required: true },
    status: { type: String, required: true },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },

    reportName: { type: String, required: true },
    reportType: { type: String, default: "blood_test" },
    reportDate: { type: Date, default: Date.now },

    fileUrl: { type: String, required: true },

    tests: [testSchema],

    aiSummary: { type: String, default: "" },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.models.Report ||
  mongoose.model("Report", reportSchema);
