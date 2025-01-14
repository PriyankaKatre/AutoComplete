import { useState, useEffect, useRef } from "react";
import "./App.css";
import SearchBar from "./components/searchBar";
import SuggestionList from "./components/resultList";
import { useDebounce } from "./hooks/debounceSearch";
import { localData } from "./data";
import DetailedList from "./components/detailedList";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [results, setResults] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [searchHistory, setSearchHistory] = useState(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [removeButtonClicked, setRemoveButtonClicked] = useState(false);

  const inputRef = useRef(null);
  const suggestionListRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredItems = localData
        .filter((data) =>
          data.title.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase())
        )
        .slice(0, 10)
        .map((item) => ({
          ...item,
          isInHistory: searchHistory.some(
            (historyItem) => historyItem.title === item.title
          ),
        }));
      setFilteredSuggestions(filteredItems);
      !showSuggestions && setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
    }
  }, [debouncedSearchTerm, searchHistory]);


    const handleSearch = () => {
      const startTime = performance.now();

      let filteredResult = localData.filter((data) => {
        return data.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
      const endTime = performance.now();

      setMetaData({
        count: filteredResult.length,
        time: ((endTime - startTime) / 1000).toFixed(2),
      });

      setResults(filteredResult);
    };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    handleSearch();
    setShowSuggestions(false);

    if (!searchHistory.some((item) => item.title === suggestion.title)) {
      const updatedHistory = [...searchHistory, suggestion];
      setSearchHistory(updatedHistory);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (showSuggestions) {
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else {
        setActiveResultIndex((prevIndex) =>
          prevIndex < results.length - 1 ? prevIndex + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      if (showSuggestions) {
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
        );
      } else {
        setActiveResultIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : results.length - 1
        );
      }
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0 && showSuggestions) {
        const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
        setSearchTerm(selectedSuggestion.title);
        handleSearch();
        setShowSuggestions(false);

        if (
          !searchHistory.some((item) => item.title === selectedSuggestion.title)
        ) {
          const updatedHistory = [...searchHistory, selectedSuggestion];
          setSearchHistory(updatedHistory);
        }
      } else if (activeResultIndex >= 0) {
        const selectedResult = results[activeResultIndex];
        window.open(selectedResult.url, "_blank");
      } else {
        handleSearch();
        setShowSuggestions(false);
        setResults(
          localData.filter((data) =>
            data.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }
  };

  const handleBlur = (event) => {
    setTimeout(() => {
      if (
        !removeButtonClicked &&
        !suggestionListRef.current.contains(event.relatedTarget)
      ) {
        setShowSuggestions(false);
      }
    }, 100);
  };

  const handleRemoveButtonClick = () => {
    setRemoveButtonClicked(true);
    setTimeout(() => {
      setRemoveButtonClicked(false);
    }, 0);
  }

  return (
    <div className="search-container">
      <h1 className="search-title">SearchX</h1>
      <div className="search-box-container">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          handleKeyDown={handleKeyDown}
          handleBlur={handleBlur}
          ref={inputRef}
        />

        {showSuggestions && (
          <SuggestionList
            suggestions={filteredSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            activeSuggestionIndex={activeSuggestionIndex}
            setSearchHistory={setSearchHistory}
            ref={suggestionListRef}
            handleRemoveButtonClick={handleRemoveButtonClick} // Pass the handler to remove button
          />
        )}

        {results.length > 0 && (
          <DetailedList
            results={results}
            metadata={metaData}
            activeResultIndex={activeResultIndex}
          />
        )}
        {debouncedSearchTerm && filteredSuggestions.length === 0 && (
          <div className="noRecords">
            No results found. Please refine your search criteria and try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
