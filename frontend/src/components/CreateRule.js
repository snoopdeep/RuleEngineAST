// frontend/src/components/CreateRule.js
import React, { useState } from "react";
import { createRule } from "../api/api";
import "./CreateRule.css"; 

const CreateRule = () => {
  const [name, setName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for invalid symbols
    if (/[^a-zA-Z0-9\s&|=><()'\"!]/g.test(ruleString)) {
      setMessage("Error: Invalid symbols detected. Only alphanumeric characters, spaces, and symbols like &, |, =, >, <, (), '\" and ! are allowed.");
      setMessageType("error");
      return;
    }

    // Check for required operators (>, <, =, >=, etc.)
    if (!/[><=!]/.test(ruleString)) {
      setMessage("Error: The rule must contain at least one comparison operator (e.g., >, <, =, >=, !=, etc.).");
      setMessageType("error");
      return;
    }

    // Check for lowercase 'and' or 'or' and show error if found
    if (/\band\b|\bor\b/.test(ruleString)) {
      setMessage("Error: Please use 'AND' or '&&' and 'OR' or '||' instead of 'and' or 'or'.");
      setMessageType("error");
      return;
    }
   
    // Replace single '=' with '==' only if it's not preceded by '>' or '<' or '!'
    let formattedRuleString = ruleString.replace(/(?<![<>=!])=(?!=)/g, "==");

    // Check for single '&' or '|' in the rule string and show error if found
    if (/[^&]&(?!&)|[^|]\|(?!\|)/.test(formattedRuleString)) {
      setMessage("Error: Please use 'AND' and 'OR' instead of single '&' and '|'.");
      setMessageType("error");
      return;
    }

    // Replace '&&' with 'AND' and '||' with 'OR' if they are used
    formattedRuleString = formattedRuleString.replace(/&&/g, "AND").replace(/\|\|/g, "OR");

    try {
      const response = await createRule({ name, rule_string: formattedRuleString });
      setMessage(`Rule "${response.data.name}" created successfully!`);
      setMessageType("success");
      setName("");
      setRuleString("");
    } catch (error) {
      setMessage(`Error: ${error.response.data.error}`);
      setMessageType("error");
    }

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  return (
    <div className="create-rule-container">
      <h2>Create New Rule</h2>
      <form onSubmit={handleSubmit} className="create-rule-form">
        <div className="form-group">
          <label htmlFor="rule-name">Rule Name:</label>
          <input
            type="text"
            id="rule-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rule-string">Rule String:</label>
          <textarea
            id="rule-string"
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            required
            rows="4"
            cols="50"
            placeholder="e.g: ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Create Rule
        </button>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </div>
  );
};

export default CreateRule;
