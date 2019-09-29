import ky from "ky";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

const { REACT_APP_API_URL } = process.env;

interface Notification {
  text: string;
  type: string;
}

export const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(",")[1]);
      }

    };
    reader.onerror = reject;
  });
};

const S3Uploader: FunctionComponent<{}> = () => {

  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  }, [notification]);

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
          onClick={async () => {
            if (file) {
              try {
                const url = `${REACT_APP_API_URL}/upload-on-s3`;
                const body: string = JSON.stringify({
                  base64: await toBase64(file),
                  key: file.name,
                });
                await ky.put(url, {
                  body,
                  timeout: false,
                }).blob();
                setNotification({
                  text: "Your file has been successfully uploaded!!",
                  type: "success",
                });
              } catch (err) {
                setNotification({
                  text: "Oops! Something went wrong!",
                  type: "danger",
                });
              }
            }
          }}
        > Upload</button>}
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
      {
        notification && <div className={`alert alert-${notification.type}`} role="alert">
          {notification.text}
        </div>
      }
    </div >

  );
};

export default S3Uploader;
