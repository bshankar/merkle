const {secureHash} = require('./util')

class MerkleNode {
  constructor (args) {
    this.hash = 0
    this.leftNode = null
    this.rightNode = null
    this.parent = null
    if (arguments.length === 1 && arguments[0] instanceof String === true) {
      // this is a leaf node
      this.hash = arguments[0]
    } else {
      // this is a parent node
      this.leftNode = arguments[0]
      this.rightNode = arguments[1] === undefined ? null : arguments[1]
      this.leftNode.parent = this
      if (this.rightNode !== null) this.rightNode.parent = this
      this.computeHash()
    }
  }

  isLeaf () {
    return this.leftNode === null && this.rightNode === null
  }

  computeHash () {
    if (this.leftNode !== null) {
      this.hash = secureHash(this.leftNode.hash +
        (this.rightNode !== null) ? '' : this.rightNode.hash)
    }
  }
}

module.exports = {MerkleNode}
