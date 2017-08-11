var mymap = {

  markers: [],
  markerCount: 1,

  initMap: function() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    var chicago = {lat: 41.85, lng: -87.65}
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 5,
          center: chicago
    });
    
    directionsDisplay.setMap(map);
    
    this.initMapClick(map);
    this.initResetButton();

    document.getElementById('submit').addEventListener('click', function() {
      mymap.calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
  },

  //To add markers to the map on click
  initMapClick: function(map){
    google.maps.event.addListener(map, 'click', function(e){
      var marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            label: mymap.markerCount.toString()
      });

      mymap.addLocationForTour(mymap.markerCount, e.latLng);

      mymap.markerCount++;
      //add marker to the global markers variable
      mymap.markers.push(marker);

      //To remove markers from the map on click. Also remove from the global markers variable
      marker.addListener('click', function(){
        mymap.markers.splice(mymap.markers.indexOf(this), 1);
        mymap.removeLocationForTour(this);
        this.setMap(null);
      });

    });
  },

  //add location to the tour table
  addLocationForTour: function(locationNumber, latlong){
    var locationTable = document.getElementById('locations').getElementsByTagName('tbody')[0],
        newRow = locationTable.insertRow(locationTable.rows.length);
        x = newRow.insertCell(0),
        y = newRow.insertCell(1),
        z = newRow.insertCell(2);
        x.innerHTML = "Location " + locationNumber;
        y.innerHTML = latlong.lat();
        z.innerHTML = latlong.lng();
  },

  //remove location from the tour table
  removeLocationForTour: function(marker){
    var locationTable = document.getElementById('locations').getElementsByTagName('tbody')[0],
        cells = locationTable.getElementsByTagName('td'),
        rowToRemove;
    for(var i = 0;i < cells.length; i++){
        if(cells[i].textContent == marker.position.lat()){
          rowToRemove = cells[i].parentNode
          break;
        }
    }
    rowToRemove.remove();
  },

  initResetButton: function(){
    var button = document.getElementById('reset');
    button.onclick = function(){
      var locationTableRows = document.getElementById('locations').getElementsByTagName('tr');
      for(var i = 0;i < mymap.markers.length; i++){
        mymap.markers[i].setMap(null);
        locationTableRows[1].remove();
      }
      mymap.markers = [];
      mymap.markerCount = 1;
      
    };
  },
  
  calculateAndDisplayRoute: function(directionsService, directionsDisplay) {
    
    waypts = [];
    for(var i=1; i < mymap.markers.length-1 ; i++){
      waypts.push({location: mymap.markers[i].position, stopover: true});
    }

    directionsService.route({
      origin: mymap.markers[0].position,
      destination: mymap.markers[mymap.markers.length-1].position,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
      }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                  '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
