function _slicedToArray(arr, i) {
    return (
      _arrayWithHoles(arr) ||
      _iterableToArrayLimit(arr, i) ||
      _nonIterableRest()
    );
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    // var _d = false;
    // var _e = undefined;

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      // _d = true;
      // _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        // if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function toTrainCase(str) {
    return str.toLowerCase().replace(/ /g, "-");
  }

  export function getPoints(el,mouse) {

    let elBounding = el.getBoundingClientRect();
    return [elBounding.right-10,elBounding.top+8, mouse.x,mouse.y];
  }

export function defaultPath(points, curvature) {
    var _points = _slicedToArray(points, 4),
      x1 = _points[0],
      y1 = _points[1]+10,
      x2 = _points[2],
      y2 = _points[3];

    var hx1 = x1 + Math.abs(x2 - x1) * curvature;
    var hx2 = x2 - Math.abs(x2 - x1) * curvature;
    return "M "
      .concat(x1, " ")
      .concat(y1, " C ")
      .concat(hx1, " ")
      .concat(y1, " ")
      .concat(hx2, " ")
      .concat(y2, " ")
      .concat(x2, " ")
      .concat(y2);
  }

  export function updateConnection(el, d) {
    var path = el.querySelector(".connection path");
    if (!path) throw new Error("Path of connection was broken");
    path.setAttribute("d", d);
  }

  export function createConnection(event,element, conn) {
    var _svg$classList;

    var 
      d = defaultPath(getPoints(element, event), 0.4),
      connection = conn.connection;
    var classed = !connection
      ? []
      : [
          "input-" + toTrainCase(connection.input.name),
          "output-" + toTrainCase(connection.output.name),
          "socket-input-" + toTrainCase(connection.input.socket.name),
          "socket-output-" + toTrainCase(connection.output.socket.name),
        ];
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let pathstyle = `stroke:white!important;stroke-width: 5px !important;`
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('style', pathstyle);
    let canvas = document.createElement('div');
    let style = 'width:100%;height:100%;position:fixed;top:0;left:0;text-align:left;pointer-events:none';
    canvas.setAttribute('style', style);
    (_svg$classList = svg.classList).add.apply(
      _svg$classList,
      ["connection"].concat(classed)
    );

    path.classList.add("main-path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    canvas.appendChild(svg);
    let wrapper = document.getElementById('nodeview');
    wrapper.insertBefore(canvas,wrapper.firstChild);

    wrapper.onmousemove =function(e) {
      e.stopPropagation()
      if(e.button!==0)return;

      updateConnection(canvas,defaultPath(getPoints(element, e), 0.4))
    }

    return {parent:wrapper,connector:canvas}
  }