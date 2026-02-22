import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { fetchSchema, transformCSV } from "./api";

const DEFAULT_MAPPING = {
  name: "Title",
  description: "Body (HTML)",
  sku: "Variant SKU",
  price: "Variant Price",
  quantity: "Variant Inventory Qty",
  categories: "Product Category",
  tags: "Tags",
  brand_name: "Vendor"
};

const PRODUCT_TRANSLATABLE_FIELDS = [
  { key: "name", label: "اسم المنتج" },
  { key: "description", label: "وصف المنتج" },
  { key: "subtitle", label: "العنوان الفرعي" },
  { key: "promotion_title", label: "عنوان العرض" },
  { key: "metadata_title", label: "عنوان الميتا" },
  { key: "metadata_description", label: "وصف الميتا" }
];

function normalizeLocaleCode(locale) {
  const raw = String(locale || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  return raw.split(/[-_]/)[0] || raw;
}

function Mapping({ files, mapping, setMapping }) {
  const [headers, setHeaders] = useState([]);
  const [schema, setSchema] = useState([]);
  const [sallaFields, setSallaFields] = useState([]);
  const [translationLocales, setTranslationLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaPayload = await fetchSchema();
        setSallaFields(schemaPayload.fields || []);
        setSchema(schemaPayload.schema || []);
      } catch {
        setError("تعذر تحميل حقول سلة من الخادم.");
      }
    };
    loadSchema();
  }, []);

  useEffect(() => {
    Papa.parse(files.baseFile, {
      header: true,
      preview: 1,
      skipEmptyLines: true,
      complete: (results) => {
        const detected = results.meta?.fields || [];
        setHeaders(detected);

        setMapping((prev) => {
          if (Object.keys(prev).length || !sallaFields.length) {
            return prev;
          }
          const seed = {};
          for (const sallaField of sallaFields) {
            seed[sallaField] = DEFAULT_MAPPING[sallaField] || "";
          }
          return seed;
        });
      }
    });
  }, [files.baseFile, sallaFields, setMapping]);

  useEffect(() => {
    if (!files.translationFile) {
      setTranslationLocales([]);
      return;
    }

    Papa.parse(files.translationFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const locales = new Set();
        for (const row of results.data || []) {
          const locale = normalizeLocaleCode(row.locale || row.Locale);
          if (locale) {
            locales.add(locale);
          }
        }
        setTranslationLocales(Array.from(locales).sort());
      }
    });
  }, [files.translationFile]);

  const translationSection = useMemo(() => {
    if (!translationLocales.length) {
      return null;
    }

    const fields = [];
    for (const locale of translationLocales) {
      for (const baseField of PRODUCT_TRANSLATABLE_FIELDS) {
        fields.push({
          key: `${baseField.key}_${locale}`,
          label: `${baseField.label} (${locale})`,
          auto: true
        });
      }
    }

    return {
      group: "ترجمات المنتجات",
      source: "ملف ترجمة Shopify",
      fields
    };
  }, [translationLocales]);

  const uiSchema = useMemo(() => {
    return translationSection ? [...schema, translationSection] : schema;
  }, [schema, translationSection]);

  const shopifyToSallaMapping = useMemo(() => {
    const out = {};
    for (const [sallaField, shopifyField] of Object.entries(mapping)) {
      if (shopifyField) {
        out[shopifyField] = sallaField;
      }
    }
    return out;
  }, [mapping]);

  const handleMappingChange = (sallaField, shopifyField) => {
    setMapping((prev) => ({ ...prev, [sallaField]: shopifyField }));
  };

  const handleTransform = async () => {
    setLoading(true);
    setError("");
    try {
      const csvBlob = await transformCSV({
        baseFile: files.baseFile,
        translationFile: files.translationFile,
        mapping: shopifyToSallaMapping
      });

      const url = window.URL.createObjectURL(new Blob([csvBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "unified.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("فشلت عملية التحويل. تأكد من الملفات ومطابقة الأعمدة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>مطابقة الحقول</h2>
      <p>اختر لكل حقل في سلة العمود المناسب له من ملف Shopify الأساسي.</p>

      {error && <p className="error">{error}</p>}

      <div className="mapping-grid">
        {uiSchema.map((section) => (
          <section key={section.group} className="mapping-section">
            <h3>
              {section.group} <small>({section.source})</small>
            </h3>
            {section.fields.map((field) => (
              <label key={field.key} className="mapping-row">
                <span>
                  {field.key}
                  <small>{field.label}</small>
                </span>
                {field.auto ? (
                  <div className="auto-field">مطابق تلقائيًا من ملف الترجمة</div>
                ) : (
                  <select
                    value={mapping[field.key] || ""}
                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                  >
                    <option value="">تجاهل هذا الحقل</option>
                    {headers.map((header) => (
                      <option key={`${field.key}-${header}`} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            ))}
          </section>
        ))}
      </div>

      <button onClick={handleTransform} disabled={loading}>
        {loading ? "جاري إنشاء الملف..." : "توليد الملف الموحد"}
      </button>
    </div>
  );
}

export default Mapping;
