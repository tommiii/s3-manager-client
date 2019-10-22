// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

const Navbar: FunctionComponent<{}> = () => {

  return (
    <div className="Navbar">
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src="./s3_ico.png" width={30} height={30} className="d-inline-block align-top" alt="" />
          S3 Manager
        </a>
      </nav>
    </div >
  );
};

export default Navbar;
