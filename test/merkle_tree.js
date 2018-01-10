const assert = require('assert')
const {MerkleTree} = require('../src/merkle_tree')
const {MerkleNode} = require('../src/merkle_node')
const {secureHash} = require('../src/util')

describe('MerkleTree', function () {
  const mt = new MerkleTree()
  describe('append one leaf h(hi)', function () {
    mt.appendLeaf('hi')
    it('nodes[0] == h(hi)', function () {
      assert.equal(mt.nodes[0].hash, secureHash('hi'))
    })
    it('nodes length is 1', function () {
      assert.equal(mt.nodes.length, 1)
    })
    it('leaves length is 1', function () {
      assert.equal(mt.leaves.length, 1)
    })
  })

  describe('build tree (with 3 leaves)', function () {
    const nodes = ['hi', 'there', 'what']
    const mt = new MerkleTree()
    mt.nodes = mt.leaves = nodes.map(s => new MerkleNode(s))
    mt.buildTree()
    describe('basic binary tree checks', function () {
      it('hash of root left left child matches', function () {
        assert.equal(mt.rootNode.leftNode.leftNode.hash, secureHash('hi'))
      })
      it('hash of root left right child matches', function () {
        assert.equal(mt.rootNode.leftNode.rightNode.hash, secureHash('there'))
      })
      it('hash of root left child matches', function () {
        assert.equal(mt.rootNode.leftNode.hash, secureHash(secureHash('hi') + secureHash('there')))
      })
      it('verify hashes of all nodes (using inbuilt function)', function () {
        assert.equal(mt.nodes.every(n => n.verifyHash() === true), true)
      })
    })

    describe('audit proof on this tree', function () {
      const existingHash = secureHash('hi')
      const nonExistingHash = secureHash('hello')
      it('audit proof of non-existing node should return empty list', function () {
        assert.equal(mt.auditProof(nonExistingHash).length, 0)
      })
      it('audit proof of an existing leaf should be non empty', function () {
        assert.notEqual(mt.auditProof(existingHash).length, 0)
      })
      it('verify audit proof returns true for hi', function () {
        const trail = mt.auditProof(existingHash)
        assert.equal(mt.verifyAuditProof(mt.rootNode.hash, existingHash, trail), true)
      })
      it('verify audit proof returns true for what', function () {
        const trail = mt.auditProof(secureHash('what'))
        assert.equal(mt.verifyAuditProof(mt.rootNode.hash, secureHash('what'), trail), true)
      })
    })
  })
})
