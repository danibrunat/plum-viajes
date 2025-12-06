import React from "react";

const FormLayout = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-5xl mx-auto p-4 md:p-6"
    >
      {children}
    </form>
  );
};

export default FormLayout;
