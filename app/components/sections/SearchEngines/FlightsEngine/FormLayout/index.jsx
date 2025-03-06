import React from "react";

const FormLayout = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col lg:flex-row gap-4 lg:gap-5 mx-3 p-4 items-center"
    >
      {children}
    </form>
  );
};

export default FormLayout;
