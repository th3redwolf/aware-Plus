# Web Development Final Project - *AwarePlus*

Submitted by: **Nicolas Kraft**

This web app: 

**This is a social media web application similar to Reddit where users can create and interact with posts and other users via comments. The main features of the application include:**

**User Authentication: Users can sign up and log in to the application**

**Post Creation: Users can create new posts**

**Post Interaction: Users can comment on, upvote, edit, and delete posts**

**Navigation: The application includes navigation bars for easy access to different parts of the application**

**The application is built using React and Vite, with user data being stored in a backend database (supabase). The client.js file handles the interaction with the backend.**

Time spent: **20** hours spent in total

## Required Features

The following **required** functionality is completed:

- [X] **A create form that allows the user to create posts**
- [X] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
- [X] **A home feed displaying previously created posts**
- [X] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
- [X] **Clicking on a post shall direct the user to a new page for the selected post**
- [X] **Users can sort posts by either their created time or upvotes count**
- [X] **Users can search for posts by title**
- [X] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
- [X] **Users can leave comments underneath a post on the post's separate page**
- [X] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
- [X] **A previously created post can be edited or deleted from its post page**

The following **optional** features are implemented:

- [ ] Users can only edit and deleted posts or delete comments by entering the secret key, which is set by the user during post creation
- [ ] Upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them.
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface of the web app
- [X] Users can share and view web videos
- [ ] Users can set flags while creating a post. Then users can filter posts by flags on the home feed.
- [ ] Users can upload images directly from their local machine as an image file
- [ ] Display a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [X] List anything else that you added to improve the site's functionality!

- [X] Instead of using Secret Key, Users can sign up and log in and only create, edit, or delete their own posts, which is managed via their user ID
- [X] Instead of being assigned a random user ID, each signed in user is assigned a username based on their email address. This username is displayed on each post and comment they create.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

![Video Walkthrough](./awarePlus.gif)

## License

    Copyright [yyyy] [name of copyright owner]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.