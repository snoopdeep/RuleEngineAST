// backend/controllers/ruleController.js
const Rule = require('../models/Rule');
const { parseRule } = require('../utils/parser');

// Create a new rule
exports.createRule = async (req, res) => {
  console.log("This is createRule");
  try {
    const { name, rule_string } = req.body;

    // Parse the rule string into AST
    const ast = parseRule(rule_string);
    console.log("AST:", JSON.stringify(ast, null, 2));

    // Create and save the rule
    const newRule = new Rule({ name, ast });
    await newRule.save();

    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Combine multiple rules

// override combine_rule 
exports.combineRules = async (req, res) => {
  try {
    const { rule_names, operator } = req.body;

    // Check if a rule with the name 'combined_rule' already exists
    let combinedRule = await Rule.findOne({ name: 'combined_rule' });

    // Combine the rules
    let combinedAST = null;
    const rules = await Rule.find({ name: { $in: rule_names } });

    rules.forEach((rule) => {
      if (!combinedAST) {
        combinedAST = rule.ast;
      } else {
        combinedAST = {
          type: 'operator',
          operator: operator || 'OR',
          left: combinedAST,
          right: rule.ast,
        };
      }
    });

    if (combinedRule) {
      // Update the existing combined rule
      combinedRule.ast = combinedAST;
      await combinedRule.save();
      return res.status(200).json({ combined_ast: combinedAST, message: 'Combined rule updated' });
    } else {
      // Save a new combined rule if it doesn't exist
      combinedRule = new Rule({
        name: 'combined_rule',
        ast: combinedAST,
      });
      await combinedRule.save();
      res.status(200).json({ combined_ast: combinedAST, message: 'Combined rule saved' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// exports.combineRules = async (req, res) => {
//   try {
//     const { rule_names, operator } = req.body;  // Use operator to combine, e.g., AND/OR

//     const rules = await Rule.find({ name: { $in: rule_names } });

//     if (rules.length !== rule_names.length) {
//       return res.status(404).json({ error: 'One or more rules not found' });
//     }

//     let combinedAST = null;
//     rules.forEach((rule) => {
//       if (!combinedAST) {
//         combinedAST = rule.ast;
//       } else {
//         combinedAST = {
//           type: 'operator',
//           operator: operator || 'OR',  // Default to OR if not specified
//           left: combinedAST,
//           right: rule.ast,
//         };
//       }
//     });

//      // Save the combined rule as a new rule in the database
//      const combinedRule = new Rule({
//       name: 'combined_rule', // You can change this name dynamically if needed
//       ast: combinedAST
//     });
    
//     await combinedRule.save();

//     res.status(200).json({ combined_ast: combinedAST });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// Evaluate a rule against data
// exports.evaluateRule = async (req, res) => {
//   try {
//     const { rule_name, data } = req.body;

//     // Fetch the rule
//     const rule = await Rule.findOne({ name: rule_name });
//     if (!rule) {
//       return res.status(404).json({ error: 'Rule not found' });
//     }
//     console.log('Evaluating Rule:', rule.name);
//     console.log('AST:', JSON.stringify(rule.ast, null, 2));
//     console.log('Data:', JSON.stringify(data, null, 2));

//     // Evaluate the AST
//     const result = evaluateAST(rule.ast, data);
//     console.log('Evaluation Result:', result);

//     res.status(200).json({ eligible: result });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

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

// Modify a rule
exports.modifyRule = async (req, res) => {
  try {
    const { rule_id } = req.params;
    const { name, rule_string } = req.body;

    // Parse the new rule string into AST
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
