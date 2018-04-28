
class Map {
  constructor(nodes = []) {
    this.nodes = nodes;
  }

  dimensions() {
    const defaultCoords = {
      min: 0,
      max: 0,
    };

    const x = { ...defaultCoords };
    const y = { ...defaultCoords };

    this.nodes.forEach((n) => {
      if (n.x > x.max) {
        x.max = n.x;
      }
      if (n.y > y.max) {
        y.max = n.y;
      }
      if (n.x < x.min) {
        x.min = n.x;
      }
      if (n.y < y.min) {
        y.min = n.y;
      }
    });

    x.length = x.max - x.min;
    y.length = y.max - y.min;
    x.center = x.min + (x.length / 2);
    y.center = y.min + (y.length / 2);
    return { x, y };
  }
}

module.exports = Map;
