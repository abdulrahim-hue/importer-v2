import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { parseCSV } from "./parser.js";
import { mergeData } from "./merger.js";
import { applyMapping } from "./mapper.js";
import { exportCSV } from "./exporter.js";
import { sallaFields, sallaSchema } from "./sallaSchema.js";

const port = Number(process.env.PORT || 4000);
const uploadsDir = "uploads";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function createCorsOptions() {
  const originsValue = process.env.FRONTEND_ORIGINS || "";
  const allowedOrigins = originsValue
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!allowedOrigins.length) {
    return { origin: true };
  }

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
  };
}

const app = express();
app.use(cors(createCorsOptions()));
app.use(express.json());

const upload = multer({ dest: `${uploadsDir}/` });

function cleanupUploads(files = []) {
  for (const file of files) {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
}

app.get("/schema", (_req, res) => {
  res.json({ fields: sallaFields, schema: sallaSchema });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post(
  "/transform",
  upload.fields([{ name: "baseFile" }, { name: "translationFile" }]),
  async (req, res) => {
    const uploadedFiles = [
      ...(req.files?.baseFile ?? []),
      ...(req.files?.translationFile ?? [])
    ];

    try {
      const basePath = req.files?.baseFile?.[0]?.path;
      const translationPath = req.files?.translationFile?.[0]?.path;
      const mapping = req.body?.mapping ? JSON.parse(req.body.mapping) : {};

      if (!basePath) {
        cleanupUploads(uploadedFiles);
        return res.status(400).json({ error: "baseFile is required." });
      }

      const baseData = await parseCSV(basePath);
      const translationData = translationPath ? await parseCSV(translationPath) : [];

      const merged = mergeData(baseData, translationData);
      const mapped = applyMapping(merged, mapping, translationData);
      const finalCSV = exportCSV(mapped);

      cleanupUploads(uploadedFiles);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=unified.csv");
      return res.send(finalCSV);
    } catch (error) {
      cleanupUploads(uploadedFiles);
      return res.status(500).json({
        error: "Failed to transform CSV files.",
        details: error.message
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
