export const sallaSchema = [
  {
    group: "المنتجات",
    source: "إنشاء منتج",
    fields: [
      { key: "name", label: "اسم المنتج" },
      { key: "description", label: "وصف المنتج" },
      { key: "price", label: "السعر" },
      { key: "sale_price", label: "سعر التخفيض" },
      { key: "cost_price", label: "سعر التكلفة" },
      { key: "status", label: "الحالة" },
      { key: "product_type", label: "نوع المنتج" },
      { key: "quantity", label: "الكمية" },
      { key: "sku", label: "رمز SKU" },
      { key: "mpn", label: "MPN" },
      { key: "gtin", label: "GTIN" },
      { key: "weight", label: "الوزن" },
      { key: "weight_type", label: "نوع الوزن" },
      { key: "require_shipping", label: "يتطلب شحن" },
      {
        key: "maximum_quantity_per_order",
        label: "الحد الأقصى للكمية لكل طلب"
      },
      { key: "subtitle", label: "العنوان الفرعي" },
      { key: "promotion_title", label: "عنوان العرض" },
      { key: "metadata_title", label: "عنوان الميتا" },
      { key: "metadata_description", label: "وصف الميتا" },
      { key: "categories", label: "التصنيفات (معرفات أو قيم مطابقة)" },
      { key: "tags", label: "الوسوم (معرفات أو قيم مطابقة)" },
      { key: "brand_id", label: "معرّف العلامة التجارية" },
      { key: "images", label: "الصور" }
    ]
  },
  {
    group: "التصنيفات",
    source: "إنشاء تصنيف",
    fields: [
      { key: "category_name", label: "اسم التصنيف" },
      { key: "category_status", label: "حالة التصنيف" },
      { key: "category_image", label: "صورة التصنيف" },
      { key: "category_metadata_title", label: "عنوان ميتا التصنيف" },
      {
        key: "category_metadata_description",
        label: "وصف ميتا التصنيف"
      },
      { key: "category_metadata_url", label: "رابط ميتا التصنيف" }
    ]
  },
  {
    group: "الوسوم",
    source: "إنشاء وسم منتج",
    fields: [{ key: "tag_name", label: "اسم الوسم" }]
  },
  {
    group: "العلامات التجارية",
    source: "إنشاء علامة تجارية",
    fields: [
      { key: "brand_name", label: "اسم العلامة التجارية" },
      { key: "brand_logo", label: "شعار العلامة التجارية" },
      { key: "brand_banner", label: "بانر العلامة التجارية" },
      { key: "brand_description", label: "وصف العلامة التجارية" },
      { key: "brand_metadata_title", label: "عنوان ميتا العلامة التجارية" },
      { key: "brand_metadata_description", label: "وصف ميتا العلامة التجارية" },
      { key: "brand_metadata_url", label: "رابط ميتا العلامة التجارية" }
    ]
  }
];

export const sallaFields = sallaSchema.flatMap((section) =>
  section.fields.map((field) => field.key)
);
