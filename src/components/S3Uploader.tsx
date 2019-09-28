import React, { FunctionComponent, useRef, useState } from "react";

const S3Uploader: FunctionComponent<{}> = ({ }) => {

  const [file, setFile] = useState<File | null>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) { return "0 Bytes"; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="S3Uploader">
      <div className="jumbotron text-left">
        <h1 className="display-4">S3 Uploader</h1>
        <p className="lead">Simple S3 File Uploader, made with React and TypeScript</p>
        <hr className="my-4" />
        {file && <p>Filename: {file.name}</p>}
        {file && <p>Size: {formatBytes(file.size)}</p>}
        <button
          type="button"
          className="btn btn-light float-left"
          onClick={() => {
            if (inputEl && inputEl.current) {
              inputEl.current.click();
            }
          }} >{!file ? "Select file" : "Select another file"}</button>
        {file && <button
          type="button"
          className="btn btn-dark float-right"
          onClick={() => null}
        >Upload</button>}
      </div>
      <input
        ref={inputEl}
        type="file"
        className="d-none"
        onChange={({ target: { files } }) => {
          if (files && files[0]) {
            setFile(files[0]);
          }
        }}
      />
    </div>
  );
};

export default S3Uploader;
