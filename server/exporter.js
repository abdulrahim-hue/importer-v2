import { Parser } from "json2csv";
import { sallaFields } from "./sallaSchema.js";

export function exportCSV(data) {
  const dynamicFields = new Set();

  for (const row of data) {
    for (const key of Object.keys(row)) {
      if (!sallaFields.includes(key)) {
        dynamicFields.add(key);
      }
    }
  }

  const fields = [...sallaFields, ...Array.from(dynamicFields).sort()];
  const parser = new Parser({ fields });
  return parser.parse(data);
}
