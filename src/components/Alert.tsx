import React, { FunctionComponent, useEffect, useState } from "react";
import { UncontrolledAlert } from "reactstrap";

interface Props {
    success: boolean;
    text: string;
}

const Alert: FunctionComponent<Props> = ({ success, text }) => {
    const [show, setShow] = useState<boolean>(true);
    useEffect(() => {
        setTimeout(() => { setShow(false); }, 3000);
    }, [show]);
    return show ? <UncontrolledAlert color={success ? "success" : "danger"}>
        {text}
    </UncontrolledAlert> : null;
};

export default Alert;
