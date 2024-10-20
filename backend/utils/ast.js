// backend/utils/ast.js
class ASTNode {
    constructor(type, operator = null, left = null, right = null, value = null) {
      this.type = type; // 'operator' or 'operand'
      this.operator = operator; // 'AND', 'OR' for operators
      this.left = left; // Left child ASTNode
      this.right = right; // Right child ASTNode
      this.value = value; // Condition string for operands
    }
  }
  
  module.exports = ASTNode;
  