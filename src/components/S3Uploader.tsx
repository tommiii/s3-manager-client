import ky from "ky";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Badge, Button, Spinner } from "reactstrap";

const { REACT_APP_API_URL } = process.env;

interface Notification {
  text: string;
  type: string;
}

const S3Uploader: FunctionComponent<{}> = () => {

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    <div className="S3Uploader p-3">
      <div className="text-left">
        <Button
          color="secondary"
          onClick={() => {
            if (inputEl && inputEl.current) {
              inputEl.current.click();
            }
          }} >{!file ? "Select file" : "Select another file"}</Button>
        {file && <Button
          disabled={isLoading}
          className="float-right"
          color="secondary"
          onClick={async () => {
            if (file) {
              try {
                setIsLoading(true);
                const url: string = `${REACT_APP_API_URL}/get-upload-persigned-url`;
                const { type }: { type: string } = file;
                const body: string = JSON.stringify({
                  key: file.name,
                  type,
                });

                const uploadSignedUrl: string = await ky.post(url, {
                  body,
                  timeout: false,
                }).json();

                const headers = new Headers();
                headers.append("Content-Type", type);
                headers.append("Access-Control-Allow-Headers", "*");
                await ky.put(uploadSignedUrl, {
                  body: file,
                  headers,
                  timeout: false,
                }).blob();
                setIsLoading(false);
                setNotification({
                  text: "Your file has been successfully uploaded!!",
                  type: "success",
                });
              } catch (err) {
                setIsLoading(false);
                setNotification({
                  text: "Oops! Something went wrong!",
                  type: "danger",
                });
              }
            }
          }}
        > {isLoading ? <Spinner color="light" /> : "Upload"}   </Button>}
      </div>
      {file && <div className="mt-4">
        <span>Filename: <Badge color="secondary">{file.name}</Badge></span>
        <hr />
        <span>Size: <Badge color="secondary">{formatBytes(file.size)}</Badge></span>
      </div>}
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
