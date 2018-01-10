const {MerkleNode} = require('./merkle_node')
const {Direction, MerkleProofHash} = require('./merkle_proof_hash')

class MerkleTree {
  constructor () {
    this.rootNode = null
    this.nodes = []
    this.leaves = []
  }

  appendLeaf (arg) {
    const node = (typeof arg === 'string')
      ? new MerkleNode(arg) : arg
    this.nodes.push(node)
    this.leaves.push(node)
    return node
  }

  addTree (tree) {
    tree.leaves.forEach(l => this.appendLeaf(l))
    return this.buildTree()
  }

  buildTree (nodes) {
    if (nodes === undefined) nodes = this.leaves
    if (nodes.length === 1) this.rootNode = nodes[0]
    else {
      const parents = []
      for (let i = 0; i < nodes.length; i += 2) {
        const right = (i + 1 < nodes.length) ? nodes[i + 1] : null
        parents.push(new MerkleNode(nodes[i], right))
      }
      this.buildTree(parents)
    }
  }

  findLeaf (hash) {
    return this.leaves.filter(l => l.hash === hash)[0]
  }

  // audit proof
  auditProof (leafHash) {
    const auditTrail = []
    const leaf = this.findLeaf(leafHash)
    if (leaf !== undefined) this.buildAuditTrail(auditTrail, leaf.parent, leaf)
    return auditTrail
  }

  buildAuditTrail (auditTrail, parent, child) {
    if (parent !== null) {
      const [nextChild, direction] = parent.leftNode === child
        ? [parent.rightNode, Direction.LEFT] : [parent.leftNode, Direction.RIGHT]
      if (nextChild !== null) {
        auditTrail.push(new MerkleProofHash(nextChild.hash, direction))
      }
      this.buildAuditTrail(auditTrail, parent.parent, child.parent)
    }
  }

  // verify audit proof
  // consistency proof
  // verify consistency proof
}

module.exports = {MerkleTree}
