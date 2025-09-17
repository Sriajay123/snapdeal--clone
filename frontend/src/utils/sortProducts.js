// src/utils/sortProducts.js
export default function sortProducts(products, sortCriteria) {
  const sorted = [...products];
  switch (sortCriteria) {
    case 'Price: Low to High':
      return sorted.sort((a, b) => a.price - b.price);
    case 'Price: High to Low':
      return sorted.sort((a, b) => b.price - a.price);
    case 'Customer Rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'Popularity':
    default:
      return sorted; // Or implement popularity logic if available
  }
}
