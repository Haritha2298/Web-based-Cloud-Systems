

//MAPBOX.JS
mapboxgl.accessToken = 'pk.eyJ1Ijoibmlsc2xlaCIsImEiOiJjazczNHVscGwwOG12M3BqdDZieHJhMW82In0.c-i1H2T6u3vjmj4WY_D2mA'
    
//Setup mapbox-gl map
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [4.89, 52.366],
    //-0.1,51.5119112],
  zoom: 13.5,   
});

var Draw = new MapboxDraw();

map.addControl(Draw, 'top-left');

//try the addLayer method from mapbox
map.on('load', function() {
  map.addSource('points', {
    'type': 'geojson',
    'data': '/static/solarPanels.json',
  })
map.addLayer({
  'id': 'points',
  'type': 'circle',
  'source': 'points'
  })
});


map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

/////// Load data from csv file /////
// // Setup our svg layer that we can manipulate with d3
// var container = map.getCanvasContainer()
// var svg = d3.select(container).append("svg").attr("width", 700).attr("height", 600)

// function project(d) {
//   console.log("project function is called");
//   return map.project(getLL(d));
// }
// function getLL(d) {
//   return new mapboxgl.LngLat(+d.lon, +d.lat);
// }


// // 522, 353
// // var single_dot = svg.selectAll("circle").attr("r", 20).attr("cx", 522).attr("cy", 353).style({
// //   fill: "#0082a3"
// //   });

// // "/static/testDots.csv"
// d3.csv("/static/testDots.csv").then(function(data) {
//   console.log("File is found")
//   console.log(data)
//   console.log("File should have been found")
//   var dots = svg.selectAll("circle");

//   dots = dots.data(data).enter().append("circle").attr("class", "dot")
//   dots
//   .attr("r", 10)
//   .style({
//     fill: "#0082a3"
//     });

//     function render() {
//       console.log("Render function is called");
//       dots
//       .attr("cx", function(d) {
//         var x = project(d).x;
//         console.log(x)
//         return x
//       })
//       .attr("cy", function(d) {
//         var y = project(d).y;
//         console.log(y)
//         return y
//       })
//     }

//     // re-render viz when view changes
//     map.on("viewreset", function() {
//       render()
//     })
//     map.on("move", function() {
//       render()
//     })

//     // render initial viz
//     render()
//   })
//   .catch(function(error){
//     // handle error if it is caught
//     if (error){
//       console.log(error)  
//     }  
//   })





  // if(data.length === 0){
  //   console.log("File empty")
  // }
  //console.log("error:", error)
  
//var marker = new mapboxgl.Marker().setLngLat([4.8950, 52.37]).addTo(map);

// Display coordinates with mouse hover
map.on('mousemove', function(e) {
  document.getElementById('cordInfo').innerHTML =
    JSON.stringify(e.point) + 
    '<br />' +
    JSON.stringify(e.lngLat.wrap());
});

// // add svg element to leaflet overlay pane
// var svg = d3.select(map.getPanes().overlayPane).append("svg");

// var g = svg.append("g").attr("class", "leaflet-zoom-hide");

// // attempt to put a layer on the map with amsterdam geo json file
// // // put geoJson of Amsterdam over it
// // d3.json("amsterdam.json", function(error, collection) {
// //     if (error) throw error;
// // })

// // // function to render d3 polygon to leaflet polygon
// // function projectPoint(x, y) {
// //     var point = map.latLngToLayerPoint(new L.LatLng(y, x));
// //     this.stream.point(point.x, point.y);
// // }

// // // convert geoJSON to svg
// // var transform = d3.geo.transform({point, projectPoint}),
// //     path = d3.geo.path().projection(transform);

// // var feature = g.selectAll("path")
// //     .data(collection.features)
// //     .enter().append("path");

// // feature.attr("d", path);

// // var bounds = path.bounds(collection),
// //     topLeft = bounds[0],
// //     bottomRight = bounds[1];

// // // set dimension of svg
// // svg.attr("width", bottomRight[0] - topLeft[0])
// //    .attr("height", bottomRight[1] - topLeft[1])
// //    .style("left", topLeft[0] + "px")
// //    .style("top", topLeft[1] + "px");

// // g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

// // create a fisheye distortion as magnifying glass
// var fisheye = d3.fisheye.circular()
//     .radius(100)
//     .distortion(5);

// var lens = svg.append('circle')
//     .attr('class', 'lens')
//     .attr('fill-opacity', 0.1)
//     .attr('r', fisheye.radius());

// // set bounds of svg
// svg .attr("width", 1300)
//     .attr("height", 650)
//     //.style("left", topLeft[0] + "px")
//     //.style("top", topLeft[1] + "px");

// g   .attr("transform", "translate(" + 650 + "," + 1108 + ")");



// // on mousemove move the fisheye over map
// svg.on('mousemove', function() {
//     fisheye.focus(d3.mouse(this));

//     const mouseX = d3.mouse(this)[0];
//     const mouseY = d3.mouse(this)[1];
//     const r = fisheye.radius();

//     lens.attr('cx', mouseX)
//         .attr('cy', mouseY)
// });


