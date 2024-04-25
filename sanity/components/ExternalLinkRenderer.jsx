// ExternalLinkRenderer.js
import React from "react";
import { LaunchIcon } from "@sanity/icons";
import Link from "next/link";

const ExternalLinkRenderer = (props) => (
  <span>
    {props.renderDefault(props)}
    <Link contentEditable={false} href={props.value.href}>
      <LaunchIcon />
    </Link>
  </span>
);

export default ExternalLinkRenderer;
