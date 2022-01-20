var file_location = "./static/data/duplicates.json";
var api_location = "/api/duplicate_search";


d3.json(api_location).then(function(duplicate_data) {
    console.log(duplicate_data);

    // Define poster section and select the class
    var poster_section = d3.select(".posterSection");

    if(duplicate_data.length == 0) {
        // Append div for card
        var card_div = poster_section.append("div").classed("card text-center", true)
            .attr("style", "width: 50rem; padding: 20px");
        var card_heading = card_div.append("h3")
            .text('No movies found! Please search for a different title.');
    }

    var x = 0;
    // Append posters for each movie
    duplicate_data.forEach(data => {
        // Append div for card
        var card_div = poster_section.append("div").classed("card text-center", true)
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
        var card_heading = card_body_div.append("h5")
            .text(data.title);
        var card_paragraph1 = card_body_div.append("p")
            .text(`${data.release_date}`);
        var card_paragraph2 = card_body_div.append("p")
            .text(`ID: ${data.id}`);
        var button_attr = card_body_div.append("a")
            .text("Select")
            .classed("btn btn-primary movie_buttons", true)
            .attr("id", data.id)
            .attr("href", "/recommendations");
            
            x++;          
    });

    // WHEN THE POSTER BUTTON IS CLICKED
    d3.selectAll("a.movie_buttons").on("click", function() {
        var movie_id = this.id;
        // console.log(movie_id);
        var movie_title;
    
        // Get movie title from id
        duplicate_data.forEach(x => {
            if (x.id == movie_id) {
                movie_title = x.title;
            }
        })
        // Movie Title to push back to search
        console.log(movie_title);
        document.cookie = `title= "${movie_id}::${movie_title}"`;
        // document.cookie = `id= ${movie_id}`;
        // Print out cookies
        let cookie = document.cookie;
        console.log(cookie);
    });
        
        
})

