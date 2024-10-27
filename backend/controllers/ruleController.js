// backend/controllers/ruleController.js
const Rule = require('../models/Rule');
const mongoose = require('mongoose');
const { parseRule } = require('../utils/parser');

// Create a new rule
exports.createRule = async (req, res) => {
  console.log("This is createRule");
  try {
    const { name, rule_string } = req.body;

    // Parse the rule string into AST
    const ast = parseRule(rule_string);
    // console.log("AST:", JSON.stringify(ast, null, 2));

    // Create and save the rule
    const newRule = new Rule({ name, ast });
    await newRule.save();

    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// THIS IS TAKING combinedRule name as optional parameter if not mention, it will override the combined_rule in database 

exports.combineRules = async (req, res) => {
  try {
    console.log("hi from combine rules: ",req.body);
    const { rule_names, operators, combined_rule_name } = req.body;

    // Default combined rule name
    const ruleName = combined_rule_name || 'combined_rule';

    // Validate that the number of operators is one less than the number of rules
    if (operators.length !== rule_names.length - 1) {
      return res.status(400).json({ error: 'Number of operators must be one less than number of rules' });
    }

    // Validate operators
    const validOperators = ['AND', 'OR'];
    for (const op of operators) {
      if (!validOperators.includes(op)) {
        return res.status(400).json({ error: `Invalid operator: ${op}` });
      }
    }

    // Check if a rule with the specified name already exists
    let combinedRule = await Rule.findOne({ name: ruleName });

    // Fetch and validate rules
    const rules = await Rule.find({ name: { $in: rule_names } });
    console.log(rules.length, rule_names.length);

      const foundNames = rules.map((rule) => rule.name);
      console.log(foundNames);
      const missingNames = rule_names.filter((name) => !foundNames.includes(name));
      console.log(missingNames,missingNames.length);
      console.log(typeof missingNames.length)
      if(missingNames.length!==0){
        console.log('haoidoazjd');
       return res.status(400).json({ error: `Rules not found: ${missingNames.join(', ')}` });
      }

    // Start combining the rules using the provided operators
    let combinedAST = rules[0].ast; // Initialize with the AST of the first rule
    console.log(combinedAST);

    for (let i = 1; i < rules.length; i++) {
      const operator = operators[i - 1];
      combinedAST = {
        type: 'operator',
        operator: operator,
        left: combinedAST,
        right: rules[i].ast,
      };
    }

    if (combinedRule) {
      // Update the existing combined rule
      combinedRule.ast = combinedAST;
      await combinedRule.save();
      return res.status(200).json({ combined_ast: combinedAST, message: 'Combined rule updated' });
    } else {
      // Save a new combined rule if it doesn't exist
      combinedRule = new Rule({
        name: ruleName,
        ast: combinedAST,
      });
      await combinedRule.save();
      return res.status(200).json({ combined_ast: combinedAST, message: 'Combined rule saved' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





exports.evaluateRule = async (req, res) => {
  try {
    const { rule_name, data } = req.body;

    const rule = await Rule.findOne({ name: rule_name });
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    const result = evaluateAST(rule.ast, data);
    res.status(200).json({ eligible: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function evaluateAST(node, data) {
  if (node.type === 'operator') {
    const left = evaluateAST(node.left, data);
    const right = evaluateAST(node.right, data);
    if (node.operator === 'AND') return left && right;
    if (node.operator === 'OR') return left || right;
    throw new Error(`Unsupported operator: ${node.operator}`);
  } else if (node.type === 'operand') {
    const attribute = node.left.value;  // Left side contains attribute
    const operator = node.operator;
    const value = node.right.value;  // Right side contains value to compare

    if (attribute in data) {
      const dataValue = data[attribute];

      switch (operator) {
        case '>':
          return dataValue > value;
        case '<':
          return dataValue < value;
        case '>=':
          return dataValue >= value;
        case '<=':
          return dataValue <= value;
        case '==':
          return dataValue == value;
        case '!=':
          return dataValue != value;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    } else {
      throw new Error(`Attribute "${attribute}" is missing in data.`);
    }
  }
  return false;
}


// Helper function to evaluate AST
function evaluateAST(node, data) {
  if (node.type === 'operator') {
    const left = evaluateAST(node.left, data);
    const right = evaluateAST(node.right, data);
    if (node.operator === 'AND') return left && right;
    if (node.operator === 'OR') return left || right;
    throw new Error(`Unsupported operator: ${node.operator}`);
  } else if (node.type === 'operand') {
    // Handle binary conditions: operator, left, right
    const operator = node.operator;
    const leftNode = node.left;
    const rightNode = node.right;

    const attribute = leftNode.value;
    let value = rightNode.value;

    // Remove quotes if present and handle string values
    if (typeof value === 'string') {
      value = value.replace(/['"]/g, '');
    }

    // Convert value to number if applicable
    if (!isNaN(value)) {
      value = Number(value);
    }

    const dataValue = data[attribute];

    // Handle undefined attributes
    if (dataValue === undefined) {
      throw new Error(`Attribute "${attribute}" is missing in the data`);
    }

    switch (operator) {
      case '>':
        return dataValue > value;
      case '<':
        return dataValue < value;
      case '>=':
        return dataValue >= value;
      case '<=':
        return dataValue <= value;
      case '==':
        return dataValue == value;
      case '!=':
        return dataValue != value;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }
  return false;
}


exports.modifyRule = async (req, res) => {
  try {
    const { rule_id } = req.params;
    const { name, rule_string } = req.body;

    // Check if the provided rule_id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(rule_id)) {
      return res.status(400).json({ error: 'Invalid rule_id format' });
    }

    // Parse the new rule string into AST (assuming parseRule is correctly implemented)
    const ast = parseRule(rule_string);

    // Find and update the rule
    const updatedRule = await Rule.findByIdAndUpdate(
      rule_id,
      { name, ast },
      { new: true, runValidators: true }
    );

    if (!updatedRule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.status(200).json(updatedRule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a rule
exports.deleteRule = async (req, res) => {
  try {
    const { rule_id } = req.params;

    const deletedRule = await Rule.findByIdAndDelete(rule_id);
    if (!deletedRule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.status(200).json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all rules
exports.getAllRules = async (req, res) => {
  try {
    const rules = await Rule.find({});
    res.status(200).json(rules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
