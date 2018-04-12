const _ = require('lodash');

let id = 0;

class Node {
  constructor(id = id, x = Math.floor(Math.random() * 100), y = Math.floor(Math.random() * 100)) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.distanceAway = Number.POSITIVE_INFINITY;
    this.pathToNode = [];
    id++;
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
    if (_.includes(n.neighbors, this)) {
      n.neighbors = n.neighbors.filter(node => node !== this);
    }
  }

  static getDistance(n1, n2) {
    return Math.sqrt(Math.pow(Math.abs(n1.x - n2.x), 2) + Math.pow(Math.abs(n1.y - n2.y), 2));
  }

  toString() {
    return `id: ${this.id}, x: ${this.x}, y: ${this.y}, neighbors: ${JSON.stringify(this.neighbors.map(n => n.id))}, distanceAway: ${this.distanceAway}, pathToNode: ${JSON.stringify(this.pathToNode.map(n => n.id))}`;
  }
}

module.exports = Node;
