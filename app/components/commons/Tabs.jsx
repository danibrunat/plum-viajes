"use client";
import React, { useState } from "react";
const Tabs = ({ children }) => {
  const tabChildren = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.props?.label
  );

  const [activeTab, setActiveTab] = useState(tabChildren[0]?.props.label);
  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    if (newActiveTab === "Hoteles") {
      window.location.href =
        "https://plumviajes.app.pricenavigator.net/#!/hotel";
      return;
    }
    setActiveTab(newActiveTab);
  };
  return (
    <>
      <div className="flex">
        {tabChildren.map((child) => (
          <button
            key={child?.props?.label}
            aria-label={child?.props?.label}
            className={`${
              activeTab === child?.props?.label
                ? " bg-plumPrimaryPurple text-white"
                : ""
            } flex-1 text-gray-700 font-normal md:font-medium py-2 `}
            onClick={(e) => handleClick(e, child?.props?.label)}
          >
            {child?.props?.label}
          </button>
        ))}
      </div>
      <div>
        {tabChildren.map((child) => {
          if (child?.props?.label === activeTab) {
            return <div key={child?.props?.label}>{child?.props.children}</div>;
          }
          return null;
        })}
      </div>
    </>
  );
};
const Tab = ({ label = "", children }) => {
  return (
    <div label={label} className="hidden text-white">
      {children}
    </div>
  );
};
export { Tabs, Tab };
