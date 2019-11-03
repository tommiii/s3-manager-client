import ky from "ky";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Jumbotron, Modal, Table } from "reactstrap";
import S3Uploader from "./components/S3Uploader";

const { REACT_APP_API_URL } = process.env;
interface S3ContentsList {
  filename: string;
  extension: string;
  lastModified: string;
  size: string;
}

const App: FunctionComponent = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [s3Objects, setS3Objects] = useState<S3ContentsList[]>([]);

  useEffect(() => {
    const fetchS3Objects = async () => {
      const url: string = `${REACT_APP_API_URL}/get-objects`;
      const response: object = await ky.get(url).json();
      const { Contents }: any = response;
      setS3Objects(_.map(Contents, ({ Key, LastModified: lastModified, Size: size }) => ({
        extension: _.split(Key, ".")[1],
        filename: _.split(Key, ".")[0],
        lastModified,
        size,
      })));
    };
    fetchS3Objects();
  }, []);

  const renderTable = () => <Table>
    <thead>
      <tr>
        <th>#</th>
        <th>Filename</th>
        <th>Exstension</th>
        <th>Last Modified</th>
        <th>Size</th>
      </tr>
    </thead>
    <tbody>
      {_.map(s3Objects, ({ filename, extension, lastModified, size }: S3ContentsList, index) => <tr key={index}>
        <th scope="row">{index}</th>
        <td>{filename}</td>
        <td>{extension}</td>
        <td>{size}</td>
        <td>{lastModified}</td>
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
          <Button onClick={() => { setIsOpen((prevIsOpen) => !prevIsOpen); }} color="secondary">Upload file</Button>
        </p>
      </Jumbotron>
      {_.size(s3Objects) && renderTable()}
      <Modal isOpen={isOpen} toggle={() => { setIsOpen((prevIsOpen) => !prevIsOpen); }}  >
        <S3Uploader />
      </Modal>

    </div>
  );
};

export default App;
