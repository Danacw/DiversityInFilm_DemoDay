// from femaledata.js
var femaledata = data;

//Get a reference to the table body
var tbody = d3.select("tbody");

// Get filter selected data and run functions to update bubble and table
$(".btn1").click(function() {
  var to100 = femaledata.filter(d => d.revenue <= 100000000);
  buildBubble(to100);
  buildTable(to100);
});
$(".btn2").click(function() {
  var to200 = femaledata.filter(d => d.revenue > 100000000 && d.revenue <= 200000000);
  buildBubble(to200);
  buildTable(to200);
});
$(".btn3").click(function() {
  var plus200 = femaledata.filter(d => d.revenue > 200000000);
  buildBubble(plus200);
  buildTable(plus200);
});
$(".btn4").click(function() {
  buildBubble(femaledata);
  buildTable(femaledata);
});
//-----------------------------------------------------------------//
// Function to build bubble plot
function buildBubble(data) {
  console.log(data);

  // Get needed data
  var revenue = data.map(d => d.revenue);
  var budget = data.map(d => d.budget);
  var similarity = data.map(d => d.similarity_score);
  score = [];
  for (var i=0; i<similarity.length; i++) {
    score.push(Math.pow(similarity[i]*50, 2)) 
  }
  var title = data.map(d => d.title);
  var genres = data.map(d => d.genres);
  var director = data.map(d => d.director);
  var release = data.map(d => d.release_date);
  var runtime = data.map(d => d.runtime);

  // Build BUBBLE
  var Hoverinfo = []
  for (i=0;i<director.length;i++){
    p = {"Title":title[i], "Genre": genres[i], "Director":director[i],
        "Release_Date":release[i],"Run_Time":runtime[i]+" min."}
    Hoverinfo.push(p)
  }
  var data = [{
    x: revenue,
    y: budget,
    text: Hoverinfo,
    type: 'scatter',
    mode: 'markers',
    marker: {
      size: score,
      color: revenue,
      colorscale: "Bluered",
    },
    hovertemplate:
    "<b>Title:</b> %{text.Title}<br><b>Genre:</b> %{text.Genre}<br><b>Director:</b> %{text.Director}<br><b>Release Date:</b> %{text.Release_Date} <br> <b>Run Time:</b>%{text.Run_Time}<extra></extra>"
  }]; //end data
  var layout = {
    title: `Female Directed Films`,
    font: { size: 13 },
    xaxis: { title: "Revenue" },
    yaxis: {title: "Budget" }
  }; // end layout
  Plotly.newPlot('bubble', data, layout);
}
//-----------------------------------------------------------------//
// Function to load table
function buildTable(data) {

  deleteTableBody();

  var newData = [];
  data.forEach(obj => { 
    newData.push({"title": obj.title, "genres": obj.genres, "director": obj.director, "release_date": obj.release_date, 
                  "runtime": obj.runtime, "budget": obj.budget, 
                  "revenue": obj.revenue, 
                  "similarity_score": obj.similarity_score.toFixed(3)});  
    });

  newData.forEach(movie => {
    var row = tbody.append("tr");
    Object.entries(movie).forEach(([key, value]) => row.append("td").text(value));
  });
}
//-----------------------------------------------------------------//
// Clears table body to append new rows
function deleteTableBody() {
  tbody.selectAll("tr").remove()
}
//-----------------------------------------------------------------//
buildBubble(femaledata);
buildTable(femaledata);
