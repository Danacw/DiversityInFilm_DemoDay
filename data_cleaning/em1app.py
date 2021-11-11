from flask.helpers import url_for
from splinter import Browser
from bs4 import BeautifulSoup as soup
import pandas as pd
from pandas import DataFrame, read_csv
import datetime as dt
from webdriver_manager.chrome import ChromeDriverManager
from flask import Flask, render_template, url_for

app = Flask(__name__)

#@app.route('/', methods=("POST", "GET"))
#def html_table():

    #return render_template('lowbudget2.html',  tables=[popular_low_budget.to_html(classes='data')], titles=df.columns.values)

@app.route('/')
def html_table(lowest):
    x = pd.DataFrame(np.random.randn(20, 5))
    return render_template("lowbudget.html", name=lowest, data=x.to_html())

file_to_load = "data_cleaning\export\movie_db.csv"
lowest_budget = pd.read_csv(file_to_load)

lowest_total_budget = lowest_budget.loc[:, ["title", "budget", "budget_bins", "popularity"]]
#print(lowest_total_budget)

popular_low_budget = lowest_total_budget.sort_values("popularity", ascending=True).nsmallest(10, "popularity")
popular_sorted = popular_low_budget.sort_values("budget", ascending=True)
#print(popular_sorted)
#print(popular_low_budget)
#popular_sorted.to_html(header=True, table_id="popular_sorted")

#lowest_budget_sorted = lowest_total_budget.sort_values("budget", ascending=True).nsmallest(10, "budget")
#print(lowest_budget_sorted)
#lowest_budget_sorted.to_html("low.html")
#html_file = lowest_budget_sorted.to_html()

#least_popular = lowest_total_budget.sort_values()
#popular_sorted = least_popular.sort_values("budget", ascending=True)
#print(popular_sorted)
#print(least_popular)

