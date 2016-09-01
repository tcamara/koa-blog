# koa-blog
A simple blog platform using Koa rather than Express

## To get started
1. Create a new database and database user (feel free to change details):
```
CREATE DATABASE `blog`;

CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'bad_password';

GRANT ALL PRIVILEGES ON `blog`.* TO 'blog_user'@'localhost';
```
2. Create the tables specified in createTables.sql
3. (Optional) use the data specified in populateTestData.sql to populate test data
4. Create the file `.env` in this project's root directory
5. Populate the file with the required env variables (just the ones in mysql.js for now), using the values from step 1


## Routes:

### General

| Route                  | Permissions | Description            |
| ---------------------- | ----------- | ---------------------- |
| GET /                  | Guest       | show homepage          |
| POST /session          | Guest       | log user in            |
| DELETE /session        | Member      | log user out           |

### Posts

| Route                             | Permissions | Description            |
| --------------------------------- | ----------- | ---------------------- |
| GET /posts                        | Guest       | show post list         |
| GET /posts/new                    | Member      | show create post page  |
| POST /posts                       | Member      | create post submission |
| GET /posts/:postId/[:slug]        | Guest       | show single post       |
| POST /posts/:postId               | Member*     | update post submission |
| DELETE /posts/:postId             | Member*     | delete post submission |
| GET /posts/tags/:tagId            | Guest       | get posts by tag       |
| POST /posts/:postId/tags/:tagId   | Member*     | add tag to post        |
| DELETE /posts/:postId/tags/:tagId | Member*     | remove tag from post   |

### Users

| Route                      | Permissions | Description            |
| -------------------------- | ----------- | ---------------------- |
| GET /users                 | Guest       | show user list         |
| GET /users/new             | Guest       | show create user page  |
| POST /users                | Guest       | create user submission |
| GET /users/:userId/[:slug] | Guest       | show single user       |
| POST /users/:userId        | Member*     | update user submission |
| DELETE /users/:userId      | Member*     | delete user submission |

### Tags

| Route                             | Permissions | Description            |
| --------------------------------- | ----------- | ---------------------- |
| GET /tags                         | Guest       | show tag list          |
| GET /tags/new                     | Member      | show create tag page   |
| POST /tags                        | Member      | create tag submission  |
| GET /tags/:tagId/[:slug]          | Guest       | show single tag?       |
| POST /tags/:tagId                 | Editor      | update tag submission  |
| DELETE /tags/:tagId               | Editor      | delete tag submission  |
| GET /tags/:tagId/posts            | Guest       | get posts by tag       |
| POST /tags/:tagId/posts/:postId   | Member*     | add tag to post        |
| DELETE /tags/:tagId/posts/:postId | Member*     | remove tag from post   |

### Pages

| Route                  | Permissions | Description            |
| ---------------------- | ----------- | ---------------------- |
| GET /pages             | Guest       | show page list         |
| GET /pages/new         | Admin       | show create page page  |
| POST /pages            | Admin       | create page submission |
| GET /:page             | Guest       | show page              |
| POST /:page            | Admin       | update pages           |
| DELETE /:page          | Admin       | delete pages           |

#### Query Parameters (for list routes only)

| Key  | Possible Values     | Description |
| ---- | ------------------- | ----------- |
| q    | any string          | search term |
| page | any counting number | pagination  |
| sort | comma-separated list of any of the validSortColumns, each of which may be optionally prefaced with a '-' to indicate reverse ordering | sort order for returned results |

## Permissions Levels

| Level | Abilities |
| ----- | --------- |
| Guest | Reading, creating an account |
| Member | Creating content, modifying own content |
| Editor | Modifying other member's content, editing existing tags |
| Admin | Everything |

'*' on permissions indicates only applicable for 'owned' resources