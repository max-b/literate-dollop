const _ = require('lodash');

const Node = require('./Node');

const findBestPath = ({
  map, startNode, dest, heuristic = () => 0,
}) => {
  map.nodes.forEach(n => n.initSearch());
  startNode.distanceAway = 0;

  const visited = [];
  const toVisit = [];

  let cursor = startNode;
  let iterations = 0;

  const evaluateNeighbors = (n) => {
    const dist = Node.getDistance(cursor, n);

    if (!_.includes(toVisit, n) && !_.includes(visited, n)) {
      toVisit.push(n);
    }

    if (dist + cursor.distanceAway < n.distanceAway) {
      n.distanceAway = dist + cursor.distanceAway;
      n.pathToNode = [...cursor.pathToNode, cursor];
    }
  };

  while (cursor !== dest) {
    visited.push(cursor);
    _.remove(toVisit, cursor);

    cursor.neighbors.forEach(evaluateNeighbors);

    cursor = _.minBy(toVisit, n => n.distanceAway + heuristic(n));
    iterations += 1;
  }

  return { bestPath: dest, iterations };
};

module.exports = findBestPath;
