// frontend/src/components/CreateRule.js
import React, { useState } from "react";
import { createRule } from "../api/api";
import "./CreateRule.css"; // Import the CSS file for styling

const CreateRule = () => {
  const [name, setName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Success or Error message type

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRule({ name, rule_string: ruleString });
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
    }, 3000);
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
            placeholder="e.g., ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
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
