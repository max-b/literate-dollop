/* eslint-env mocha */

const _ = require('lodash');

const Node = require('../src/Node');
const Map = require('../src/Map');
const findBestPath = require('../src/search');
const draw = require('../src/draw');

const assert = require('assert');

describe('Node', () => {
  describe('#get distance', () => {
    it('It should accurately calculate the distance between nodes', () => {
      let node1 = new Node(1, 0, 0);
      let node2 = new Node(2, 2, 0);
      assert.equal(Node.getDistance(node1, node2), 2);

      node1 = new Node(1, 1, 1);
      node2 = new Node(2, 4, 8);
      const distance = Math.sqrt((Math.abs(node1.x - node2.x) ** 2) +
        ((Math.abs(node1.y - node2.y) ** 2)));
      assert.equal(Node.getDistance(node1, node2), distance);
    });
  });

  describe('#neighbors', () => {
    it('It should add neighbors', () => {
      const node1 = new Node(1, 0, 0);
      const node2 = new Node(2, 2, 0);
      node1.addNeighbor(node2);
      assert(_.includes(node1.neighbors, node2));
    });
  });

  describe('#neighbors', () => {
    it('It should remove neighbors', () => {
      const node1 = new Node(1, 0, 0);
      const node2 = new Node(2, 2, 0);
      node1.addNeighbor(node2);
      assert(_.includes(node1.neighbors, node2));
      node1.removeNeighbor(node2);
      assert(!_.includes(node1.neighbors, node2));
    });
  });
});

describe('PathFinding', () => {
  describe('#simple best path', () => {
    it('It should acurately find the best path between two points', () => {
      const node1 = new Node(1, 0, 0);
      const node2 = new Node(2, 2, 0);
      const node3 = new Node(3, 2, 2);
      node1.addNeighbor(node2);
      node2.addNeighbor(node3);

      const map1 = new Map([node1, node2, node3]);

      const { bestPath } = findBestPath({
        map: map1,
        startNode: node1,
        dest: node3,
      });
      assert.equal(bestPath.distanceAway, 4);
      assert.deepEqual(bestPath.pathToNode, [node1, node2]);
    });
  });

  describe('#more complicated best path', () => {
    it('It should acurately find the best path between two points', () => {
      /* Looks something like:
       * 1 2
       * 3 4 6 7
       *   5 8 9
       */
      const node1 = new Node(1, 0, 0);
      const node2 = new Node(2, 1, 0);
      const node3 = new Node(3, 0, 1);
      const node4 = new Node(4, 1, 1);
      const node5 = new Node(5, 1, 2);
      const node6 = new Node(6, 2, 1);
      const node7 = new Node(7, 3, 1);
      const node8 = new Node(8, 2, 2);
      const node9 = new Node(9, 3, 2);
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
        node7, node8, node9,
      ]);

      const { bestPath } = findBestPath({
        map: map1,
        startNode: node1,
        dest: node9,
      });
      assert.equal(bestPath.distanceAway, 5);
      // assert.deepEqual(bestPath.pathToNode, [node1, node2, node4, node6, node7]);
    });
  });

  describe('#even more complicated best path with loops', () => {
    it('It should acurately find the best path between two points', () => {
      /* Looks something like:
       * 1 2 3 4
       * 5   \ 9
       *  6 7 8
       */
      const node1 = new Node(1, 0, 0);
      const node2 = new Node(2, 1, 0);
      const node3 = new Node(3, 2, 0);
      const node4 = new Node(4, 3, 0);
      const node5 = new Node(5, 0, 1);
      const node6 = new Node(6, 1, 2);
      const node7 = new Node(7, 2, 2);
      const node8 = new Node(8, 3, 2);
      const node9 = new Node(9, 3, 1);
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
        node7, node8, node9,
      ]);

      let { bestPath } = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8,
      });
      assert.equal(bestPath.distanceAway, 4.23606797749979);
      assert.deepEqual(bestPath.pathToNode, [node1, node2, node3]);

      node3.removeNeighbor(node8);

      ({ bestPath } = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8,
      }));

      assert.equal(bestPath.distanceAway, 4.414213562373095);
      assert.deepEqual(bestPath.pathToNode, [node1, node5, node6, node7]);
    });
  });

  describe('#A* improvement', () => {
    it('A* should be more efficient', () => {
      /* Looks something like:
       * 1-----------2
       * |           |
       * |   5--6    |
       * 3---4  7----8
       */
      const node1 = new Node(1, 0, 0);
      const node2 = new Node(2, 12, 0);
      const node3 = new Node(3, 0, 3);
      const node4 = new Node(4, 4, 3);
      const node5 = new Node(5, 4, 2);
      const node6 = new Node(6, 7, 2);
      const node7 = new Node(7, 7, 3);
      const node8 = new Node(8, 12, 3);
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

      const naiveResults = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8,
      });
      assert.equal(naiveResults.bestPath.distanceAway, 15);
      assert.deepEqual(naiveResults.bestPath.pathToNode, [node1, node2]);

      const heuristic = node => Node.getDistance(node, node8);

      const aResults = findBestPath({
        map: map1,
        startNode: node1,
        dest: node8,
        heuristic,
      });

      bestPath = aResults.bestPath;
      iterations = aResults.iterations;

      assert.equal(aResults.bestPath.distanceAway, 15);
      assert.deepEqual(aResults.bestPath.pathToNode, [node1, node2]);

      assert(aResults.iterations < naiveResults.iterations);
    });
  });
});
