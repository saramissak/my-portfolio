var map;
var pos = Math.round(Math.random() * 2);

/** Creates a map and adds it to the page. */
function createMap() {
  var bobaLatlng = {lat: 40.5192552, lng: -74.39717};
  var CMULatlng = {lat: 40.44273393240576, lng: -79.94296073913574};
  var holmdelParkLatlng = {lat: 40.3704118, lng: -74.1865324};
  var lombardiLatlng = {lat: 40.3965513, lng: -74.305296};

  var latlngs = [bobaLatlng, CMULatlng, holmdelParkLatlng, lombardiLatlng];

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: latlngs[pos],
    mapTypeId: 'hybrid',
    gestureHandling: 'greedy'
  });

  fetch('/add-marker').then(response => response.json()).then((markers) => {
      console.log(markers.length);
  });

  var bobaContentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Vivi\'s Bubble Tea</h1>'+
      '<div id="bodyContent">'+
      '<p>Vivi\'s Bubble Tea shop is a small family owned shop with lots of different option to choose from. ' +
      'The staff is super friendly and make some of the best bubble tea that I have had!</p>'+
      '<p><a href="https://www.yelp.com/biz/vivi-bubble-tea-edison-2">'+
      'https://www.yelp.com/biz/vivi-bubble-tea-edison-2</a></p>'+
      '</div>'+
      '</div>';

  makeMarker(map, bobaLatlng, bobaContentString, 'Vivi\'s Bubble Tea');
  
  var CMUContentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Carnegie Mellon University</h1>'+
      '<div id="bodyContent">'+
      '<p>Carnegie Mellon University is the college that I will be attending for my 4 years of undergrad studying Information Systems and Computer Science.' +
      ' This college is my second home and I have had some great memories with great people here.</p>'+
      '<p><a href="https://www.cmu.edu/">'+
      'https://www.cmu.edu/</a></p>'+
      '</div>'+
      '</div>';
  makeMarker(map, CMULatlng, CMUContentString, 'Carnegie Mellon University');

  var holmdelParkContentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Holmdel Park</h1>'+
      '<div id="bodyContent">'+
      '<p>Holmdel Park is a great place to just be outdoors and see beautiful scenary</p>'+
      '<p><a href="https://www.cmu.edu/">'+
      'https://www.cmu.edu/</a></p>'+
      '</div>'+
      '</div>';
  makeMarker(map, holmdelParkLatlng, holmdelParkContentString, 'Holmdel Park');

  var lombardiContentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Lombardi Field</h1>'+
      '<div id="bodyContent">'+
      '<p>Lombardi Field is the football field and the track field for my high school. This is the place I did track at throughout high school and 8th grade. ' +
      'This is a great place to go to relax and get your mind off of school work.</p>'+
      '</div>'+
      '</div>';
  makeMarker(map, lombardiLatlng, lombardiContentString, 'Lombardi Field');

  placeMarker();
}

// Given the arguments, creates a marker on the given map
function makeMarker(map, myLatlng, contentString, title) {
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: title
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function changeZoom() {
  var bobaLatlng = {lat: 40.5192552, lng: -74.39717};
  var CMULatlng = {lat: 40.44273393240576, lng: -79.94296073913574};
  var holmdelParkLatlng = {lat: 40.3704118, lng: -74.1865324};
  var lombardiLatlng = {lat: 40.3965513, lng: -74.305296};

  var latlngs = [bobaLatlng, CMULatlng, holmdelParkLatlng, lombardiLatlng];

  pos = (pos + 1) % latlngs.length;
  map.panTo(new google.maps.LatLng(latlngs[pos]));  
}

function placeMarker() {
    // Configure the click listener.
    map.addListener('rightclick', function(mapsMouseEvent) {
      var latlng = mapsMouseEvent.latLng;

      const params = new URLSearchParams();
	  params.append('latlng', latlng)
      const request = new Request('/add-marker', {method: 'POST', body: params});
      fetch(request);
      makeMarker(map, latlng, '', '');
    
      fetch('/add-marker').then(response => response.json()).then((markers) => {
        console.log(typeof markers);
        markers.forEach(line =>
          console.log(line.propertMap.latlng)
        );
      });
    });
}
