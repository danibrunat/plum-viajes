import { DashboardConfig } from "@sanity/dashboard";
/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...index]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { apiVersion, dataset, projectId } from "./sanity/env";
import dbConfig from "./sanity/dashboardConfig";
import { deskStructure } from "./sanity/deskStructure";
import { schema } from "./sanity/schema";
import {
  dashboardTool,
  projectUsersWidget,
  projectInfoWidget,
} from "@sanity/dashboard";
import { structureTool } from "sanity/structure";

import { codeInput } from "@sanity/code-input";
import { iconPicker } from "sanity-plugin-icon-picker";
import { tags } from "sanity-plugin-tags";

const hiddenDocTypes = (listItem: { getId: () => string }) =>
  !["page", "route", "siteConfig"].includes(listItem.getId());

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    tags({}),
    structureTool({
      structure: deskStructure,
    }),
    deskTool(),
    iconPicker(),
    codeInput(),
    dashboardTool({
      widgets: [projectInfoWidget(), projectUsersWidget()],
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
