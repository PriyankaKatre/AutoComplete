import React, { forwardRef } from "react";
import clockIcon from "../assets/clock.svg";
import searchIcon from "../assets/search.svg";

const SuggestionList = forwardRef(
  (
    {
      suggestions,
      handleSuggestionClick,
      activeSuggestionIndex,
      setSearchHistory,
      handleRemoveButtonClick,
    },
    ref
  ) => {
    const handleRemoveClick = (title, event) => {
      event.stopPropagation();
      handleRemoveButtonClick();
      const storedHistory = localStorage.getItem("searchHistory");
      const updatedHistory = JSON.parse(storedHistory).filter(
        (item) => item.title !== title
      );

  
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
    };

    return (
      <div className="suggestions-list" ref={ref}>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`suggestion-wrapper ${
              index === activeSuggestionIndex ? "active" : ""
            }`}
          >
            <button
              className={`suggestion-item ${
                suggestion.isInHistory ? "visited" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-title">
                <span className="icon-wrapper">
                  {suggestion.isInHistory ? (
                    <img src={clockIcon} alt="Clock Icon" />
                  ) : (
                    <img src={searchIcon} alt="Search Icon" />
                  )}
                </span>
                {suggestion.title}
              </span>
            </button>

            {suggestion.isInHistory && (
              <button
                className="remove-button"
                onClick={(event) => handleRemoveClick(suggestion.title, event)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }
);

SuggestionList.displayName = "SuggestionList";

export default SuggestionList;
