import React from "react";
import "./App.css";
import S3Uploader from "./components/S3Uploader";

const App: React.FC = () => {
  return (
    <div className="App">
      <S3Uploader />
    </div>
  );
};

export default App;
