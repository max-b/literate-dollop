const _ = require('lodash');

let nodeId = 0;

class Node {
  constructor(
    id = nodeId,
    x = Math.floor(Math.random() * 100),
    y = Math.floor(Math.random() * 100),
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.distanceAway = Number.POSITIVE_INFINITY;
    this.pathToNode = [];
    nodeId += id;
  }

  initSearch() {
    this.distanceAway = Number.POSITIVE_INFINITY;
    this.pathToNode = [];
  }

  addNeighbor(n) {
    if (!_.includes(this.neighbors, n)) {
      this.neighbors.push(n);
    }
    if (!_.includes(n.neighbors, this)) {
      n.neighbors.push(this);
    }
  }

  removeNeighbor(n) {
    if (_.includes(this.neighbors, n)) {
      this.neighbors = this.neighbors.filter(node => node !== n);
    }
    n.removeNeighbor(this);
  }

  static getDistance(n1, n2) {
    return Math.sqrt((Math.abs(n1.x - n2.x) ** 2) + (Math.abs(n1.y - n2.y) ** 2));
  }

  toString() {
    return `id: ${this.id}, x: ${this.x}, y: ${this.y}, neighbors: ${JSON.stringify(this.neighbors.map(n => n.id))}, distanceAway: ${this.distanceAway}, pathToNode: ${JSON.stringify(this.pathToNode.map(n => n.id))}`;
  }
}

module.exports = Node;
