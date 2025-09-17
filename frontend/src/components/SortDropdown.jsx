// src/components/SortDropdown.jsx
import React from 'react';

const SORT_OPTIONS = [
  'Popularity',
  'Price: Low to High',
  'Price: High to Low',
  'Customer Rating',
];

const SortDropdown = ({ sortBy, onChange }) => (
  <div className="mb-4 flex items-center">
    <label htmlFor="sortBy" className="mr-2 font-medium">Sort by:</label>
    <select
      id="sortBy"
      value={sortBy}
      onChange={e => onChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {SORT_OPTIONS.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

export default SortDropdown;
