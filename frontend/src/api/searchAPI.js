import api from './api';

export const getSearchSuggestions = async (query) => {
  try {
    const response = await api.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
};