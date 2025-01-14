
const DetailedList = ({ results, metadata, activeResultIndex }) => {
  return (
    <>
      {metadata.count > 0 && (
        <div>
          <p>
            {metadata.count} results found in {metadata.time} seconds.
          </p>
        </div>
      )}

      {/* Results */}
      <ul style={{ marginTop: "20px" }}>
        {results.map((result, index) => (
          <li
            key={index}
            style={{ marginBottom: "20px" }}
            className={`${activeResultIndex===index ? 'active': ''}`}
          >
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              <h3>{result.title}</h3>
            </a>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DetailedList
