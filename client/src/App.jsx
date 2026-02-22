import { useState } from "react";
import Upload from "./Upload";
import Mapping from "./Mapping";

function App() {
  const [files, setFiles] = useState(null);
  const [mapping, setMapping] = useState({});

  const reset = () => {
    setFiles(null);
    setMapping({});
  };

  return (
    <main className="container">
      <h1>أداة توحيد ملفات Shopify إلى Salla</h1>
      {!files && <Upload setFiles={setFiles} />}
      {files && (
        <>
          <Mapping files={files} mapping={mapping} setMapping={setMapping} />
          <button className="secondary" onClick={reset}>
            رفع ملفات أخرى
          </button>
        </>
      )}
    </main>
  );
}

export default App;
