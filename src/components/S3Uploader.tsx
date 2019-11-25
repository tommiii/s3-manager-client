import ky from "ky";
import React, { FunctionComponent, useRef, useState } from "react";
import { Badge, Button, Spinner } from "reactstrap";

const { REACT_APP_API_URL } = process.env;
interface Props {
  onFileUpload?: ({ success, text }: { success: boolean, text?: string; }) => any;
}
const S3Uploader: FunctionComponent<Props> = ({ onFileUpload }) => {

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputEl = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) { return "0 Bytes"; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const uploadFile = async () => {
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
        if (onFileUpload) {
          onFileUpload({
            success: true,
            text: "Your file has been successfully uploaded!!",
          });
        }
      } catch (err) {
        setIsLoading(false);
        if (onFileUpload) {
          onFileUpload({
            success: false,
            text: "Oops! Something went wrong uploading your file!",
          });
        }
      }
    }
  };

  const selectFile = () => {
    if (inputEl && inputEl.current) {
      inputEl.current.click();
    }
  };

  return (
    <div className="S3Uploader p-3">
      <div className="text-left">
        <Button
          color="secondary"
          onClick={selectFile} >{!file ? "Select file" : "Select another file"}</Button>
        {file && <Button
          disabled={isLoading}
          className="float-right"
          color="secondary"
          onClick={uploadFile}
        > {isLoading ? <Spinner color="light" /> : "Upload"}   </Button>}
      </div>
      {file && <div className="mt-4">
        <h6>File info:</h6>
        <p><Badge color="secondary">Filename: {file.name}</Badge></p>
        <p><Badge color="secondary">Size: {formatBytes(file.size)}</Badge></p>
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
    </div >

  );
};

export default S3Uploader;
