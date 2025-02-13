import React, { useState, useEffect } from "react";

const categories = [
  { id: "Next JS", label: "Next JS" },
  { id: "React JS", label: "React JS" },
  { id: "Data Science", label: "Data Science" },
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Fullstack Development", label: "Fullstack Development" },
  { id: "MERN Stack Development", label: "MERN Stack Development" },
  { id: "Backend Development", label: "Backend Development" },
  { id: "Javascript", label: "Javascript" },
  { id: "Python", label: "Python" },
  { id: "Docker", label: "Docker" },
  { id: "MongoDB", label: "MongoDB" },
  { id: "HTML", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  // Notify parent when selectedCategories or sortByPrice changes
  useEffect(() => {
    const debounce = setTimeout(() => {
      handleFilterChange(selectedCategories, sortByPrice);
    }, 300);
  
    return () => clearTimeout(debounce);
  }, [selectedCategories, sortByPrice, handleFilterChange]);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId]
    );
  };

  const selectByPriceHandler = (event) => {
    setSortByPrice(event.target.value);
  };

  return (
    <div className="w-full lg:w-1/5 p-4 border rounded-lg shadow-md bg-white h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <div className="relative">
          <select
            onChange={selectByPriceHandler}
            className="border p-2 rounded-md text-sm appearance-none focus:outline-none"
          >
            <option value="">Sort by price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      </div>
      <hr className="my-4" />
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <input
              type="checkbox"
              id={category.id}
              onChange={() => handleCategoryChange(category.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={category.id}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {category.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
