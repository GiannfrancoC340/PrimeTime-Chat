# Web Development Final Project - *PrimeTime Chat*

This project was created by **Giannfranco Crovetto**

This web app: **A sports forum that allows every sports fan to have a say in any sports discussion.**

Deployment Link: https://melodious-baklava-dda4f0.netlify.app/ - (Used Netlify Drop, will work on proper deployment using Netlify CLI).

## Overview

In our final project, we are tasked with creating a an entire forum surrounding our favorite topic. The web app will allow users to create posts and see a feed of them on the home page, edit, delete, or leave comments underneath them for discussions, and give upvotes for any post.

To give an overview of this project, I decided to build my forum app about sports. When the user launches the app, they must login or signup for an account if they do not have one. Once done, the user is taken to the home page where they can see all the posts. They can click on a post and see the description, title, upvotes, creation date, comments. The user is able to comment on any post, and reply to any comments. They can also edit their comments and delete comments, plus sort the comments by creation date. Going back to the home page, the user can create a post, they must type their title and description and be able to post it. They can edit their post and delete their post if they choose. The user can vote a post, whether it be upvote once or downvote once, and it gets tracked instantly. Each post has a user-friendly UI that makes the experience seamless to enjoy.

## Time Spent

Time spent: **8 hours and 42 minutes** spent in total

To recover the project, it took me **3 hours** in total

Time spent in total (1st build + 2nd build): **11 hours and 42 minutes**

## Required Features

The following **required** functionality is completed:


- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - ~~an image added as an external image URL~~
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - ~~image~~
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [ ] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [ ] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [ ] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] User authentication to allow users to create an account or sign in if they have one
* If the user has an account, they can log in
* If they do not, then the user can sign up for an account
* Having an account will display their username on all posts and comments, and other users can see that
  * Only users who are signed in will edit and delete posts and comments

## Process

This project involved a lot of planning, modularity, and expansive code design to come up with an idea of how to go about this project. I was not worried about completing this project as I knew I could finish it on time, and have all of the required deliverables completed. I used my knowledge that I gained from this class to full force, and I can say it helped me big time. I used Claude as a tool and guide to help me navigate my project, and to help me design a plan on how to start and finish this project. I found Claude especially useful when I was stuck on any code, and to debug errors. Also, it was extremely useful for the database integration, and cloud deployment features. The first thing I wanted to do was to get a simple navbar template going, as I knew how to do that. Then I began to work on the user login as I already knew how to do that from a personal project, then came along react routing, and slowly the home page. I spent 2 hours working on the first day but the code was not polished or complete, there were bugs and incomplete features.

I took a small 3 day break and went straight to work on implementing CRUD operations, comments, upvotes, replies, and username tracking across various accounts. It took me some time but I managed to complete all the important functionalities, and also the small tidbits like name change, adding my name and Znumber, CSS formatting, and clean UI design. The cloud deployment was tricky as I had watched the lecture but I was slightly lost on the Netlify CLI. I decided to go with Netlify because it was the first option. I created an account, and went to upload from the user creation but the FAU class organization was private so I resorted to CLI and Netlify Drop. I asked Claude for help and it was quite responsive and commendable. It made it an easy transition, and funny enough I could not find the build folder after I ran "npm run build", but the "dist" folder was fine instead of the "build" folder. I uploaded my .env files to Netlify Drop and voila, it ran perfectly. I was so excited when I saw it worked as I had spend almost 2 hours on Friday night, just looking at my code, making sure it looks good and finding any small bugs and nitpicking any code I did not like. But regardless, I am extremely proud of the work I put in and I hope everyone enjoys!!

Some things I learned from this project are cloud deployment using Netlify and Netlify Drop, the practice of using a .env file to store important database credentials + updating the .gitignore to hide the .env, mainly used to protect code from hackers. I did not know this tip and I am glad Professor Jaramillo explained it to us in the last lecture. I also strengthened my knowledge and practice on CRUD operations, database integration and storage of users, and posts, user login/authentication, and CRUD storage with a database.

### Relaunch

I decided to relaunch the project almost 5 months after I last worked on the project, and submitted it. It was April 27, 2025 when I last worked on it and I am relaunching the project on September 22, 2025. All done in 3 hours today, the 22nd of September. When I first got started, I realized since it has been more than 90 days since I last worked on the project, that the database was no longer accessible. So, I had to create the project from scratch. It was no problem for me as I had the code documented on GitHub from back in April. 

First, I created a new folder on VS Code to hold the project, called PrimeTime Chat. Here, I would have more freedom to continue working on it later on, as with the first iteration, it was a final project for my Web Development class so I had a due date. Now, I do not so I can freely work on it when I can. I installed the necessary packages, files, dependencies, and initialized the project to GitHub. Then, I began to create all the required files and folders, and copied the code onto these various files. This part was easy as I had to track which files to copy code into. It was tedious but it was simple. Next, I had to create the database on Supabase, and update the API keys + update the gitignore and environmental file to store these keys. 

Then, became the hard part - I had to recreate the database tables and SQL queries. Since I could not access the old database, I had to create them from scratch. So I went through the 4 Claude chat histories and scrolled through each prompt, one by one, to find the necessary information. At first, I copied the wrong tables and I had to delete them. It was a blunder on my end so I started on square 1 again. I created the Posts table first in the table editor, then realized I needed to add the SELECT and INSERT policies under the Posts table. I got that going and it took some time to work as I haven't worked in Supabase for months, so I felt rusty. Luckily I managed to figure it out and get things rolling. Next, came the other 2 policies - UPDATE and DELETE - to the policies section, it was easy. Then I realized I need to create the PostVotes table, and add the transactions helper functions SQL to make transactions work. I did this work and the rest of the database work in the SQL editor. At first, I had a different version of PostVotes called PostUpvotes, that kept track of upvotes, but back then, I asked Claude to revamp it to work with upvotes and downvotes, thus resulting in the PostVotes table. Luckily, in the SQL code I used before for creating the PostVotes table, not only did it have the new PostVotes table but it also had the necessary policies (SELECT, INSERT, UPDATE, and DELETE), so it was quite convenient. Next, came the Comments table, and the 4 policies (SELECT, INSERT, UPDATE, and DELETE). I copied those and it was working good. I also saw I had to turn on realtime on the Comments table to view comments update immediately. Also, I had another query to add parent_id to the Comments table. I got that working and the table editor was updated accordingly thanks to the queries I had in the SQL editor. 

Once done, I began to implement cloud deployment using Netlify. I somewhat remembered what I did, but I reviewed my chat history with Claude to help me out. I got it done with Netlify Drop for now, but I plan to create a proper domain using Netlify CLI in the future.

Overall, I am really glad with the work I put in today. I felt really motivated to relaunch it as I was thinking about it for a day now and I really wanted to work on it and have it be accessible again. So, I felt good when completing it and I feel good typing this now as it shows the dedication, effort, and time put in to make this happen. I do plan on working on expanding this project in the future, so stay tuned! Thank you for reading and have a nice day!

## Video Walkthrough

Here's a walkthrough of implemented user stories:

**Netlify Deployment**

**User Login and Signup**

**Supabase**

**Main GIFs**


## License

    Copyright [yyyy] [Giannfranco Crovetto]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
