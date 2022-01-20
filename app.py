from flask import Flask, render_template, redirect, request, url_for, make_response
import similarity
import time 

# JULIA ADDED: FOR SQL
import sqlalchemy
from sqlalchemy import create_engine, func
from config import db_user, db_password, db_host, db_name, db_port
import pandas as pd

# Build engine
engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

# END OF ADDED: FOR SQL

# Create an instance of Flask
app = Flask(__name__)

# JULIA ADDED: FOR SQL
# Route to low budget api
@app.route("/api/low_budget_filter")
def api_low_budget_filter():
  conn = engine.connect()

  # Read in low budget table
  results = pd.read_sql('SELECT * FROM low_budget_filter', engine)

  # Close the SQL connection
  conn.close()

  # Convert results to json
  results_json = results.to_json(orient='records') 

  return results_json
  
# Route to female api
@app.route("/api/female_filter")
def api_female_filter():
  conn = engine.connect()

  # Read in female table
  results = pd.read_sql('SELECT * FROM female_filter', engine)

  # Close the SQL connection
  conn.close()

  # Convert results to json
  results_json = results.to_json(orient='records') 

  return results_json

# Route to international api
@app.route("/api/international_filter")
def api_international_filter():
  conn = engine.connect()

  # Read in international table
  results = pd.read_sql('SELECT * FROM international_filter', engine)

  # Close the SQL connection
  conn.close()

  # Convert results to json
  results_json = results.to_json(orient='records') 

  return results_json

# Route to no filter api
@app.route("/api/no_filter")
def api_no_filter():
  conn = engine.connect()

  # Read in no filter table
  results = pd.read_sql('SELECT * FROM no_filter', engine)

  # Close the SQL connection
  conn.close()

  # Convert results to json
  results_json = results.to_json(orient='records') 

  return results_json

# Route to no duplicate api
@app.route("/api/duplicate_search")
def api_duplicate_search():
  conn = engine.connect()
  
  # Read in duplicate search table
  results = pd.read_sql('SELECT * FROM duplicate_search', engine)

  # Close the SQL connection
  conn.close()

  # Convert results to json
  results_json = results.to_json(orient='records') 

  return results_json
# END OF ADDED: FOR SQL

# Route to index.html template
@app.route("/")
def index():
  name = request.cookies.get('search')
  # Return index template
  return render_template("index.html", title=name)

# Route to similarity.py and function for ML and filter
@app.route("/recommendations", methods=['POST', 'GET'])
def recommendations():
  if request.method == 'POST':  
    # Get the title
    title = request.form['nm']
    # Run the similarity scores
    success = similarity.similarity(title)

    if(success):
      # Define the response
      resp = make_response(render_template('recommendations.html'))
      resp.set_cookie('title', title)
    else:
        resp = make_response(render_template('duplicate_movies.html'))
        resp.set_cookie('title', title)

        # resp = make_response(render_template('no_results.html'))
          
  else:
    # Get the title
    movie_id = request.cookies.get('id')
    title = request.cookies.get('title')
    # Run the similarity scores
    similarity.similarity(title)
    # Define the response
    resp = make_response(render_template('recommendations.html'))

  return resp

# Get cookies
@app.route('/getcookie')
def getcookie():
  title = request.cookies.get('title')
  return title

# Route to female focused
@app.route("/femalefocused")
def femalefocused():
  
  title = request.cookies.get('title')
  # Direct to female_filter.html
  # time.sleep(5)
  return render_template("female_filter.html")

# Route to international
@app.route("/international")
def international():
  title = request.cookies.get('title')
  # Direct to international.html
  # time.sleep(5)
  return render_template("international_filter.html")

# Route to low budget
@app.route("/lowbudget")
def lowbudget():
  title = request.cookies.get('title')
  # Direct to lowbudget.html
  # time.sleep(5)
  return render_template("low_budget_filter.html")

if __name__ == "__main__":
  app.run(debug=True)