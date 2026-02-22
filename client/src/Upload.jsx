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
      <h2>Upload Shopify CSV Files</h2>
      <label>
        Shopify Full Export (required)
        <input type="file" name="baseFile" accept=".csv,text/csv" required />
      </label>
      <label>
        Shopify Translation Export (optional)
        <input type="file" name="translationFile" accept=".csv,text/csv" />
      </label>
      <button type="submit">Continue to Mapping</button>
    </form>
  );
}

export default Upload;
