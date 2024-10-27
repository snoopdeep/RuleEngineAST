import React, { useEffect, useState } from "react";
import { deleteRule } from "../api/api";
import ASTVisualizer from "./ASTVisualizer";
import "./RuleList.css";

const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showAstModal, setShowAstModal] = useState(false);
  const [ruleString, setRuleString] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/rules`);
      const data = await response.json();
      setRules(data);
    } catch (error) {
      setMessage("Failed to fetch rules");
    }
  };

  const handleDelete = async (ruleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rule?"
    );
    if (!confirmDelete) return;

    try {
      await deleteRule(ruleId);
      setMessage("Rule deleted successfully");
      fetchRules();
      if (selectedRule && selectedRule._id === ruleId) {
        setSelectedRule(null);
      }
    } catch (error) {
      setMessage("Error deleting rule");
    }
  };

  const convertAstToReadableString = (ast) => {
    if (ast.operator) {
      const left = convertAstToReadableString(ast.left);
      const right = convertAstToReadableString(ast.right);
      return `(${left} ${ast.operator} ${right})`;
    }
    return ast.value || "";
  };

  const handleSelect = (rule) => {
    setSelectedRule(rule);
    setShowAstModal(true);
    if (rule.ast) {
      setRuleString(convertAstToReadableString(rule.ast));
    }
  };

  const closeAstModal = () => {
    setShowAstModal(false);
  };

  return (
    <div className="rule-list-container">
      <h2>Existing Rules</h2>
      {rules.length == 0 && <h3>No Rules Found!</h3>}
      {message && <p>{message}</p>}
      <ul className="rule-list">
        {rules.map((rule) => (
          <li key={rule._id} className="rule-item">
            <span className="rule-name">{rule.name}</span>
            <button className="ast-button" onClick={() => handleSelect(rule)}>
              Show AST
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(rule._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* AST Modal */}
      {showAstModal && selectedRule && (
        <div className="ast-modal">
          <div className="ast-modal-content">
            <span className="close-button" onClick={closeAstModal}>
              &times;
            </span>
            <h4>
              {selectedRule.name} AST :{" "}
              <span className="ruleString">Rule String: {ruleString}</span>{" "}
            </h4>
            {/* Display the human-readable rule string */}
            {/* <p className="readable-rule-string">
              Rule String: {ruleString}
            </p> */}
            {/* Display the AST Visualizer */}
            {selectedRule.ast ? (
              <ASTVisualizer ast={selectedRule.ast} />
            ) : (
              <p>No AST available for this rule.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleList;
