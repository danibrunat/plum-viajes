---
applyTo: '**'
---
# Code Organization and Helper Management

When refactoring or creating code, adhere to the following Senior Developer standards for organization and cleanliness:

1.  **Helper Extraction & Location:**
  *   Never leave utility or helper functions inside the main component or logic file if they can be abstracted.
  *   **Analyze existing conventions:** Look for where helpers are currently stored (e.g., `utils/`, `helpers/`, specific service folders, or alongside components).
  *   **Reuse over Duplicate:** Check if a similar helper already exists. If a helper is needed by multiple files, move it to a shared location (e.g., a `helpers.js` or `utils.js` in a parent directory) rather than duplicating logic.
  *   **Contextual Placement:**
    *   *Presentational helpers:* Should reside near the UI components or in a dedicated UI utils folder.
    *   *Service/Logic helpers:* Should reside within the specific service domain or a shared domain utility folder.

2.  **File Creation & Subdivision:**
  *   If a solution requires complex logic, break it down into smaller, manageable files.
  *   Create new files for distinct responsibilities. Do not create "God files".
  *   Ensure new helper files are placed in directories that match the project's architectural pattern.

3.  **Naming Conventions:**
  *   **Language:** All code (variables, constants, functions, components, filenames) must be in **English**.
  *   **Descriptiveness:** Prioritize descriptive names over short ones. A variable name should clearly explain its purpose without needing comments (e.g., use `isUserAuthenticated` instead of `isAuth`).
  *   **Consistency:** Match the casing and naming style of the existing codebase (camelCase, PascalCase, etc.).

4.  **General Quality:**
  *   Aim for "Senior Developer" quality: clean, modular, DRY (Don't Repeat Yourself), and easy to maintain.
  *   Apply reasoning to file structure decisions; do not blindly dump code.