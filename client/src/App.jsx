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
      <h1>Unified Shopify → Salla CSV Transformer</h1>
      {!files && <Upload setFiles={setFiles} />}
      {files && (
        <>
          <Mapping files={files} mapping={mapping} setMapping={setMapping} />
          <button className="secondary" onClick={reset}>
            Upload Different Files
          </button>
        </>
      )}
    </main>
  );
}

export default App;
