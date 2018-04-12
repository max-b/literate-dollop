const _ = require('lodash');

const Node = require('../Node');
const Map = require('../Map');
const findBestPath = require('../search');

var assert = require('assert');
describe('Node', function() {
  describe('#get distance', function() {
    it('It should accurately calculate the distance between nodes', function() {
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 2, 0);
      assert.equal(Node.getDistance(node1, node2), 2);

      var node1 = new Node(1, 1, 1);
      var node2 = new Node(2, 4, 8);
      const distance = Math.sqrt(Math.pow(Math.abs(node1.x - node2.x), 2) + Math.pow(Math.abs(node1.y - node2.y), 2));
      assert.equal(Node.getDistance(node1, node2), distance);
    });
  });

  describe('#neighbors', function() {
    it('It should add neighbors', function() {
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 2, 0);
      node1.addNeighbor(node2);
      assert(_.includes(node1.neighbors, node2));
    });
  });

  describe('#neighbors', function() {
    it('It should remove neighbors', function() {
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 2, 0);
      node1.addNeighbor(node2);
      assert(_.includes(node1.neighbors, node2));
      node1.removeNeighbor(node2);
      assert(!_.includes(node1.neighbors, node2));
    });
  });
});

describe('PathFinding', function() {
  describe('#simple best path', function() {
    it('It should acurately find the best path between two points', function() {
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 2, 0);
      var node3 = new Node(3, 2, 2);
      node1.addNeighbor(node2);
      node2.addNeighbor(node3);

      const map1 = new Map([node1, node2, node3]);

      const bestPath = findBestPath({
        map: map1,
        startNode: node1,
        dest: node3
      });
      assert.equal(bestPath.distanceAway, 4);
      assert.deepEqual(bestPath.pathToNode, [node1, node2]);
    });
  });

  describe('#more complicated best path', function() {
    it('It should acurately find the best path between two points', function() {
      /* Looks something like:
       * 1 2
       * 3 4 6 7
       *   5 8 9
       */
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 1, 0);
      var node3 = new Node(3, 0, 1);
      var node4 = new Node(4, 1, 1);
      var node5 = new Node(5, 1, 2);
      var node6 = new Node(6, 2, 1);
      var node7 = new Node(7, 3, 1);
      var node8 = new Node(8, 2, 2);
      var node9 = new Node(9, 3, 2);
      node1.addNeighbor(node2);
      node1.addNeighbor(node3);
      node2.addNeighbor(node3);
      node2.addNeighbor(node4);
      node4.addNeighbor(node6);
      node4.addNeighbor(node5);
      node5.addNeighbor(node8);
      node6.addNeighbor(node8);
      node6.addNeighbor(node7);
      node7.addNeighbor(node9);
      node8.addNeighbor(node9);

      const map1 = new Map([
        node1, node2, node3,
        node4, node5, node6,
        node7, node8, node9
      ]);

      const bestPath = findBestPath({
        map: map1,
        startNode: node1,
        dest: node9
      });
      assert.equal(bestPath.distanceAway, 5);
      // assert.deepEqual(bestPath.pathToNode, [node1, node2, node4, node6, node7]);
    });
  });

  describe('#even more complicated best path with loops', function() {
    it('It should acurately find the best path between two points', function() {
      /* Looks something like:
       * 1 2 3 4
       * 5   \ 9
       *  6 7 8
       */
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 1, 0);
      var node3 = new Node(3, 2, 0);
      var node4 = new Node(4, 3, 0);
      var node5 = new Node(5, 0, 1);
      var node6 = new Node(6, 1, 2);
      var node7 = new Node(7, 2, 2);
      var node8 = new Node(8, 3, 2);
      var node9 = new Node(9, 3, 1);
      node1.addNeighbor(node2);
      node1.addNeighbor(node5);
      node2.addNeighbor(node3);
      node3.addNeighbor(node4);
      node3.addNeighbor(node8);
      node4.addNeighbor(node9);
      node5.addNeighbor(node6);
      node6.addNeighbor(node7);
      node7.addNeighbor(node8);
      node9.addNeighbor(node8);

      const map1 = new Map([
        node1, node2, node3,
        node4, node5, node6,
        node7, node8, node9
      ]);

      const bestPath = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8
      });
      assert.equal(bestPath.distanceAway, 4.23606797749979);
      assert.deepEqual(bestPath.pathToNode, [node1, node2, node3]);

      node3.removeNeighbor(node8);

      const bestPath2 = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8
      });

      assert.equal(bestPath.distanceAway, 4.414213562373095);
      assert.deepEqual(bestPath.pathToNode, [node1, node5, node6, node7]);

    });
  });

  describe('#distances', function() {
    it('It should acurately find the best path when there are long distances between nodes', function() {
      /* Looks something like:
       * 1-----------2
       * |           |
       * |   5--6    |
       * 3---4  7----8
       */
      var node1 = new Node(1, 0, 0);
      var node2 = new Node(2, 12, 0);
      var node3 = new Node(3, 0, 3);
      var node4 = new Node(4, 4, 3);
      var node5 = new Node(5, 4, 2);
      var node6 = new Node(6, 7, 2);
      var node7 = new Node(7, 7, 3);
      var node8 = new Node(8, 12, 3);
      node1.addNeighbor(node2);
      node1.addNeighbor(node3);
      node2.addNeighbor(node8);
      node3.addNeighbor(node4);
      node4.addNeighbor(node5);
      node5.addNeighbor(node6);
      node6.addNeighbor(node7);
      node7.addNeighbor(node8);

      const map1 = new Map([
        node1, node2, node3,
        node4, node5, node6,
        node7, node8,
      ]);

      const bestPath = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8
      });
      assert.equal(bestPath.distanceAway, 15);
      assert.deepEqual(bestPath.pathToNode, [node1, node2]);

      node1.addNeighbor(node8);

      const bestPath2 = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8
      });

      console.log(bestPath);

      assert.equal(bestPath.distanceAway, Math.sqrt(Math.pow(12, 2) + Math.pow(3, 2)));
      assert.deepEqual(bestPath.pathToNode, [node1]);

    });
  });
});
