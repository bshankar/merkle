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
    mt.buildTree(nodes.map(s => new MerkleNode(s)))
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
})
