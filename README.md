Books From Afar
===============

This app is essentially a laboratory for experimenting with my <a href='http://github.com/incrediblesound/predict-likes'>predict-likes</a> node.js module. You can create users and then add books to their "likes" property from the included "library" data file (found in routes). Clicking on "find matches" will process the current user and compare their stats to all other users to find matches.

What is a match?
----------------

My original plan was to increase "serendipity" by reccomending users who match with someone you match with but who do not match with you. I got caught up, however, with the more fundamental idea of what exactly constitutes a match. This problem was solved by my recent update of the predict-likes module which adjusts the values for a given quality by comparing it to the frequency of that quality in the full data set. Previously, if 25% of a person's likes had the quality "horror" then that person would get a horror score of 25 no matter what. Now that score will be reduced to zero if %25 of the books in the total data set are horror books. This makes sense because a persons preferences should be reflected in proportions that exceed the proportions in an unorganized collection. Finding matches is now trivial: we need only select users who have positive scores for the same qualities.

How to use?
-----------

Clone the repository, then

    npm install

You will need to have Neo4j installed. In the neo4j directory type

    bin/neo4j start

Go back to the newly cloned app and type

    node app.js

Make a user at the login page and then use the username to log in. Add objects to the user's likes by clicking on them in the center column and compare their stats to others by clicking "find matches". I basically do all my work by logging all the data (watch out, after I run makeList on the data it becomes an array of numbers!) and checking the effectiveness of different mathematical operations on predicting a match. Have fun!
