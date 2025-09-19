"use client";

// Imports Start
import React from "react";
import Link from "next/link";
// Imports End

// Type Start
interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}
// Type End

// /error Page Start
const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center max-w-md mx-auto p-6">
        {/* Error Icon Start */}
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        {/* Error Icon End */}

        {/* Title Start */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Oops! Something went wrong
        </h2>
        {/* Title End */}

        {/* Error Message Start */}
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error?.message || "An unexpected error occurred."}
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Reference ID: {error.digest}
          </p>
        )}
        {/* Error Message End */}

        {/* Actions Start */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <button
              onClick={() => reset()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          )}

          {/* Back to Home */}
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Go Home
          </Link>
        </div>
        {/* Actions End */}
      </div>
    </div>
    // /error Page End
  );
};

export default ErrorPage;
// /error Page End

