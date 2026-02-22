import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

export async function fetchSchema() {
  const { data } = await api.get("/schema");
  return data;
}

export async function transformCSV({ baseFile, translationFile, mapping }) {
  const formData = new FormData();
  formData.append("baseFile", baseFile);
  if (translationFile) {
    formData.append("translationFile", translationFile);
  }
  formData.append("mapping", JSON.stringify(mapping));

  const response = await api.post("/transform", formData, {
    responseType: "blob"
  });
  return response.data;
}
