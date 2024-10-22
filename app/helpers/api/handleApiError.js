export function handleApiError(error, taskName = "unknown") {
  console.error(`[ERROR] Task: ${taskName} -`, error);

  // Example of identifying error types
  if (error instanceof FetchError) {
    return {
      status: 500,
      json: {
        success: false,
        message: `Failed to fetch data during ${taskName}`,
        error: error.message,
      },
    };
  }

  if (error instanceof ValidationError) {
    return {
      status: 400,
      json: {
        success: false,
        message: `Validation error during ${taskName}`,
        error: error.message,
      },
    };
  }

  // Default response for unknown errors
  return {
    status: 500,
    json: {
      success: false,
      message: `An unexpected error occurred during ${taskName}`,
      error: error.message || "Unknown error",
    },
  };
}
