import React from "react";

const FormLayout = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-3"
    >
      {children}
    </form>
  );
};

export default FormLayout;
