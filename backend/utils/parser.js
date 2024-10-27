const jsep = require("jsep");
const ASTNode = require("./ast");

jsep.addBinaryOp("AND", 2);
jsep.addBinaryOp("OR", 1);
jsep.addUnaryOp("NOT");

function parseRule(ruleString) {
  try {
    const expression = jsep(ruleString);
    return buildAST(expression);
  } catch (err) {
    throw new Error(`Failed to parse rule string: ${err.message}`);
  }
}

function buildAST(node) {
  if (
    node.type === "LogicalExpression" ||
    (node.type === "BinaryExpression" &&
      (node.operator === "AND" || node.operator === "OR"))
  ) {
    const operator = node.operator.toUpperCase();
    const left = buildAST(node.left);
    const right = buildAST(node.right);
    return new ASTNode("operator", operator, left, right);
  } 
  else
   if (node.type === "BinaryExpression") {
    if (node.left.type !== "Identifier") {
      // throw new Error(
      //   "Invalid rule format: Left side of a condition must be a variable."
      // );
    }
    if (node.right.type !== "Literal") {
      // throw new Error(
      //   "Invalid rule format: Right side of a condition must be a value."
      // );
    }

    const operator = node.operator;
    const left = buildAST(node.left);
    const right = buildAST(node.right);
    return new ASTNode("operand", operator, left, right);
  } else if (node.type === "Identifier") {
    return new ASTNode("operand", null, null, null, node.name);
  } else if (node.type === "Literal") {
    return new ASTNode("operand", null, null, null, node.value);
  } else {
    throw new Error(`Unsupported node type: ${node.type}`);
  }
}

module.exports = { parseRule };
