// from nofilterdata.js
var nofilterdata = data;
console.log(nofilterdata);

//Get a reference to the table body
var tbody = d3.select("tbody");
// Select the button
//var button = d3.select("#submit_button");

//-----------------------------------------------------------------//
// Function to load initial table
function init() {

  var newData = [];
  nofilterdata.forEach(obj => { 
    newData.push({"title": obj.title, "genres": obj.genres, "director": obj.director, "release_date": obj.release_date, "runtime": obj.runtime, 
                  "budget": obj.budget, "revenue": obj.revenue});  
    });

  newData.forEach(movie => {
    var row = tbody.append("tr");
    Object.entries(movie).forEach(([key, value]) => row.append("td").text(value));
  });
}
// //-----------------------------------------------------------------//
// // This function is called when submit button is clicked ***** This stops the similarity function from running.
// function updateTable() {

//   deleteTableBody();

//   var newData = [];
//   nofilterdata.forEach(obj => { 
//     newData.push({"title": obj.title, "genres": obj.genres, "director": obj.director, "release_date": obj.release_date, "runtime": obj.runtime, 
//                   "budget": obj.budget, "revenue": obj.revenue});  
//   });

//   newData.forEach(movie => {
//     var row = tbody.append("tr");
//     Object.entries(movie).forEach(([key, value]) => row.append("td").text(value));
//   });
// }
//-----------------------------------------------------------------//
// Clears table body to append new rows
function deleteTableBody() {
    tbody.selectAll("tr")
        .remove()
}
//-----------------------------------------------------------------//
// Load inital no filter movie table
init();

function hide() {
  titleId = d3.select("#displayTitle")
    .select("span")
  
  title =  titleId.text();
  console.log(title);
  //Hides it in the index.html
  if (title.substring(0,16) == "You searched for") {
    //console.log("Hidden!");
    //d3.select("#displayTitle").style.display = "none";
    document.getElementById("displayTitle").style.display = "none";
  };
}

//Create event handlers 
//button.on("click", updateTable);

