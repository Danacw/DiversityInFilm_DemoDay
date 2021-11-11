# from app import lowbudget
import pandas as pd
import os

#To set up similarity matrix
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

#Could perform train_test_split and metrics.accuracy_score test if needed.   
#from sklearn.model_selection import train_test_split
#from sklearn.svm import SVC 
#from sklearn import metrics

def similarity(name_of_movie):
  #import csv
  df = pd.read_csv("./data_cleaning/export/movie_db.csv")
  
  # Converts user input and title dataframe column to lowercase
  name_of_movie = name_of_movie.lower()
  df["title"] = df["title"].str.lower()

  #set up new dataframe
  features = df[['index','title','release_date','cast','total_top_5_female_led','total_female_actors','percentage_female_cast','international','original_language','languages','genres','budget','budget_bins','popularity','tagline','keywords','production_companies','production_company_origin_country', 'director', 'overview']]

  #create combined_features row for similarity matrix
  def combine_features(row):
    # return row['cast']+" "+row['keywords']+" "+row['genres']+" "+row['tagline']+" "+row['production_companies']+" "+row['production_company_origin_country']
    return row['cast']+" "+row['keywords']+" "+row['genres']+" "+row['tagline']+" "+row['production_companies']+" "+row['overview']+" "+row['director']
  
  for feature in features:
    features = features.fillna('')
    features['combined_features'] = features.apply(combine_features, axis=1)

  # Added stop words
  stop_words = {'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"}
  
  #create new CountVectorizer matrix
  cv = CountVectorizer(stop_words=stop_words, analyzer='word', min_df= 10)
  count_matrix = cv.fit_transform(features['combined_features'])

  #obtain cosine similarity matrix from the count matrix
  cosine_sim = cosine_similarity(count_matrix)

  #get movie title from movie index and vice-versa
  def get_title_from_index(index): #***** IS THIS USED?????
    return features[features.index == index]["title"].values[0]

  def get_index_from_title(title):
    return features[features.title == title]["index"].values[0]

  #find similarity scores for given movie and then enmerate over it.
  movie_user_likes = name_of_movie  # User input
  movie_index = get_index_from_title(movie_user_likes)
  similar_movies = list(enumerate(cosine_sim[movie_index])) 
  similar_movies

  #Sort the list similar_movies accroding to similarity scores in descending order. Since the most similar movie to a given movie is itself, discard the first elements after sorting movies.
  sorted_similar_movies = sorted(similar_movies, key=lambda x:x[1], reverse=True)[1:]

  # Create similarity df
  similarity_df = pd.DataFrame(similar_movies, columns=["index", "similarity_score"])
  similarity_df.set_index("index", inplace=True)

  # Merge original dataframe with similarity dataframe
  #merged_df = pd.merge(similarity_df, df)
  #merged_df.sort_values(by="similarity_score", ascending=False, inplace=True)
  joined_df = df.join(similarity_df, how='outer')
  # Changes lower case back to first letter capitalized
  joined_df["title"] = joined_df["title"].str.title()

  try:
    os.remove("./static/data/nofilterdata.js")
    print("nofilterdata.js has been removed")
    os.remove("./static/data/femaledata.js")
    print("femaledata.js has been removed")
    os.remove("./static/data/intldata.js")
    print("intldata.js has been removed")
    os.remove("./static/data/lowbudgetdata.js")
    print("lowbudgetdata.js has been removed")
  except:
    print("No data files to remove")
  
  # No filter 
  nofilter = joined_df.sort_values(by="similarity_score", ascending=False)
  topnofilter = nofilter.iloc[1:21:1].to_json(orient="records")
  f = open("./static/data/nofilterdata.js", "w")
  f.write("var data = ")
  f.write(topnofilter)
  f.close()

  # Female-Led
  female_led = joined_df.sort_values(by=["percentage_female_directed", "similarity_score"], ascending=False)
  female_led.reset_index(inplace=True, drop=True)

  # If the searched title is in the dataset
  if female_led["title"][0].lower() == movie_user_likes:
    top_fem = female_led[1:21:1].to_json(orient="records")
  else:
    top_fem = female_led[:20].to_json(orient="records")

  f = open("./static/data/femaledata.js", "w")
  f.write("var data = ")
  f.write(top_fem)
  f.close()

  # International
  international = joined_df.sort_values(by=["international", "similarity_score"], ascending=False)
  international.reset_index(inplace=True, drop=True)

  # If the searched title is in the dataset
  if international["title"][0].lower() == movie_user_likes:
    top_intl = international[1:21:1].to_json(orient="records")
  else:
    top_intl = international[:20].to_json(orient="records")
    
  f = open("./static/data/intldata.js", "w")
  f.write("var data = ")
  f.write(top_intl)
  f.close()

  # Low-Budget
  low_budget = joined_df.loc[joined_df["budget_bins"] == "0 to 15m"].copy()
  low_budget = low_budget.sort_values(by=["similarity_score"], ascending=False)
  low_budget.reset_index(inplace=True, drop=True)

  # If the searched title is in the dataset
  if low_budget["title"][0].lower() == movie_user_likes:
    top_lowbudget = low_budget[1:21:1].to_json(orient="records")
  else:
    top_lowbudget = low_budget[:20].to_json(orient="records")

  f = open("./static/data/lowbudgetdata.js", "w")
  f.write("var data = ")
  f.write(top_lowbudget)
  f.close()