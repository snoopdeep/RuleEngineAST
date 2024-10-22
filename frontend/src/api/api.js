// frontend/src/api/api.js
import axios from 'axios';
// dotenv.config();

const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL);

// Create a new rule
export const createRule = (ruleData) => {
  return axios.post(`${API_URL}/rules`, ruleData);
};

// Combine rules
export const combineRules = (combineData) => {
  return axios.post(`${API_URL}/rules/combine`, combineData);
};

// Evaluate a rule
export const evaluateRule = (evaluateData) => {
  return axios.post(`${API_URL}/rules/evaluate`, evaluateData);
};

// Modify a rule
export const modifyRule = (ruleId, ruleData) => {
  return axios.put(`${API_URL}/rules/${ruleId}`, ruleData);
};

// Delete a rule
export const deleteRule = (ruleId) => {
  return axios.delete(`${API_URL}/rules/${ruleId}`);
};


export const fetchAvailableRules = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/rules');
    return response.data; // Return the data containing the rules
  } catch (error) {
    console.error('Error fetching available rules:', error);
    throw new Error('Failed to fetch available rules');
  }
};