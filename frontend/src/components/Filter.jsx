const Filter = ({ filterValue, setFilterValue }) => {
  return (
    <span>
      filter shown with{" "}
      <input
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
    </span>
  );
};

export default Filter;
