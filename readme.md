# koa-blog
A simple blog platform using Koa rather than express

## To get started
1. Create a new database and database user (feel free to change details):
```
CREATE DATABASE `blog`;

CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'bad_password';

GRANT ALL PRIVILEGES ON `blog`.* TO 'blog_user'@'localhost';
```
2. Create the tables specified in createTables.sql
3. (Optional) use the data specified in populateTestData.sql to populate test data


## Routes:

### General

Route               | API Call            | Description
------------------------------------------------------------------
/                   | GET /               | show homepage
/:page              | GET /:page          | show other named pages
/:page/update       | POST /:page         | update named pages
/:page/delete       | DELETE /:page       | delete named pages
/session            | POST /session       | log user in
/session/delete     | DELETE /session     | log user out

### Posts

Route               | API Call            | Description
------------------------------------------------------------------
/posts              | GET /posts          | show post list
/posts/new          | N/A                 | show create post page
/posts/create       | POST /posts         | create post submission
/posts/:id/:slug    | GET /posts/:id      | show single post
/posts/:id/update   | POST /posts/:id     | update post submission
/posts/:id/delete   | DELETE /posts/:id   | delete post submission

what about showing posts by category, or search terms?

### Users

Route               | API Call            | Description
------------------------------------------------------------------
/users              | GET /users          | show user list
/users/new          | N/A                 | show create user page
/users/create       | POST /users         | create user submission
/users/:id/:slug    | GET /users/:id      | show single user
/users/:id/update   | POST /users/:id     | update user submission
/users/:id/delete   | DELETE /users/:id   | delete user submission

### Tags

Route               | API Call            | Description
------------------------------------------------------------------
/tags               | GET /tags           | show tag list
/tags/new           | N/A                 | show create tag page
/tags/create        | POST /tags          | create tag submission
/tags/:id/:slug     | GET /tags/:id       | show single tag
/tags/:id/update    | POST /tags/:id      | update tag submission
/tags/:id/delete    | DELETE /tags/:id    | delete tag submission
