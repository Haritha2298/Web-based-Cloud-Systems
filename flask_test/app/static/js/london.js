mapboxgl.accessToken = 'pk.eyJ1Ijoibmlsc2xlaCIsImEiOiJjazczNHVscGwwOG12M3BqdDZieHJhMW82In0.c-i1H2T6u3vjmj4WY_D2mA'
    
    //Setup mapbox-gl map
    var map = new mapboxgl.Map({
        container: 'map', // container id
        center: [-0.1,51.5119112],
        zoom: 13.5,
        
      })
      map.scrollZoom.disable()
      map.addControl(new mapboxgl.Navigation());
  
      // Setup our svg layer that we can manipulate with d3
      var container = map.getCanvasContainer()
      var svg = d3.select(container).append("svg")
  
      
      function project(d) {
        
        return map.project(getLL(d));
      }
      function getLL(d) {
        return new mapboxgl.LngLat(+d.lon, +d.lat)
      }
    
      d3.csv("/static/testDots.csv", function(err, data) {
        //console.log(data[0], getLL(data[0]), project(data[0]))
        var dots = svg.selectAll("circle.dot")
          .data(data)
        
        dots.enter().append("circle").classed("dot", true)
        .attr("r", 1)
        .style({
          fill: "#0082a3",
          "fill-opacity": 0.6,
          stroke: "#004d60",
          "stroke-width": 1
        })
        .transition().duration(1000)
        .attr("r", 6)
        
        function render() {
          dots
          .attr({
            cx: function(d) { 
              var x = project(d).x;
              console.log(x)
              return x
            },
            cy: function(d) { 
              var y = project(d).y;
              return y
            },
          })
        }
  
        // re-render our visualization whenever the view changes
        map.on("viewreset", function() {
          render()
        })
        map.on("move", function() {
          render()
        })
  
        // render our initial visualization
        render()
      })
  