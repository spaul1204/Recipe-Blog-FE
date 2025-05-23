import React from "react";

const FilterCard = ({
  filterHeading,
  filterOptions,
  selectedValue,
  onChange,
  isMultiSelect = false,
}) => {
  const handleChange = (value) => {
    if (isMultiSelect) {
      // For tags, handle multiple selections
      const newValue = selectedValue.includes(value)
        ? selectedValue.filter((v) => v !== value)
        : [...selectedValue, value];
      onChange(newValue);
    } else {
      // For meal type and difficulty, handle single selection
      onChange(value === selectedValue ? "" : value);
    }
  };

  return (
    <div className="card bg-base-300 shadow-sm mb-2 p-4">
      <h2 className="font-bold text-lg mb-2">{filterHeading}</h2>
      <div className="flex flex-col gap-2">
        {filterOptions.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type={isMultiSelect ? "checkbox" : "radio"}
              name={filterHeading.toLowerCase()}
              checked={
                isMultiSelect
                  ? selectedValue.includes(option)
                  : selectedValue === option
              }
              onChange={() => handleChange(option)}
              className={
                isMultiSelect
                  ? "checkbox checkbox-primary"
                  : "radio radio-primary"
              }
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
