# SQLease
Guided SQL query generator

## Problem
Building SQL queries to retrieve data from a database can be challenging. Both for people who are just getting started with SQL and even for seasoned developers who need to build more complex queries, it can be very easy to get lost.

## Our Solution
SQLease allows users to visualize their database and automatically constructs their query in a simple step-by-step process. We reimagined the format of a typical SQL query, and broke it into 3 main sections: starting with FROM, then SELECT, and then WHERE. 

In the FROM section, the user chooses the tables and any necessary join conditions. Then in SELECT, the user chooses the columns desired in each table. And lastly, in WHERE the user provides the conditions on how to filter their data. These simple selections we ask the user to make get automatically constructed into a valid SQL query, that the user can then copy and paste into their preferred SQL query environment. We also include a preview of the resulting table for reference.

## Connect and Structure Demo

![](public/demo/Connect_Structure_Demo.gif)

## From Section Demo

![](public/demo/From_Section.gif)

## Select and Where Demo

![](public/demo/Select_Where.gif)

Check out our deployed site on Heroku: https://sequelease.herokuapp.com/