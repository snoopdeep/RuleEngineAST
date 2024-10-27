import React, { useState, useEffect } from "react";
import { combineRules } from "../api/api";
import ASTVisualizer from "./ASTVisualizer";
import "./CombineRules.css";
import axios from "axios";

// Function to fetch available rules from the API
const fetchAvailableRules = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/rules`);
    return response.data || [];
  } catch (error) {
    throw new Error("Failed to fetch available rules");
  }
};

const CombineRules = () => {
  const [ruleInput, setRuleInput] = useState("");
  const [combinedRuleName, setCombinedRuleName] = useState("");
  const [combinedAST, setCombinedAST] = useState(null);
  const [message, setMessage] = useState("");
  const [availableRules, setAvailableRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const rules = await fetchAvailableRules();
        setAvailableRules(rules);
      } catch (error) {
        setMessage("Failed to fetch available rules.");
      }
    };

    fetchRules();
  }, []);

  const parseRulesAndOperators = (ruleString) => {
    const ruleNames = [];
    const operators = [];

    // Simple parsing logic to split by AND/OR and capture rules and operators
    const tokens = ruleString.split(/\s+/);
    tokens.forEach((token) => {
      if (token.toUpperCase() === "AND" || token.toUpperCase() === "OR") {
        operators.push(token.toUpperCase());
      } else {
        ruleNames.push(token.replace(/[()]/g, ""));
      }
    });

    return { ruleNames, operators };
  };

  const handleSubmit = async () => {
    try {
      const { ruleNames, operators } = parseRulesAndOperators(ruleInput);

      // Send API request
      const response = await combineRules({
        rule_names: ruleNames,
        operators,
        combined_rule_name: combinedRuleName || "combine_rule", // Default if empty
      });

      setCombinedAST(response.data.combined_ast); // Update AST visualizer
      setMessage("Rules combined successfully!");
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.error || "Failed to combine rules"}`
      );
    }
  };

  return (
    <div className="container my-5 combined-rules-container">
      <div className="header">
        <h2 className="text-center mb-4">Combine Rules</h2>

        {/* Dropdown for available rules in the top-right corner */}
        <div className="dropdown-container">
          <select className="form-control" id="availableRulesDropdown">
            <option disabled selected>
              Available Rules
            </option>
            {availableRules.length > 0 ? (
              availableRules.map((rule) => (
                <option key={rule._id} value={rule.name}>
                  {rule.name}
                </option>
              ))
            ) : (
              <option>No rules available</option>
            )}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("Error") ? "alert-danger" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="ruleInput">Enter Combined Rule:</label>
        <input
          type="text"
          id="ruleInput"
          className="form-control"
          placeholder="Enter combined rule (e.g., (RULE1 AND RULE2) OR RULE3)"
          value={ruleInput}
          onChange={(e) => setRuleInput(e.target.value)}
        />
      </div>

      <div className="form-group mt-3">
        <label htmlFor="ruleNameInput">Combined Rule Name (optional):</label>
        <input
          type="text"
          id="ruleNameInput"
          className="form-control"
          placeholder="Enter a name for the combined rule"
          value={combinedRuleName}
          onChange={(e) => setCombinedRuleName(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={handleSubmit}
        disabled={!ruleInput}
      >
        Submit Combined Rule
      </button>

      {combinedAST && (
        <div className="mt-5">
          <h3>Combined AST:</h3>
          <ASTVisualizer ast={combinedAST} />
        </div>
      )}
    </div>
  );
};

export default CombineRules;
