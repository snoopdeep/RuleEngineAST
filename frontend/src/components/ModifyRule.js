import React, { useEffect, useState } from 'react';
import { modifyRule } from '../api/api';
import './ModifyRule.css'; // Importing the CSS file

const ModifyRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [ruleString, setRuleString] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/rules`);
      const data = await response.json();
      setRules(data);
    } catch (error) {
      setMessage('Failed to fetch rules');
      setMessageType('error');
    }
  };

  const convertAstToReadableString = (ast) => {
    if (ast.operator) {
      const left = convertAstToReadableString(ast.left);
      const right = convertAstToReadableString(ast.right);
      return `(${left} ${ast.operator} ${right})`;
    }
    return ast.value;
  };

  const handleSelect = (e) => {
    const ruleId = e.target.value;
    setSelectedRuleId(ruleId);
    const rule = rules.find((r) => r._id === ruleId);
    if (rule) {
      setRuleString(convertAstToReadableString(rule.ast));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await modifyRule(selectedRuleId, { rule_string: ruleString });
      setMessage(`Rule "${response.data.name}" updated successfully!`);
      setMessageType('success');
      setSelectedRuleId('');
      setRuleString('');
      fetchRules();
    } catch (error) {
      setMessage(`Error: ${error.response.data.error}`);
      setMessageType('error');
    }
  };

  return (
    <div className="modify-rule-container">
      <h2>Modify Rule</h2>
      
      <select className="rule-select" onChange={handleSelect} value={selectedRuleId}>
        <option value="">Select a rule to modify</option>
        {rules.map((rule) => (
          <option key={rule._id} value={rule._id}>
            {rule.name}
          </option>
        ))}
      </select>
      {selectedRuleId && (
        <form className="modify-rule-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rule String:</label>
            <textarea
              className="rule-textarea"
              value={ruleString}
              onChange={(e) => setRuleString(e.target.value)}
              required
              rows="4"
              cols="50"
            ></textarea>
          </div>
          <button className="submit-btn" type="submit">Update Rule</button>
        </form>
      )}
      {message && (
        <p className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ModifyRule;
