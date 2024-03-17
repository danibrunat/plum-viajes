import React from "react";
import { defineField } from "sanity";

const InternalLinkRender = ({ children }) => <span>{children} 🔗</span>;

export default defineField({
  title: "Internal link to another document",
  name: "internalLink",
  type: "reference",
  description: "Locate a document you want to link to",
  to: [{ type: "page" }, { type: "route" }],
  blockEditor: {
    icon: () => "🔗",
    render: InternalLinkRender,
  },
});
