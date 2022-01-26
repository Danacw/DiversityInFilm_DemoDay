import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import ast
import os

# DATABASE CONNECTION: ADDED BY JULIA
# Import config
from sqlalchemy import create_engine
# configure the connection string
# from config import db_user, db_password, db_host, db_name, db_port
# rds_connection_string = f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
# END OF ADDED BY JULIA

# Heroku Deployment
DATABASE_URL = os.environ['DATABASE_URL']

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# movie_title = "Shang-Chi and the Legend of the Ten Rings"
def get_movie_id(movie_title, movie_df):
    substring = "::"
    # If the substring is added to the title
    if substring in movie_title:
        # Split into title and id (list)
        title_and_id = movie_title.split("::")
        # Extract the movie id and convert to int
        movie_id = int(title_and_id[0])
        print(movie_id)
    # If the title is normal
    else:
        # Extract the movie id & grab the value
        movie_id = movie_df['id'].loc[movie_df['lowercase_title'] == movie_title]
        movie_id = movie_id.values
        movie_id = movie_id[0]

    # Return the movie id to find similar movies
    return movie_id

# Similarity Function
def similarity(movie_title):
    # connect to the database
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    movie_df = pd.read_csv("./static/data/movie_db.csv")
    movie_title = movie_title.lower()
    print(movie_title)

    # Find movie (if contains search words)
    exact_match = len(movie_df.loc[movie_df['lowercase_title'] == movie_title])

    print(exact_match)

    substring = "::"
    if(exact_match == 1):
        # Get the movie id of the title
        movie_id = get_movie_id(movie_title, movie_df)
        print("movie_id_01")
    elif substring in movie_title:
        # Get the movie id of the title
        movie_id = get_movie_id(movie_title, movie_df)
        print("movid_id_02")
        exact_match = len(movie_df.loc[movie_df['id'] == movie_id])
    else:
        # Check to see if there are multiple movies with the same name
        movie_ids = movie_df['id'].loc[movie_df['lowercase_title'].str.contains(movie_title)]
        print("movie_id_03")
    # Use Count Vectorizer to create counts for each word
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(movie_df['soup_overview'])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(count_matrix, count_matrix)

    # Reset the index - creates new column for index
    movie_df = movie_df.reset_index()
    # Create series with index & ids of movies
    indices = pd.Series(movie_df.index, index=movie_df['id']).drop_duplicates()

    # Get Similarity Scores
    def get_similarity_scores(movie_id, cosine_sim):
        
        print('start similarity scores')
        # Get the index of the movie that matches the title
        idx = indices[movie_id]

        # Get the pairwise similarity scores of all movies with that movie
        sim_scores = list(enumerate(cosine_sim[idx]))
        
        # Sort the movies based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[0], reverse=True)

        # Convert list to DataFrame
        sim_scores_df = pd.DataFrame(sim_scores, columns = ["index", "similarity_score"])
        
        print('end similarity scores')
        # Return top 10 most similar scores
        return sim_scores_df

    # Get Recommendations Information
    def get_recommendations(original_df, score_df):
        print('start get recommedations')

        # Merge movie_df with sim_scores_df
        original_df = original_df.merge(score_df, on="index")

        # Sort values
        new_df = original_df.sort_values(by="similarity_score", ascending=False)

         # Prduction Countries 
        new_df['country_list'] = ([json.dumps([country['name'] for country in ast.literal_eval(countries)]) for countries in new_df['production_countries']])
        new_df['countries'] = new_df['country_list'].str.replace("[\[\]\"']", "")
        print(new_df['countries'])

        # Genre
        new_df['genres'] = new_df['genres'].str.replace("[\[\]\"']", "")
        print(new_df['genres'][0])

        # Production Companies
        new_df['production_companies'] = new_df['production_companies'].str.replace("[\[\]\"']", "")
        print(new_df['production_companies'][0])

        # Keep selected columns
        new_df = new_df[['title', 'original_budget', 'adjusted_budget', 'production_countries', 'country_list', 'countries', 'genres', 'homepage', 'id', 'imdb_id', 'original_language', 
        'overview', 'popularity', 'release_date', 'original_revenue', 'adjusted_revenue', 'runtime', 'spoken_languages', 'status', 
        'tagline', 'vote_average', 'vote_count', 'keywords', 'cast', 'director', 'director_gender', 'percent_fm', 'producers', 'writers', 
        'production_companies', 'poster_url', 'similarity_score', 'year', 'budget_bins', 'foreign_language', 'certification']]

        # Grab searched movie title & df
        searched_movie = new_df['title'].iloc[0]
        searched_movie_df = new_df.iloc[0]
        # print(searched_movie)

        # Filter out any movies not G or PG (for G/PG movies)
        if (searched_movie_df.certification == "G"):
            new_df = new_df.loc[(new_df['certification'] == "G") | (new_df['certification'] == "PG")]
        if (searched_movie_df.certification == "PG"):
            new_df = new_df.loc[(new_df['certification'] == "G") | (new_df['certification'] == "PG")]

        # Keep movie + top 10
        no_filter_df = new_df[0:11]

        # female_filter_df = new_df.sort_values(by=["percentage_female_directed", "similarity_score"], ascending=False)
        female_filter_df = new_df.loc[new_df['director_gender'].str.contains('1')]
        # international_filter_df = new_df.sort_values(by=["foreign_language", "similarity_score"], ascending=False)
        international_filter_df = new_df.loc[new_df['foreign_language'] == 1]
        low_budget_filter_df = new_df.loc[new_df['budget_bins'] == '1 to 15m']

        # Slice into Top 10
        # Female Filter
        if(female_filter_df['title'].iloc[0] == searched_movie):
            female_filter_df = female_filter_df[0:11]
        else:
            female_filter_df = female_filter_df[0:11]
            female_filter_df.iloc[10] = searched_movie_df
            female_filter_df = female_filter_df.sort_values(by="similarity_score", ascending=False)

        # International Filter
        if(international_filter_df['title'].iloc[0] == searched_movie):
            international_filter_df = international_filter_df[0:11]
        else:
            international_filter_df = international_filter_df[0:11]
            international_filter_df.iloc[10] = searched_movie_df
            international_filter_df = international_filter_df.sort_values(by="similarity_score", ascending=False)

        # Low Budget Filter
        if(low_budget_filter_df['title'].iloc[0] == searched_movie):
            low_budget_filter_df = low_budget_filter_df[0:11]
        else:
            low_budget_filter_df = low_budget_filter_df[0:11]
            low_budget_filter_df.iloc[10] = searched_movie_df
            low_budget_filter_df = low_budget_filter_df.sort_values(by="similarity_score", ascending=False)

        # Push results to json file
        # no_filter_df.to_json("./static/data/recommendations.json", orient="records")
        # female_filter_df.to_json("./static/data/female_filter.json", orient="records")
        # international_filter_df.to_json("./static/data/international_filter.json", orient="records")
        # low_budget_filter_df.to_json("./static/data/low_budget_filter.json", orient="records")

        # ADDED: SQL
        # No filter im
        # Drop previous table
        print("drop_table_00")
        engine.execute('DROP TABLE IF EXISTS no_filter')
        print("drop_table_00.5")
        no_filter_df.to_sql(name='no_filter', con=conn, if_exists='append', index=False)
        print("drop_table_01")
        # Female-Led
        engine.execute('DROP TABLE IF EXISTS female_filter')
        female_filter_df.to_sql(name='female_filter', con=conn, if_exists='append', index=False)
        print("drop_table_02")
        # International
        engine.execute('DROP TABLE IF EXISTS international_filter')
        international_filter_df.to_sql(name='international_filter', con=conn, if_exists='append', index=False)
        print("drop_table_03")
        # Low-Budget
        engine.execute('DROP TABLE IF EXISTS low_budget_filter')
        low_budget_filter_df.to_sql(name='low_budget_filter', con=conn, if_exists='append', index=False)
        # END OF SQL
        print('end get recommedations')

        # Print titles
        # print("General Recommendations:")
        # print(no_filter_df['title'].iloc[1:11])
        # print("Female Led Recommendations:")
        # print(female_filter_df['title'].iloc[1:11])
        # print("International Recommendations:")
        # print(international_filter_df['title'].iloc[1:11])
        # print("Low Budget Recommendations:")
        # print(low_budget_filter_df['title'].iloc[1:11])
        
        # Return results with selected columns
        # return no_filter_df[['title', 'original_budget', 'adjusted_budget', 'genres', 'homepage', 'id', 'imdb_id', 'original_language', 
        # 'overview', 'popularity', 'release_date', 'original_revenue', 'adjusted_revenue', 'runtime', 'spoken_languages', 'status', 'tagline', 'vote_average', 
        # 'vote_count', 'keywords', 'cast', 'director', 'producers', 'writers', 'production_companies', 'poster_url', 'similarity_score', 'year']]
        
    # If there are multiple movies with the same title
    # if (len(movie_ids) > 1):
    if (exact_match != 1):
        # Find each movie with the same title
        find_movie = movie_df.loc[movie_df["lowercase_title"].str.contains(movie_title)]
        # print(find_movie)

        # Push results to json file
        # find_movie.to_json("./static/data/duplicates.json", orient="records")
        # SQL DUPLICATES:
        engine.execute('DROP TABLE IF EXISTS duplicate_search')
        find_movie.to_sql(name='duplicate_search', con=conn, if_exists='append', index=False)

        # Return false to app.py (loads separate page)
        return False
    else:
        print(movie_id)
        # Calculate similarity scores
        similarity_scores_df = get_similarity_scores(movie_id, cosine_sim)
        # Get list of recommended titles
        get_recommendations(movie_df, similarity_scores_df)
        # print(recommendations)

        # Push results to json file
        # recommendations.to_json("./static/data/recommendations.json", orient="records")
        print('before')
        # Close the SQL connection
        conn.close()

        print('after') 
        # Return true to app.py (loads original page)
        return True
        

# Run the functions outside of app.py
# similarity("Toy Story 3")