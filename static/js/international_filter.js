var file_location = "./static/data/international_filter.json";
var api_location = "/api/international_filter";

// Read in the data
d3.json(api_location).then(function (recommendations_data) {
    console.log(recommendations_data);

    // Define the searched movie & title
    var searched_movie = recommendations_data[0].id;
    var searched_title = `${recommendations_data[0].title} (${recommendations_data[0].year})`;

    // console.log(searched_movie);

    // Define poster section and select the class
    var poster_section = d3.select(".posterSection");
    var poster_section_title = d3.select(".posterSectionTitle");
    var searched_poster = d3.select(".searchedPoster");

    // Append the Poster Section Heading
    poster_section_title.append("h1").text(`FOREIGN LANGUAGE FILMS LIKE "${searched_title}":`);

    // Function to convert numbers to percent
    function toPercent(number, float) {
        var percent = parseFloat(number * 100).toFixed(float) + "%";
        return percent;
    }

    // Convert to US Dollars
    let dollarUS = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    // Function to split names 
    function split_names(variable) {
        if (variable) {
            // Remove brackets from string
            variable = variable.substring(1, (variable.length - 1));

            // Split into array
            var array = variable.split(",");
            var new_array = [];

            array.forEach(line => {
                // If there's an empty space at beginning of string
                if (line.substring(0, 1) == ' ') {
                    // Remove quotes
                    line = line.substring(2, (line.length - 1));
                }
                // If there is no empty space at beginning of string
                else {
                    // Remove quotes
                    line = line.substring(1, (line.length - 1));
                }

                // Add space back for page look
                line = " " + line;

                new_array.push(line);
            });
            return new_array;
        }
        else {
            return variable;
        }

    };

    // SEARCHED POSTER SECTION
    // Define detail placements
    var title_text = d3.select("#title");
    var cast_text = d3.select("#cast");
    var director_text = d3.select("#director");
    var overview_text = d3.select("#overview");
    var status_text = d3.select("#status");
    var release_date_text = d3.select("#release_date");
    var budget_text = d3.select("#budget");
    var revenue_text = d3.select("#revenue");
    var production_company_text = d3.select("#prod_comp");
    var production_countries_text = d3.select("#prod_countries");
    var certification_text = d3.select("#certification");

    // Append Details
    title_text.append("p").text(`${searched_title}`).classed("card-text", true);
    overview_text.text(recommendations_data[0].overview).classed("card-text", true);
    status_text.text(recommendations_data[0].status).classed("card-text", true);
    release_date_text.text(recommendations_data[0].release_date).classed("card-text", true);
    production_countries_text.text(recommendations_data[0].countries).classed("card-text", true);
    console.log(typeof (recommendations_data[0].country_list));
    // Get certification and append
    var certification = recommendations_data[0].certification;
    console.log(certification);

    // If certification is null, replace with "NR"
    if (certification != null) {
        certification_text.text(certification).classed("card-text", true);
    }
    else {
        certification_text.text("NR").classed("card-text", true);
    }

    // Get the Budget & Revenue
    var budget = recommendations_data[0].adjusted_budget;
    var revenue = recommendations_data[0].adjusted_revenue;

    // Format Budget & Revenue
    budget = dollarUS.format(budget);
    revenue = dollarUS.format(revenue);

    // Append info to text on page
    budget_text.text(budget).classed("card-text", true);
    revenue_text.text(revenue).classed("card-text", true);

    // Get the cast info
    var cast = recommendations_data[0].cast;
    // console.log(cast);
    // Call split names for cast
    var cast_array = split_names(cast);
    // console.log(cast_array);

    // Get the directors info
    var directors = recommendations_data[0].director;
    // console.log(directors);
    // Call split names for director
    var director_array = split_names(directors);
    // console.log(director_array);

    // Get the directors info
    var prod_comp = recommendations_data[0].production_companies;
    // console.log(prod_comp);
    // Call split names for production companies
    var prod_comp_array = split_names(prod_comp);
    // console.log(prod_comp_array);

    // Append info to page
    cast_text.text(cast_array).classed("card-text", true);
    director_text.text(director_array).classed("card-text", true);
    production_company_text.text(prod_comp_array).classed("card-text", true);

    // TOP 10 RECOMMENDATIONS POSTER SECTION
    // Create variable to count through for movie poster ids

    //Refresh Posters Section
    function refreshPosters(listData) {
        var x = 0;
        console.log(listData, "Dana");
        var movie_poster_empty = d3.select("#movie-poster").empty();
        var sort_container = poster_section.append("div").attr("id", "sort-id").classed("center", true);
        // Append poster for movie searched
        listData.forEach(data => {
            if (data.id == searched_movie) {
                // Make sure searched movie isn't appended mulitple times.
                if (movie_poster_empty) {
                    searched_poster.append("img").attr("src", data.poster_url).attr("id", "movie-poster");
                }
            } else {
                // Append div for card within sort_container
                var card_div = sort_container.append("div").classed("card text-center rec-cards", true)
                    .attr("style", "width: 13rem");
                // Append image
                var poster_img = card_div.append("img")
                    .attr("src", data.poster_url)
                    .attr("id", `movie-poster-${x}`)
                    .classed("zoom poster card-img-top", true)
                    .attr("title", `${data.title}`);
                // Append card body div with elements
                var card_body_div = card_div.append("div")
                    .classed("card-body", true); var button_attr = card_body_div.append("a");
                var card_heading = card_body_div.append("h5")
                    .text(`${toPercent(data.similarity_score, 2)} Similar`);
                var card_paragraph = card_body_div.append("p")
                    .text(split_names(data.spoken_languages));
                var button_attr = card_body_div.append("a")
                    .text("Search")
                    .classed("btn btn-primary movie_buttons", true)
                    .attr("id", data.id)
                    .attr("href", "/recommendations"); // route button back to the recommendations
            }
            x++;
        });

        // WHEN THE POSTER BUTTON IS CLICKED
        d3.selectAll("a.movie_buttons").on("click", function () {
            // Save movie id & title
            var movie_id = this.id;
            // console.log(movie_id);
            var movie_title;
            // Get movie title from id
            listData.forEach(x => {
                if (x.id == movie_id) {
                    movie_title = x.title;
                }
            });
            // Movie Title to push back to search
            console.log(movie_title);
            document.cookie = `title= "${movie_id}::${movie_title}"`;
        });
        // Print out cookies
        let cookie = document.cookie;
        console.log(cookie);
    }

    refreshPosters(recommendations_data);

    // MAP SECTION //

    // Define map section and select the class
    // Create a map object
    // var myMap = L.map("map-id");

    // //Create layer
    // var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "light-v8",
    //     accessToken: MB_API_KEY
    // }).addTo(myMap);

    // VIEW BUTTON FUNCTIONS // 

    //onMapView function
    function onMapView(event) {
        // Remove rec-cards
        d3.selectAll("#sort-id").remove();
        poster_section.append("div").attr("id", "map-id").classed("center", true);
        //Add map section
        var myMap = L.map("map-id", {
            center: [20.00, 30.00],
            zoom: 2.4,
            class: "map",
        });
        //Add layer
        var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "outdoors-v11",
            accessToken: MB_API_KEY
        }).addTo(myMap);
        // Create different color markers with the video camera icon according to its similarity/index
        var icons = {
            TOPONE: L.ExtraMarkers.icon({
                icon: "icon ion-videocamera",
                iconColor: "white",
                markerColor: "blue",
                shape: "square"
            }),

            TOP4: L.ExtraMarkers.icon({
                icon: "icon ion-videocamera",
                iconColor: "white",
                markerColor: "green",
                shape: "square"
            }),

            TOP7: L.ExtraMarkers.icon({
                icon: "icon ion-videocamera",
                iconColor: "white",
                markerColor: "yellow",
                shape: "square"
            }),

            TOP10: L.ExtraMarkers.icon({
                icon: "icon ion-videocamera",
                iconColor: "white",
                markerColor: "orange",
                shape: "square"
            })
        };
        //loop through countries json
        d3.json('/static/js/countries.json').then(function (country_data, err) {
            if (err) throw err;

            var country_list = [];
            //Get lat lng according to country 
            for (i = 0; i < country_data.length; i++) {
                //console.log(country_data[i]);
                country_name = country_data[i].name;
                lat = country_data[i].latlng[0];
                lng = country_data[i].latlng[1];

                var country_info;
                country_info = { 'country_name': country_name, 'lat': lat, 'lng': lng };
                country_list.push(country_info);
                // console.log(country_list);
            };//end of for loop

            for (var i = 1; i < recommendations_data.length; i++) {
                console.log(recommendations_data[i]);
                countryName = recommendations_data[i].countries.split(",")[0];
                console.log('countryName: ' + countryName);
                country_index = country_list.findIndex(country => country.country_name == countryName);
                console.log("COUNTRY INDEX", country_index);

                //Adjust actual lat lng of country according to movie index i so it doesn't layer on top of each other
                if (i % 2 == 0) {
                    lat = country_list[country_index].lat + (i * .09);//(Math.cbrt(i));//(.25*i));
                    lng = country_list[country_index].lng - (i * .09);
                }//(Math.cbrt(i));//(.25*i)); 

                else {
                    lat = country_list[country_index].lat - (i * .02);//(Math.cbrt(i));//(.25*i));
                    lng = country_list[country_index].lng - (i * .08);//(Math.cbrt(i));//(.25*i));  
                }

                //Different colors depending on ranking of similarity
                if (i == 1) {
                    icon = icons['TOPONE'];
                }
                else if (i > 1 && i <= 4) {
                    icon = icons['TOP4'];
                }
                else if (i >= 5 && i < 7) {
                    icon = icons['TOP7'];
                }
                else if (i >= 7 && i <= 10) {
                    icon = icons['TOP10'];
                }
                else {
                    icon = icons['LOW'];
                };

                //Add markers
                //if (data[i].international == 1) {
                L.marker([lat, lng], { icon: icon })
                    .bindPopup("<h4>#" + (i) + ": <b>" + recommendations_data[i].title + "</b></h4><hr>"
                        + "<span><b>Country Origin: </b>" + countryName
                        + "<br><b>Release Date: </b>" + recommendations_data[i].release_date
                        + "<br><b>Genre: </b>" + recommendations_data[i].genres
                        + "<br><b>Production Companies: </b>" + recommendations_data[i].production_companies
                        + "<br><br><b>Summary: </b><br>" + recommendations_data[i].overview + "</span>")
                    .addTo(myMap);
            }//end for loop 
        });
    }

    //Similarity view function
    function onSimilarityView(event) {
        d3.selectAll("#map-id").remove();
        const listData = JSON.parse(JSON.stringify(recommendations_data));
        console.log("sim_sort recommendations_data", recommendations_data);
        listData.sort(function (a, b) {
            return b.similarity_score - a.similarity_score;
        });
        console.log("WAT2 listData", listData);
        // refreshPosters(listData)
        // d3.selectAll(".rec-cards").remove();
        d3.select("#map-id").remove();
        console.log("sim_sort listData", listData);
        refreshPosters(listData);
    }

    // Append map view button
    poster_section_title.append("a")
        .text("Map View")
        .classed("btn btn-primary map_button sort_buttons", true)
        .attr("id", "map_view_btn")
        .on("click", onMapView);

    // Append similarity view button
    poster_section_title.append("a")
        .text("Similarity Sort")
        .classed("btn btn-primary sort_buttons", true)
        .attr("id", "similarity_sort_btn")
        .on("click", onSimilarityView);


}); // END OF CODE