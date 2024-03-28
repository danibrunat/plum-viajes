"use client";
import { useState, useEffect } from "react";
import ModalService from "../../../services/modal.service";
export default function ModalRoot() {
  const [modal, setModal] = useState({});

  useEffect(() => {
    ModalService.on("open", ({ component, props }) => {
      setModal({
        component,
        props,
        close: () => {
          props.close && props.close();
          setModal({});
        },
      });
    });
  }, []);

  const ModalComponent = modal.component ? modal.component : null;

  return (
    <section>
      {ModalComponent && (
        <ModalComponent
          {...modal.props}
          close={modal.close}
          className={ModalComponent ? "block" : ""}
        />
      )}
    </section>
  );
}
