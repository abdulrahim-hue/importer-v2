function getFirstValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return String(row[key]).trim();
    }
  }
  return "";
}

function normalizeHandle(handle) {
  return String(handle || "").trim().toLowerCase();
}

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

function normalizeIdentifier(identifier) {
  return String(identifier || "")
    .trim()
    .replace(/^'+|'+$/g, "");
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function mergeData(baseRows, translationRows) {
  const grouped = {};
  const handleByProductId = {};
  const handleByTitle = {};
  const fallbackHandleByIdentifier = {};

  for (const row of baseRows) {
    const handle = normalizeHandle(getFirstValue(row, ["Handle", "handle"]));
    if (!handle) {
      continue;
    }

    if (!grouped[handle]) {
      grouped[handle] = {
        base: row,
        translations: {}
      };
    }

    const productId = normalizeIdentifier(
      getFirstValue(row, ["ID", "id", "Product ID", "product_id", "productid"])
    );
    if (productId) {
      handleByProductId[productId] = handle;
    }

    const title = getFirstValue(row, ["Title", "title", "name", "Name"]);
    const normalizedTitle = normalizeText(title);
    if (normalizedTitle && !handleByTitle[normalizedTitle]) {
      handleByTitle[normalizedTitle] = handle;
    }
  }

  // Pre-pass: Shopify translation exports often include handle rows keyed by Identification.
  // Resolve Identification -> Handle first so title/body rows can be attached reliably.
  for (const row of translationRows) {
    const type = getFirstValue(row, ["Type", "type", "resource_type"]).toUpperCase();
    if (type && type !== "PRODUCT") {
      continue;
    }

    const identification = normalizeIdentifier(
      getFirstValue(row, [
        "Identification",
        "identification",
        "resource_id",
        "resource_identifier",
        "id"
      ])
    );
    if (!identification) {
      continue;
    }

    const fieldName = normalizeTranslationKey(
      getFirstValue(row, [
        "key",
        "Key",
        "field",
        "Field",
        "path",
        "resource_key",
        "translatable_key"
      ])
    );
    if (fieldName !== "handle") {
      continue;
    }

    const defaultContent = getFirstValue(row, [
      "Default content",
      "default_content",
      "default"
    ]);
    const candidateHandle = normalizeHandle(defaultContent);
    if (candidateHandle && grouped[candidateHandle]) {
      fallbackHandleByIdentifier[identification] = candidateHandle;
    }
  }

  for (const row of translationRows) {
    const type = getFirstValue(row, ["Type", "type", "resource_type"]).toUpperCase();
    if (type && type !== "PRODUCT") {
      continue;
    }

    const identification = normalizeIdentifier(
      getFirstValue(row, [
        "Identification",
        "identification",
        "resource_id",
        "resource_identifier",
        "id"
      ])
    );

    let handle = normalizeHandle(
      getFirstValue(row, ["resource_handle", "handle", "Handle"])
    );
    if (!handle && identification) {
      handle =
        handleByProductId[identification] ||
        fallbackHandleByIdentifier[identification] ||
        "";
    }

    const locale = normalizeLocale(getFirstValue(row, ["locale", "Locale"]));
    const key = normalizeTranslationKey(
      getFirstValue(row, [
        "key",
        "Key",
        "field",
        "Field",
        "path",
        "resource_key",
        "translatable_key"
      ])
    );
    const value = getFirstValue(row, [
      "value",
      "Value",
      "Translated content",
      "translated_content"
    ]);
    const defaultContent = getFirstValue(row, [
      "Default content",
      "default_content",
      "default"
    ]);

    // Shopify translation exports often provide product linkage via Identification ID.
    // When base CSV lacks that ID, fallback by matching title's default content.
    if (!handle && key === "name") {
      const titleMatchedHandle = handleByTitle[normalizeText(defaultContent)];
      if (titleMatchedHandle) {
        handle = titleMatchedHandle;
        if (identification) {
          fallbackHandleByIdentifier[identification] = titleMatchedHandle;
        }
      }
    }

    if (key === "handle") {
      continue;
    }

    if (!handle || !locale || !key || !grouped[handle]) {
      continue;
    }

    if (!grouped[handle].translations[locale]) {
      grouped[handle].translations[locale] = {};
    }

    grouped[handle].translations[locale][key] = value;
  }

  return Object.values(grouped);
}
