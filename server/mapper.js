import { sallaFields } from "./sallaSchema.js";

function normalizeLocale(locale) {
  const raw = String(locale || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  return raw.split(/[-_]/)[0] || raw;
}

function normalizeTranslationKey(key) {
  const raw = String(key || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }

  const lastSegment = raw.split(/[./]/).pop() || raw;
  const aliases = {
    title: "name",
    name: "name",
    "body (html)": "description",
    body_html: "description",
    description_html: "description",
    description: "description",
    subtitle: "subtitle",
    promotion_title: "promotion_title",
    seo_title: "metadata_title",
    meta_title: "metadata_title",
    metadata_title: "metadata_title",
    seo_description: "metadata_description",
    meta_description: "metadata_description",
    metadata_description: "metadata_description"
  };

  if (aliases[lastSegment]) {
    return aliases[lastSegment];
  }

  return lastSegment
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getExpectedTranslationColumns(translationRows) {
  const columns = new Set();

  for (const row of translationRows) {
    const type = String(row.Type || row.type || row.resource_type || "")
      .trim()
      .toUpperCase();
    if (type && type !== "PRODUCT") {
      continue;
    }

    const key = normalizeTranslationKey(
      row.key || row.Key || row.field || row.Field || row.path || row.resource_key
    );
    const locale = normalizeLocale(row.locale || row.Locale);
    if (!key || !locale || key === "handle") {
      continue;
    }
    columns.add(`${key}_${locale}`);
  }

  return Array.from(columns).sort();
}

export function applyMapping(products, mapping, translationRows = []) {
  const expectedTranslationColumns = getExpectedTranslationColumns(translationRows);

  return products.map((product) => {
    const unified = {};

    for (const field of sallaFields) {
      unified[field] = "";
    }

    for (const [shopifyField, sallaField] of Object.entries(mapping)) {
      if (!sallaField || !product.base) {
        continue;
      }
      unified[sallaField] = product.base[shopifyField] ?? "";
    }

    for (const [locale, fields] of Object.entries(product.translations)) {
      for (const [key, value] of Object.entries(fields)) {
        unified[`${key}_${locale}`] = value;
      }
    }

    for (const column of expectedTranslationColumns) {
      if (unified[column] === undefined) {
        unified[column] = "";
      }
    }

    return unified;
  });
}
