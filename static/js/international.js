var intdata = data;
console.log(intdata);

// Create a map object
var myMap = L.map("map-id", {
    center: [10.00, 34.00],
    zoom: 3.4
  });
  
//Create layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v8",
    accessToken: API_KEY
    }).addTo(myMap);

// Create different color markers with the video camera icon according to its similarity/index
var icons = {
  TOPONE: L.ExtraMarkers.icon({
    icon: "icon ion-videocamera",
    iconColor: "white",
    markerColor: "blue",
    shape: "square"
  }),

  TOP5: L.ExtraMarkers.icon({
    icon: "icon ion-videocamera",
    iconColor: "white",
    markerColor: "green",
    shape: "square"
  }),

  TOP10: L.ExtraMarkers.icon({
    icon: "icon ion-videocamera",
    iconColor: "white",
    markerColor: "yellow",
    shape: "square"
  }),

  MID: L.ExtraMarkers.icon({
    icon: "icon ion-videocamera",
    iconColor: "white",
    markerColor: "orange",
    shape: "square"
  }),

  LOW: L.ExtraMarkers.icon({
    icon: "icon ion-videocamera",
    iconColor: "white",
    markerColor: "red",
    shape: "square"
  })
};

d3.json('/static/js/countries.json').then(function(country_data, err) {
    if (err) throw err;

    var country_list = [];
    //Get lat lng according to country 
    for (i=0; i < country_data.length; i++)
    {
        //console.log(country_data[i]);
        country_name = country_data[i].name;
        lat = country_data[i].latlng[0];
        lng = country_data[i].latlng[1];

        var country_info 
        country_info = {'country_name' : country_name, 'lat': lat, 'lng': lng};
        country_list.push(country_info);
    };//end of for loop

    //console.log(country_list);

    for (var i=0; i < intdata.length; i++) {
        console.log(intdata[i]);
        countryName = intdata[i].country_language;
        console.log('countryName: ' + countryName)
        country_index = country_list.findIndex(country => country.country_name == countryName)
        //console.log(country_index)
        //console.log(country_list[country_index])

        //Adjust actual lat lng of country according to movie index i so it doesn't layer on top of each other
        if (i%2 == 0) {
          lat = country_list[country_index].lat + (i*.05);//(Math.cbrt(i));//(.25*i));
          lng = country_list[country_index].lng - (i*.05);}//(Math.cbrt(i));//(.25*i)); 

        else {
            lat = country_list[country_index].lat - (i*.02);//(Math.cbrt(i));//(.25*i));
            lng = country_list[country_index].lng - (i*.08);//(Math.cbrt(i));//(.25*i));  
        }
        
        //Different colors depending on ranking of similarity
        if (i == 0) {
            icon=icons['TOPONE'];
        }
        else if (i > 0 && i< 5 ) {
            icon = icons['TOP5'];
        }
        else if (i >= 5 && i< 10 ) {
          icon = icons['TOP10'];
        }
        else if (i >= 10 && i < 15) {
            icon = icons['MID'];
        }
        else {
            icon = icons['LOW'];
        };

        //Add markers
        //if (data[i].international == 1) {
        L.marker([lat, lng], {icon: icon})
            .bindPopup("<h4>#" + (i+1) + ": <b>" + intdata[i].title + "</b></h4><hr>"
            + "<span><b>Country Origin: </b>" + countryName
            + "<br><b>Release Date: </b>" + intdata[i].release_date
            + "<br><b>Genre: </b>" + intdata[i].genres
            + "<br><b>Production Companies: </b>"  + intdata[i].production_companies
            + "<br><br><b>Summary: </b><br>" + intdata[i].overview + "</span>")
            .addTo(myMap); 
    }//end for loop 
    
}); //end d3.json