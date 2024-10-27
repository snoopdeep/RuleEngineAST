import React, { useState, useEffect } from "react";
import { evaluateRule, fetchAvailableRules } from "../api/api";
import "./EvaluateRule.css";

const EvaluateRule = () => {
  const [ruleName, setRuleName] = useState("");
  const [availableRules, setAvailableRules] = useState([]);
  const [fields, setFields] = useState({});
  const [data, setData] = useState({});
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch available rules when component mounts
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetchAvailableRules();
        setAvailableRules(response || []);
      } catch (error) {
        setMessage("Failed to fetch available rules.");
      }
    };

    fetchRules();
  }, []);

  // Extract required fields (keys) from AST
  const extractFieldsFromAST = (ast) => {
    const fields = [];
    const traverseAST = (node) => {
      if (node.type === "operand" && node.left && node.left.value) {
        fields.push(node.left.value);
      }
      if (node.left) traverseAST(node.left);
      if (node.right) traverseAST(node.right);
    };
    traverseAST(ast);
    return fields;
  };

  // Handle rule selection from dropdown
  const handleRuleSelection = (e) => {
    const selectedRuleName = e.target.value;
    setRuleName(selectedRuleName);

    const selectedRule = availableRules.find(
      (rule) => rule.name === selectedRuleName
    );
    if (selectedRule) {
      const extractedFields = extractFieldsFromAST(selectedRule.ast);
      const initialData = extractedFields.reduce((acc, field) => {
        acc[field] = "";
        return acc;
      }, {});
      setFields(initialData);
      setData(initialData);
    }
  };

  // Handle input change for field values
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle rule evaluation
  const handleEvaluate = async (e) => {
    e.preventDefault();
    try {
      const response = await evaluateRule({ rule_name: ruleName, data });
      setResult(response.data.eligible);
      setMessage("");
    } catch (error) {
      setMessage(
        `Error: ${error.response ? error.response.data.error : error.message}`
      );
    }
  };

  return (
    <div className="evaluate-container">
      <h2>Evaluate Rule</h2>
      <form onSubmit={handleEvaluate}>
        <div className="form-group">
          <label>Select Rule:</label>
          <select
            value={ruleName}
            onChange={handleRuleSelection}
            className="form-control"
            required
          >
            <option value="" disabled>
              Select a rule
            </option>
            {availableRules.map((rule) => (
              <option key={rule._id} value={rule.name}>
                {rule.name}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(fields).length > 0 && (
          <div className="form-fields">
            {Object.keys(fields).map((field) => (
              <div key={field} className="form-group">
                <label>{field}:</label>
                <input
                  type="text"
                  name={field}
                  value={data[field]}
                  onChange={handleFieldChange}
                  className="form-control"
                  required
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" id="evaluatebtn" className="btn btn-primary">
          Evaluate
        </button>
      </form>

      {message && <p className="error-message">{message}</p>}
      {result !== null && (
        <div
          className={`result-box ${
            result ? "result-eligible" : "result-not-eligible"
          }`}
        >
          <p>
            Eligibility: <strong>{result ? "Eligible" : "Not Eligible"}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluateRule;
