export const sallaSchema = [
  {
    group: "Products",
    source: "Create Product",
    fields: [
      { key: "name", label: "Product Name" },
      { key: "description", label: "Product Description" },
      { key: "price", label: "Price" },
      { key: "sale_price", label: "Sale Price" },
      { key: "cost_price", label: "Cost Price" },
      { key: "status", label: "Status" },
      { key: "product_type", label: "Product Type" },
      { key: "quantity", label: "Quantity" },
      { key: "sku", label: "SKU" },
      { key: "mpn", label: "MPN" },
      { key: "gtin", label: "GTIN" },
      { key: "weight", label: "Weight" },
      { key: "weight_type", label: "Weight Type" },
      { key: "require_shipping", label: "Require Shipping" },
      {
        key: "maximum_quantity_per_order",
        label: "Maximum Quantity Per Order"
      },
      { key: "subtitle", label: "Subtitle" },
      { key: "promotion_title", label: "Promotion Title" },
      { key: "metadata_title", label: "Metadata Title" },
      { key: "metadata_description", label: "Metadata Description" },
      { key: "categories", label: "Categories (IDs or mapped values)" },
      { key: "tags", label: "Tags (IDs or mapped values)" },
      { key: "brand_id", label: "Brand ID" },
      { key: "images", label: "Images" }
    ]
  },
  {
    group: "Categories",
    source: "Create Category",
    fields: [
      { key: "category_name", label: "Category Name" },
      { key: "category_status", label: "Category Status" },
      { key: "category_image", label: "Category Image" },
      { key: "category_metadata_title", label: "Category Metadata Title" },
      {
        key: "category_metadata_description",
        label: "Category Metadata Description"
      },
      { key: "category_metadata_url", label: "Category Metadata URL" }
    ]
  },
  {
    group: "Tags",
    source: "Create Product Tag",
    fields: [{ key: "tag_name", label: "Tag Name" }]
  },
  {
    group: "Brands",
    source: "Create Brand",
    fields: [
      { key: "brand_name", label: "Brand Name" },
      { key: "brand_logo", label: "Brand Logo" },
      { key: "brand_banner", label: "Brand Banner" },
      { key: "brand_description", label: "Brand Description" },
      { key: "brand_metadata_title", label: "Brand Metadata Title" },
      { key: "brand_metadata_description", label: "Brand Metadata Description" },
      { key: "brand_metadata_url", label: "Brand Metadata URL" }
    ]
  }
];

export const sallaFields = sallaSchema.flatMap((section) =>
  section.fields.map((field) => field.key)
);
