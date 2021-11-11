// Grab data from js file
var lowbudgetdata = data;

// Check proper import
console.log(lowbudgetdata);

// Get first 10 records (for table)
var slicedArray = lowbudgetdata.slice(0, 10);
// console.log(slicedArray);

// Get data needed from json (for bar graph)
var title = slicedArray.map(d => d.title);
var budget = slicedArray.map(d => d.budget);
var revenue = slicedArray.map(d => d.revenue);
var similarity = slicedArray.map(d => d.similarity_score);

// console.log(budget);
// console.log(revenue);
// console.log(similarity);

// Function to create the table
function createTable(slicedArray) {

    // CREATE TABLE:
    // Select the table titles & add to them
    var table_title = d3.select("#table-title");
    table_title.html("<h2>Films</h2>");
    
    // Select the tbody in the html table
    var tbody = d3.select("tbody");

    // Reset the html table
    tbody.html("");

    // Append a row to the tbody
    var row = tbody.append("tr");

    // Array of row titles
    var row_titles = [ "similarity_score", "title", "budget", "revenue", "popularity", "vote_avg", "genres"];

    // Append titles for each column
    row_titles.forEach(element => {
        var title = row.append("th").text(element);
    });

    // for each film in the filtered data, append a row
    slicedArray.forEach(film => {

        // console.log(film);

        // Append a row to the tbody
        var row = tbody.append("tr");

        // Append a row for each data element
        row.append("td").text(film.similarity_score);
        row.append("td").text(film.title);
        row.append("td").text(film.budget);
        row.append("td").text(film.revenue);
        row.append("td").text(film.popularity);
        row.append("td").text(film.vote_avg);
        row.append("td").text(film.genres);

    });
};

// Function to create bar chart
function createChart(title, similarity, budget) {

    // CREATE BAR CHART
    var trace1 = {
        x: title,
        y: similarity,
        type: 'bar',
        text: budget,
        marker: {
            color: '#9ED9CCFF'
            }
        };
        
    var data = [trace1];
    
    var layout = {
        title: 'Similar Low-Budget Films',
        font:{
            family: 'Spartan'
        },
        showlegend: false,
        xaxis: {
            automargin: true,
            tickangle: -45
        },
        yaxis: {
            automargin: true,
            zeroline: false,
            gridwidth: 2
        },
        bargap :0.05
    };
    
    // Append new plot
    Plotly.newPlot('bar-chart', data, layout);
}

// Run functions
createTable(slicedArray);
createChart(title, similarity, budget);
