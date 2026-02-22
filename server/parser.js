import fs from "fs";
import Papa from "papaparse";

export function parseCSV(path) {
  const file = fs.readFileSync(path, "utf8");

  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      }
    });
  });
}
