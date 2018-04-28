const CliGraph = require('cli-graph');

module.exports = ({
  map, magnify = 1, xPadding = 5, yPadding = 5,
  start, end, path,
}) => {
  const { x, y } = map.dimensions();

  const graph = new CliGraph({
    height: (y.length * magnify) + yPadding,
    width: (x.length * magnify) + xPadding,
    aRatio: x.length / y.length,
    center: {
      x: (x.min * magnify) + xPadding,
      y: ((y.max * magnify) + yPadding) - 1,
    },
  });

  map.nodes.forEach(n => graph.addPoint(n.x * magnify, n.y * magnify));
  path.forEach(n => graph.addPoint(n.x * magnify, n.y * magnify, 'X'));

  graph.addPoint(start.x * magnify, start.y * magnify, 'S');
  graph.addPoint(end.x * magnify, end.y * magnify, 'E');
  return graph.toString();
};
