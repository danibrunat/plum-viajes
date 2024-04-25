import React from "react";

const IFrame = ({ url }) => {
  console.log("url", url);
  return (
    <iframe
      src={url}
      seamless="seamless"
      height="600px"
      width="100%"
      style={{
        border: "0px",
        overflow: "hidden",
        backgroundColor: "transparent",
        marginTop: "opx",
      }}
      id="iFrame"
    />
  );
};

export default IFrame;
