import ky from "ky";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Badge, Button, Jumbotron, Modal, Spinner, Table } from "reactstrap";
import Alert from "./components/Alert";
import S3Uploader from "./components/S3Uploader";

const { REACT_APP_API_URL } = process.env;

interface S3ContentsListType {
  filename: string;
  extension: string;
  lastModified: string;
  size: string;
}
interface AlertType {
  success: boolean;
  text?: string;
}

const App: FunctionComponent = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasToFetch, setHasToFetch] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [s3Objects, setS3Objects] = useState<S3ContentsListType[]>([]);

  useEffect(() => {
    const fetchS3Objects = async () => {
      try {
        setIsLoading(true);
        const url: string = `${REACT_APP_API_URL}/list-objects`;
        const response: object = await ky.get(url).json();
        const { Contents }: any = response;
        setS3Objects(_.map(Contents, ({ Key, LastModified: lastModified, Size: size }) => ({
          extension: _.split(Key, ".")[1],
          filename: _.split(Key, ".")[0],
          lastModified,
          size,
        })));
        setIsLoading(false);
      } catch (err) {
        setAlert({
          success: false,
          text: "Oops! Something went wrong listing your s3 files!",
        });
        setIsLoading(false);
      }

    };
    if (hasToFetch) {
      fetchS3Objects();
      setHasToFetch(false);
    }
  }, [hasToFetch]);

  const deleteFile = async ({ filename, extension }: { filename: string, extension: string }) => {
    const S3Key = `${filename}.${extension}`;
    const url: string = `${REACT_APP_API_URL}/delete-object/${S3Key}`;
    try {
      await ky.delete(url).json();
      setAlert({
        success: true,
        text: "Your file has been successfully deleted",
      });
      setHasToFetch(true);
    } catch (err) {
      setAlert({
        success: false,
        text: "Oops! Something went wrong deliting your file!",
      });
    }
  };

  const onFileUpload = ({ success, text }: AlertType) => {
    setAlert({
      success,
      text,
    });
    setIsOpen(false);
    setHasToFetch(true);
  };

  const renderTable = () => <Table striped responsive>
    <thead>
      <tr>
        <th></th>
        <th>Filename</th>
        <th>Exstension</th>
        <th>Size</th>
        <th>Last Modified</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {_.map(s3Objects, ({ filename, extension, lastModified, size }: S3ContentsListType, index) => <tr key={index}>
        <th scope="row">{index}</th>
        <td><Badge color="light">{filename}</Badge></td>
        <td><Badge color="light">{extension}</Badge></td>
        <td><Badge color="light">{size}</Badge></td>
        <td><Badge color="light">{lastModified}</Badge></td>
        <td><Button onClick={() => deleteFile({ filename, extension })} size="sm" color="danger">Delete</Button></td>

      </tr>)}
    </tbody>
  </Table>;

  return (
    <div className="App p-3">
      <Jumbotron>
        <h1 className="display-3">S3 Manager</h1>
        <p className="lead">S3 Manager made with React.js and Reactstrap (Bootstrap)</p>
        <hr className="my-4" />
        <p className="lead">
          <Button
            onClick={() => { setIsOpen((prevIsOpen) => !prevIsOpen); }}
            className="m-0"
            color="secondary">Upload file
          </Button>
        </p>
      </Jumbotron>
      {isLoading && <div className="text-center">
        <Spinner style={{ width: "3rem", height: "3rem" }} type="grow" />
      </div>}
      {!isLoading && (!!_.size(s3Objects) ? renderTable() : "No objects in your s3 bucket, upload something!")}
      <Modal isOpen={isOpen} toggle={() => { setIsOpen((prevIsOpen) => !prevIsOpen); }}  >
        <S3Uploader
          onFileUpload={onFileUpload} />
      </Modal>
      {alert && alert.text && <div className="fixed-bottom px-3">
        <Alert text={alert.text} success={alert.success} />
      </div>}
    </div>
  );
};

export default App;
