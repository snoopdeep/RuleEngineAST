class ASTNode {
  constructor(type, operator = null, left = null, right = null, value = null) {
    this.type = type;
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

module.exports = ASTNode;
