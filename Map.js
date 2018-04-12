const _ = require('lodash');

const Node = require('./Node');

class Map {
  constructor(nodes = []) {
    this.nodes = nodes;
    this.maxNodes = 1000;
  }

  generateRandomNodes() {
    for ( let i = 0 ; i < this.maxNodes; i++ ) {
      this.nodes.push(new Node());
    }

    for (const n of this.nodes) {
      this.generateNewNeighbors(n);
    }
  }

  generateNewNeighbors(n) {
    const numberToAdd = Math.floor(Math.random() * 6);
    for (let i = 0 ; i < numberToAdd; i++) {
      const newNeighbor = this.nodes[Math.floor(Math.random() * this.maxNodes)];
      if (newNeighbor !== n && !_.includes(n, newNeighbor)) {
        n.neighbors.push(newNeighbor);
        newNeighbor.neighbors.push(n);
      }
    }
  }

  randomDestination(s) {
    let dest;
    do {
      dest = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    } while (dest === s)

    return dest;
  }
}

module.exports = Map;
