var file_location = "./static/data/female_filter.json";
var api_location = "/api/female_filter";

// Read in the data
d3.json(api_location).then(function (recommendations_data) {
    console.log(recommendations_data);
    console.log(recommendations_data[0].percent_fm);

    // Define the searched movie & title
    var searched_movie = recommendations_data[0].id;
    var searched_title = `${recommendations_data[0].title} (${recommendations_data[0].year})`;

    // console.log(searched_movie);

    // Define poster section and select the class
    var poster_section = d3.select(".posterSection");
    var poster_section_title = d3.select(".posterSectionTitle");
    var searched_poster = d3.select(".searchedPoster");

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

            // For each line
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
    var certification_text = d3.select("#certification");
    var percent_fm = d3.select("#percent_fm");

    // Append Details
    title_text.append("p").text(`${searched_title}`).classed("card-text", true);
    overview_text.text(recommendations_data[0].overview).classed("card-text", true);
    status_text.text(recommendations_data[0].status).classed("card-text", true);
    release_date_text.text(recommendations_data[0].release_date).classed("card-text", true);
    percent_fm.text(recommendations_data[0].percent_fm).classed("card-text", true);

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

    // Print out cookies
    let cookie = document.cookie;
    console.log(cookie);

    //Refresh Posters Section
    function refreshPosters(listData, female_sort_click = false) {
        var x = 0;
        // var poster_section = d3.select(".posterSection");
        // poster_section.selectAll(".card").remove()
        console.log(listData, "Dana");

        var movie_poster_empty = d3.select("#movie-poster").empty();

        // Append posters for each movie
        listData.forEach(data => {
            if (data.id == searched_movie) {
                // Append searched poster (first)
                if (movie_poster_empty) {
                    searched_poster.append("img").attr("src", data.poster_url).attr("id", "movie-poster");
                }
            } else {
                // Append div for card
                var card_div = poster_section.append("div").classed("card text-center rec-cards", true)
                    .attr("style", "width: 13rem");
                // Append image
                var poster_img = card_div.append("img")
                    .attr("src", data.poster_url)
                    .attr("id", `movie-poster-${x}`)
                    .classed("zoom poster card-img-top", true)
                    .attr("title", `${data.title}`);
                // Append card body div with elements
                var card_body_div = card_div.append("div")
                    .classed("card-body", true);
                if (female_sort_click) {
                    var fm_heading = card_body_div.append("h5")
                        .text(`${data.percent_fm} Female`);
                    var card_heading = card_body_div.append("h6")
                        .text(`${toPercent(data.similarity_score, 2)} Similar`);
                } else {
                    var card_heading = card_body_div.append("h5")
                        .text(`${toPercent(data.similarity_score, 2)} Similar`);
                    var fm_heading = card_body_div.append("h6")
                        .text(`${data.percent_fm} Female`);
                }
                var card_paragraph = card_body_div.append("p")
                    .text(split_names(data.director));
                var button_attr = card_body_div.append("a")
                    .text("Search")
                    .classed("btn btn-primary movie_buttons", true)
                    .attr("id", data.id)
                    .attr("href", "/recommendations"); // route button back to the recommendations
            }
            x++;
        });

        //WHEN THE POSTER BUTTON IS CLICKED
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
    }

    refreshPosters(recommendations_data);

    // Append the Poster Section Heading and paragraph
    poster_section_title.append("h1")
        .text(`FEMALE DIRECTED FILMS LIKE "${searched_title}":`);
    poster_section_title.append("p")
        .text(`Sort female-directed films similar to ${searched_title} by similarity score or by female percentage of cast and crew members.`)
        .attr("id", "sort_buttons_p");

    // SORT BUTTON FUNCTIONS // 

    //Female sort function
    //if .on("click", onFemaleSort) {card_div.remove then card_div.append}

    function onFemaleSort(event) {
        const listData = JSON.parse(JSON.stringify(recommendations_data));
        console.log("fm_sort recommendations_data", recommendations_data);
        listData.sort(function (a, b) {
            // add extra datatype conversion to female_sort
            var percentA = +a.percent_fm.slice(0, -1);
            var percentB = +b.percent_fm.slice(0, -1);
            return percentB - percentA;
        });
        d3.selectAll(".rec-cards").remove();
        console.log("fm_sort listData", listData);
        refreshPosters(listData, true);
    }
    //Similarity sort function
    function onSimilaritySort(event) {
        const listData = JSON.parse(JSON.stringify(recommendations_data));
        console.log("sim_sort recommendations_data", recommendations_data);
        listData.sort(function (a, b) {
            return b.similarity_score - a.similarity_score;
        });
        d3.selectAll(".rec-cards").remove();
        console.log("sim_sort listData", listData);
        refreshPosters(listData, false);
    }

    // Append female_sort button
    poster_section_title.append("a")
        .text("Female Sort")
        .classed("btn btn-primary sort_buttons", true)
        .attr("id", "female_sort_btn")
        .on("click", onFemaleSort);

    // Append similarity_sort button
    poster_section_title.append("a")
        .text("Similarity Sort")
        .classed("btn btn-primary sort_buttons", true)
        .attr("id", "similarity_sort_btn")
        .on("click", onSimilaritySort);

}); // END OF CODE