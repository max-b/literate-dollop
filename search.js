const _ = require('lodash');

const Node = require('./Node');
const Map = require('./Map');

const findBestPath = ({ map, startNode, dest }) => {
  map.nodes.forEach(n => n.initSearch());
  startNode.distanceAway = 0;

  const visited = [];
  const toVisit = [];

  let cursor = startNode;
  let iterations = 0;

  do {
    let minDist = Number.POSITIVE_INFINITY;

    visited.push(cursor);
    _.remove(toVisit, cursor);

    cursor.neighbors.forEach((n) => {

      const dist = Node.getDistance(cursor, n);

      if (!_.includes(toVisit, n) && !_.includes(visited, n)) {
        toVisit.push(n);
      }

      if (dist + cursor.distanceAway < n.distanceAway) {
        n.distanceAway = dist + cursor.distanceAway;
        debugger;
        n.pathToNode = [...cursor.pathToNode, cursor];
      }

    });

    cursor = _.minBy(toVisit, n => n.distanceAway);
    iterations++;

  } while (toVisit.length > 0)

  return dest;
}

module.exports = findBestPath;