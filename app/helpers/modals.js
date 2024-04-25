"use client";
import ModalBase from "../components/commons/Modal/ModalBase";
import ModalService from "../services/modal.service";

export const openModalBase = (props) => ModalService.open(ModalBase, props);
