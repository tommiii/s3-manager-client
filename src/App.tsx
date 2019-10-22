import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import S3Uploader from "./components/S3Uploader";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <S3Uploader />
    </div>
  );
};

export default App;
