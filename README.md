# Diversity in Film Database

Content platforms such as Netflix or Hulu use AI to recommend programs that appeal to each viewer’s unique taste. However, most of these recommendation algorithms lack an ability to suggest a more diverse array of films to viewers. Our machine learning application bridges this gap by suggesting foreign films, low-budget films, and films directed by women to users. 

We first obtained data from The Movie Database API and exported a final csv containing data on female directed films, foreign language films, and films ranging in budget. We then created a similarity matrix through Scikit-Learn’s CountVectorizer and cosine_similarity tools, which returned a sorted list of films based on each film’s unique similarity score. Data was then sorted for each endpoint in our final Flask application by percent_female_directed, foreign language, and budget bins from 0 to 15 million.

Our final application includes the following:
- An index page which sorts films by similarity scores only. 
- A Female Focused page that displays a graph of films directed by women and their corresponding budget and revenue, plus a table of similar films.
- An International page which displays an interactive map of similar foreign language films.
- A Low Budget page that displays films with budgets less than $15 million. Plus an explore page that allows users to view a table of the most popular and least popular similar low budget films.

Users can view and interact with our final application here: https://movies-ml.herokuapp.com/

## Folder Structure

**data_cleaning**
-	Contains our initial DataCleaning.ipynb file along with more data exploration and our final csv export.

**similarity_matrix**
-	Contains our intial similiarty_matrix.ipynb file.

**static**
-	css: Contains our CSS files for styling each page.
-	data: Contains JSON files that dynamically update each time the user enters a new search. 
-	images: Contains our homepage image
-	img: Contains images for markers added to our Leaflet map for the international endpoint.
-	js: Contains our JavaScript files for our index page and each additional endpoint.

**templates**
-	Contains each html file for our index page and each additional endpoint.

**app.py**
-	Our main python Flask application that routes data to our similarity.py app and each additional endpoint.

**requirements.txt**
-	Essential package dependencies needed for our final Heroku application.

**similarity.py**
-	Our similarity matrix that sorts by similar movies from the user’s input.  

## Workflow
Owner | Description | Task
------|-------------|-----
Julia | Data Exploation | 1. Call Movie Database API and review available data. 2. Perform basic data cleaning based on necessary independent variables. 3. Build up database (csv format) with films/data.
Christopher | Create Homepage | 1. Create html and css templates for index.html. 2. Add nav bar + search bar. 3. Create a default route in flask app that routes user input to all other endpoints.
Dana | Build ML Model in Jupyter Notebook | 1. Create a similarity matrix using sklearn’s CountVectorizer and cosine_similarity libraries. 2. Transfer ML Model to similarity.py
Robin | Create Flask App | 1. Build app.py and route data to each endpoint. 2. Route to similarity.py and filter results using methods=['POST', 'GET']
Emory | Low Budget Endpoint | 1. Build JavaScript app. 2. Add an endpoint to the flask app. 3. Build html and css for Low Budget page.
Carmela | International Endpoint | 1. Build JavaScript app. 2. Add an endpoint to the flask app. 3. Build html and css for Female Focused page. 
Robin | Female Focused Endpoint | 1. Build JavaScript app. 2. Add an endpoint to the flask app. 3. Build html and css for Female Focused page.
Jacob | Host application on Heroku | 1. Add dependencies in requiqments.txt file. 2. Debug and deploy app from GitHub to Heroku.


## Screenshots 
![Screen Shot 2021-08-26 at 6 36 39 PM](https://user-images.githubusercontent.com/26308909/131066166-1bb79c15-40e8-45fc-8fda-b3fe58b423f4.png)

![Screen Shot 2021-08-26 at 6 37 30 PM](https://user-images.githubusercontent.com/26308909/131066179-6d0ef95a-9508-4ffb-9e1d-701a8ffece71.png)

![Screen Shot 2021-08-26 at 6 40 09 PM](https://user-images.githubusercontent.com/26308909/131066190-85177193-e1b7-4b9d-a523-ad4483b4bc51.png)

![Screen Shot 2021-08-26 at 6 40 40 PM](https://user-images.githubusercontent.com/26308909/131066200-b03aa624-68b3-43d9-807d-e5b075b1068e.png)


## Data Attribution
![Screen Shot 2021-08-26 at 8 28 18 PM](https://user-images.githubusercontent.com/26308909/131067407-d8ee14bc-880e-4868-9fbd-fccbe0067a7a.png)

_Data collected from [The Movie Database](https://www.themoviedb.org/)_











