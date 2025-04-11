"use client";
import { Link } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = ({
  code = 404,
  title = "Page Not Found",
  message = "Sorry, we couldn't find the page you're looking for.",
}) => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>

        <div className="error-actions">
          <Link to="/" className="error-button primary">
            Go Back Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="error-button secondary"
          >
            Go Back
          </button>
        </div>

        <div className="error-code">
          <span>{code}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
