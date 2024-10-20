
// backend/utils/parser.js
const jsep = require('jsep');
const ASTNode = require('./ast');

// Extend jsep to support comparison operators and logical operators
jsep.addBinaryOp('AND', 2);
jsep.addBinaryOp('OR', 1);
jsep.addUnaryOp('NOT');

function parseRule(ruleString) {
  console.log("Parsing Rule:", ruleString);

  try {
    const expression = jsep(ruleString);
    console.log("Parsed Expression:", JSON.stringify(expression, null, 2));
    return buildAST(expression);
  } catch (err) {
    throw new Error(`Failed to parse rule string: ${err.message}`);
  }
}

// function buildAST(node) {
//   // Treat 'AND' and 'OR' as operators regardless of jsep's node type
//   if (
//     node.type === 'LogicalExpression' ||
//     (node.type === 'BinaryExpression' && (node.operator === 'AND' || node.operator === 'OR'))
//   ) {
//     const operator = node.operator.toUpperCase();
//     const left = buildAST(node.left);
//     const right = buildAST(node.right);
//     return new ASTNode('operator', operator, left, right);
//   } else if (node.type === 'BinaryExpression') {
//     const operator = node.operator;
//     const left = buildAST(node.left);
//     const right = buildAST(node.right);
//     return new ASTNode('operand', operator, left, right);
//   } else if (node.type === 'Identifier' || node.type === 'Literal') {
//     // Handle simple operands or literals
//     return new ASTNode('operand', null, null, null, node.value);
//   } else {
//     throw new Error(`Unsupported node type: ${node.type}`);
//   }
// }

function buildAST(node) {
  if (
    node.type === 'LogicalExpression' ||
    (node.type === 'BinaryExpression' && (node.operator === 'AND' || node.operator === 'OR'))
  ) {
    const operator = node.operator.toUpperCase();
    const left = buildAST(node.left);
    const right = buildAST(node.right);
    return new ASTNode('operator', operator, left, right);
  } else if (node.type === 'BinaryExpression') {
    const operator = node.operator;
    const left = buildAST(node.left);
    const right = buildAST(node.right);
    return new ASTNode('operand', operator, left, right);
  } else if (node.type === 'Identifier') {
    return new ASTNode('operand', null, null, null, node.name); // Fix: use node.name for attribute
  } else if (node.type === 'Literal') {
    return new ASTNode('operand', null, null, null, node.value);
  } else {
    throw new Error(`Unsupported node type: ${node.type}`);
  }
}


module.exports = { parseRule };


