# Reel Change | Diversity in Film Database

Content platforms such as Netflix or Hulu use AI to recommend programs that appeal to each viewer’s unique taste. However, most of these recommendation algorithms lack an ability to suggest a more diverse array of films to viewers. Our machine learning application bridges this gap by suggesting foreign films, low-budget films, and films directed by women to users. 

We first obtained data from The Movie Database API and exported a final csv containing data on female directed films, foreign language films, and films ranging in budget. We then created a similarity matrix through Scikit-Learn’s CountVectorizer and cosine_similarity tools, which returned a sorted list of films based on each film’s unique similarity score. Data was then sorted for each endpoint in our final Flask application by percent_female_directed, foreign language, and budget bins from 0 to 15 million.

Our final application includes the following:
- A recommendation page which sorts films by similarity scores only. 
- A female focused page that displays female-directed films and percentage of female cast and crew members.
- An international page which displays an interactive map of similar foreign language films.
- A low budget page that displays films with budgets less than $15 million. 

## Folder Structure

**data_cleaning**
-	Contains our initial DataCleaning.ipynb file along with more data exploration and our final csv export.

**similarity_matrix**
-	Contains our intial similiarty_matrix.ipynb file.

**static**
-	css: Contains our CSS files for styling each page
-	data: Contains csv files
-	images: Contains our homepage image
-	js: Contains our JavaScript files for our index page and each additional endpoint.

**templates**
-	Contains each html file for our index page and each additional endpoint.

**app.py**
-	Our main python Flask application that routes data to our similarity.py app and each additional endpoint.

**requirements.txt**
-	Essential package dependencies needed for our final Heroku application.

**similarity.py**
-	Our similarity matrix that sorts by similar movies from the user’s input.  


## Screenshots 
![Screen Shot 2022-01-14 at 1 10 00 PM](https://user-images.githubusercontent.com/26308909/149588556-d5c0475b-f31b-4bf9-875b-7880949b7d5c.png)

https://user-images.githubusercontent.com/26308909/149589025-237823eb-8e96-47a6-8b51-5d68eb2fc449.mov

https://user-images.githubusercontent.com/26308909/149589286-798a4a7d-770f-49b7-9cf3-76e3e9b5cf5c.mov

https://user-images.githubusercontent.com/26308909/149589301-0fd050a5-02e4-4b50-94bb-93015631370b.mov


## Data Attribution
_Data collected from [The Movie Database](https://www.themoviedb.org/)_











