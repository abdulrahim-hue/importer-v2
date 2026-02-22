function Upload({ setFiles }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setFiles({
      baseFile: formData.get("baseFile"),
      translationFile: formData.get("translationFile")
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>رفع ملفات Shopify بصيغة CSV</h2>
      <label>
        ملف التصدير الكامل من Shopify (مطلوب)
        <input type="file" name="baseFile" accept=".csv,text/csv" required />
      </label>
      <label>
        ملف الترجمة من Shopify (اختياري)
        <input type="file" name="translationFile" accept=".csv,text/csv" />
      </label>
      <button type="submit">التالي: مطابقة الأعمدة</button>
    </form>
  );
}

export default Upload;
