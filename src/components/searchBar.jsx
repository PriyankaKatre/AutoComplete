import { forwardRef, useEffect } from "react";
import searchIcon from "../assets/search.svg";

const SearchBar = forwardRef(
  (
    {
      searchTerm,
      setSearchTerm,
      setShowSuggestions,
      handleBlur,
      handleFocus,
      handleKeyDown,
      showSuggestions,
    },
    ref
  ) => {
    useEffect(() => {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }, [ref]);

    return (
      <div className="input-wrapper">
        <span className="search-icon">
          <img src={searchIcon} alt="search icon" />
        </span>
        <input
          type="text"
          ref={ref}
          className={`search-input ${
            showSuggestions && searchTerm ? "suggestion-visible" : ""
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={(e) => {
            handleBlur(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search"
        />
        {searchTerm && (
          <button
            className="clear-button"
            onClick={() => {
              setSearchTerm("");
              setShowSuggestions(false); 
            }}
          >
            X
          </button>
        )}
        <button className="mic-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar"; // Always set displayName when using forwardRef
export default SearchBar;
