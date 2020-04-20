

//MAPBOX.JS
mapboxgl.accessToken = 'pk.eyJ1Ijoibmlsc2xlaCIsImEiOiJjazczNHVscGwwOG12M3BqdDZieHJhMW82In0.c-i1H2T6u3vjmj4WY_D2mA'
    
//Setup mapbox-gl map
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [4.89, 52.366],
    //-0.1,51.5119112],
  zoom: 12,   
});

var draw = new MapboxDraw({ 
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true
  }
});

map.addControl(draw, 'top-left');



// when map loads add layers
map.on('load', function() {

   // add polygon neighborhoods outlines
   map.addSource('amsterdam-layer', {
    'type': 'geojson',
    'data': 'static/data/amsterdam.json',
  });
  map.addLayer({
    'id': 'amsterdam-layer',
    'type': 'fill',
    'source': 'amsterdam-layer',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'fill-color': 'rgba(3, 157, 252, 0.2)',
      'fill-outline-color': 'rgba(0, 0, 0, 1)'
    }
  });

  // solar panels
  map.addSource('solarPoints', {
    'type': 'geojson',
    'data': 'static/data/solarPanels.json',
    'cluster': true,
    'clusterRadius': 50,
  });

  // clusters for solar points 
  map.addLayer({
    id: 'cluster-solar',
    type: 'circle',
    source: 'solarPoints',
    filter: ['has', 'point_count'],
    paint:{
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        10,
        '#f1f075',
        50,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,10,
        30,50,
        40
      ]
    }
  });

  // cluster count number solar points
  map.addLayer({
    id: 'cluster-count-solar',
    type: 'symbol',
    source: 'solarPoints',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  // solar panels symbol itself
  map.addLayer({
  'id': 'solarPanels',
  'type': 'symbol',
  'source': 'solarPoints',
  'filter': ['!', ['has', 'point_count']],
  'layout': {
    'visibility': 'none',
    'icon-image': 'rocket-15',
    'icon-allow-overlap': true
  },
  });

  //Metro Stops
  map.addSource('metroStops', {
    'type': 'geojson',
    'data': 'static/data/metro_stops.json',
  });
  map.addLayer({
  'id': 'metro_stops',
  'type': 'circle',
  'source': 'metroStops',
  'layout': {
    'visibility': 'none',
    //'icon-image': 'marker-15',
    //'icon-allow-overlap': true
  },
  'paint': {
    'circle-radius': 5,
    'circle-color': 'red',
    'circle-opacity': 1
  }
  });


});



map.addControl(new mapboxgl.NavigationControl());
map.doubleClickZoom.disable();
map.scrollZoom.disable();

// change cursor when hovering over amsterdam neighborhoods
map.on('mouseenter', 'amsterdam-layer', function() {
  map.getCanvas().style.cursor = 'pointer';
});

// change cursor back to normal when not hovering over amsterdam neighborhoods
map.on('mouseleave', 'amsterdam-layer', function() {
  map.getCanvas().style.cursor = '';
}) ;

// Display coordinates with mouse hover
map.on('mousemove', function(e) {
  document.getElementById('cordInfo').innerHTML =
    JSON.stringify(e.point) + 
    '<br />' +
    JSON.stringify(e.lngLat.wrap());
});


// when dropdown selection is made, this function creates an object which contains counts per selection from dropdown
function createDrawnPolygon(dropdownSelection) {
  var data = draw.getAll();
  var complete_count = {};
  for (m=0; m<data.features.length; m++) {
    var polygonCoord = data.features[m].geometry.coordinates[0];
    var polygon = turf.polygon(
      [polygonCoord]
    );
    console.log('Polygon'+ m.toString());
    complete_count['Polygon' + m.toString()] = countFeatures(polygon, dropdownSelection);
  };
  console.log(complete_count);
  return complete_count;
};

// when neighborhood is clicked, this function creates and object containing the count for the neighborhood
function neighborhoodPolygon(coordinates, dropdownSelection, neighborhoodName) {
  console.log("Coordinates in neighborhood polygon");
  console.log(coordinates[0]);
  var complete_count = {};
  var hoodPolygon = turf.polygon(
    [coordinates[0]]
  );
  complete_count[neighborhoodName] = countFeatures(hoodPolygon, dropdownSelection);
  return complete_count;
};

// function to do the actual counting for neighborhoods and self drawn polygons
function countFeatures(polygon, selectedFeatures) {
  var key = selectedFeatures;
  var counts_array = [];
  var counts_object = {};
  selectedFeatures.forEach(function(listItem){
    d3.json("/static/data/" + listItem + ".json").then(function(data) {
      var markerWithin = turf.pointsWithinPolygon(data, polygon);
      //var item = {};
      counts_object[listItem] = markerWithin.features.length;
      //counts_array.push(markerWithin.features.length);
      //counts_array.push(item);  
    });
  });
  return counts_object
};

// gets the values from the dropdown menu
function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  console.log(options);
  var opt;
  for (var i=0; i<options.length; i++ ) {
    opt = options[i];
    if ( opt.selected ) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
};

// adjusts the layers specified in the dropdown
const availableOptions = ["solarPanels", "metro_stops"];

function displayLayers (datasetList){
  let difference = availableOptions.filter(x => !datasetList.includes(x));

  // visibility for selected Layers
  for (var n=0; n < datasetList.length; n++)
  {
    selected_visible = datasetList[n];
    //var visibility = map.getLayoutProperty(selected_visible, 'visibility');
    map.setLayoutProperty(selected_visible, 'visibility', 'visible');
  };

  // all nont selected layers are set to none
  for (var j=0; j < difference.length; j++)
  {
    selected_not_visible = difference[j];
    map.setLayoutProperty(selected_not_visible, 'visibility', 'none');
  }
};



////// POPUP FOR THE NEIGHBORHOOD WITH MODAL///////

map.on('dblclick', 'amsterdam-layer', function(e) {

  var coordinates = e.features[0].geometry.coordinates;
  var neighborhoodName = e.features[0].properties.name;
  
  var hoodModal = document.getElementById("neighborhood-modal");
  var hoodSpan = document.getElementById("neighborhoodX");

  var el = document.getElementById('dropdown-menu');
  var datasets = getSelectValues(el);
  var neighborhoodData = neighborhoodPolygon(coordinates, datasets, neighborhoodName);
  console.log(neighborhoodName);
  console.log(neighborhoodData);
  var dataObject = neighborhoodData[0];
  console.log("neighborhood[0]");
  console.log(JSON.stringify(dataObject));
  console.log("neighborhood[name][0]");
  var modal_output = JSON.stringify(dataObject[0]);
  console.log(modal_output);
  //open the modal
  hoodModal.style.display = "block";
  document.getElementById("neighborhood-body").innerHTML = "<p>" + modal_output + "</p>";

  // when user clicks X close the modal
  hoodSpan.onclick = function() {
    hoodModal.style.display = "none";
  };
  
  // when user clicks outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == hoodModal) {
      hoodModal.style.display = "none";
    }
  };
  console.log("Modal should appear")
});


////// POPUP FOR THE NEIGHBORHOOD WITH MODAL///////

function openPolygonModal() {
  var polyModal = document.getElementById("polygon-modal");
  var polySpan = document.getElementById("polygonX");
  
  var el = document.getElementById('dropdown-menu');
  var datasets = getSelectValues(el);
  var drawPolygonData = createDrawnPolygon(datasets);
  var modal_output = JSON.stringify(drawPolygonData.Polygon0);

  //open the modal
  polyModal.style.display = "block";
  document.getElementById("polygon-body").innerHTML = "<p></p>";


  // when user clicks X close the modal
  polySpan.onclick = function() {
    polyModal.style.display = "none";
  };
  
  // when user clicks outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == polyModal) {
      polyModal.style.display = "none";
    }
  };  
}




















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


