#import pandas as pd
from flask import Flask, render_template, request, make_response
import similarity
import time

# Create an instance of Flask
app = Flask(__name__)

# Route to index.html template
@app.route("/")
def index():
  name = request.cookies.get('search')
  # Return index template
  time.sleep(1)
  return render_template("index.html", title=f"You searched for: {name}")

# Route to similarity.py and function for ML and filter
@app.route("/similarity_scores", methods=['POST', 'GET'])
def similarity_scores():
  # Get the title
  if request.method == 'POST':  
    title = request.form['nm']
    try: 
      # Define the name of movie
      name_of_movie = similarity.similarity(title)
    except IndexError:
      time.sleep(1)
      return render_template("index.html", title=f"{title} is not a vaild entry.  Please try again!")

  # Define the response
  title = title.title()
  time.sleep(1)
  resp = make_response(render_template('searched.html', title=f"You searched for: {title}"))
  resp.set_cookie('search', title)

  return resp

# Get cookies
@app.route('/getcookie')
def getcookie():
  name = request.cookies.get('search')
  return name

# Route to female focused
@app.route("/femalefocused")
def femalefocused():
  name = request.cookies.get('search')
  # Direct to femalefocused.html
  time.sleep(1)
  return render_template("femalefocused.html", title=name)

# Route to international
@app.route("/international")
def international():
  name = request.cookies.get('search')
  # Direct to international.html
  time.sleep(1)
  return render_template("international.html", title=name)

# Route to low budget
@app.route("/lowbudget")
def lowbudget():
  name = request.cookies.get('search')
  # Direct to lowbudget.html
  time.sleep(1)
  return render_template("low_budget.html", title=name)
# Route to main explore page
@app.route("/explore")
def explore():
  # Direct to explore.html
  time.sleep(1)
  return render_template("explore.html")

# Route to main low-budget explore
@app.route("/explore/low_budget")
def explore_lowbudget():
  # Direct to explore.html
  time.sleep(1)
  return render_template("em_low_budget.html")

# Route to popular low-budget explore
@app.route("/explore/low_budget/popular")
def explore_pop_lowbudget():
  # Direct to explore.html
  time.sleep(1)
  return render_template("em_pop_low.html")

# Route to unpopular low-budget explore
@app.route("/explore/low_budget/unpopular")
def explore_unpop_lowbudget():
  # Direct to explore.html
  time.sleep(1)
  return render_template("em_unpop_low.html")

if __name__ == "__main__":
  app.run(debug=True)