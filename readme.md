# koa-blog
A simple blog platform using Koa

## Requirements
- MySQL
- NodeJS
- NPM (usually installed along with node)

## To get started
1. Create a new database and database user (feel free to change details):
```
CREATE DATABASE `blog`;

CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'bad_password';

GRANT ALL PRIVILEGES ON `blog`.* TO 'blog_user'@'localhost';
```
2. Create the tables specified in createTables.sql
3. (Optional) use the data specified in populateTestData.sql to populate test data
4. Rename the file `.env-template` to `.env`
5. Populate the file with the required env variables using the values from step 1
6. Run `npm install` to pull down dependencies
7. Run `npm start` to start the application
8. Your app should now be accessible on localhost at the port specified in the `.env` file


## Routes:

### General

| Route                  | Permissions | Description            |
| ---------------------- | ----------- | ---------------------- |
| GET /                  | Guest       | show homepage          |
| GET /session           | Guest       | show login page        |
| POST /session          | Guest       | log current user in    |
| DELETE /session        | Member      | log current user out   |

### Posts

| Route                             | Permissions | Description            |
| --------------------------------- | ----------- | ---------------------- |
| GET /posts                        | Guest       | show post list         |
| GET /posts/new                    | Member      | show create post page  |
| POST /posts                       | Member      | create post submission |
| GET /posts/:postId/[:slug]        | Guest       | show single post       |
| POST /posts/:postId               | Member*     | update post submission |
| DELETE /posts/:postId             | Member*     | delete post submission |
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
| GET /tags/:tagId/[:slug]          | Guest       | get posts by tag       |
| POST /tags/:tagId                 | Editor      | update tag submission  |
| DELETE /tags/:tagId               | Editor      | delete tag submission  |

### Pages

| Route                  | Permissions | Description            |
| ---------------------- | ----------- | ---------------------- |
| GET /pages             | Guest       | show page list         |
| GET /pages/new         | Admin       | show create page page  |
| POST /pages            | Admin       | create page submission |
| GET /:page             | Guest       | show page              |
| POST /:page            | Admin       | update page submission |
| DELETE /:page          | Admin       | delete page submission |

#### Query Parameters (for list routes only)

| Key  | Possible Values     | Description |
| ---- | ------------------- | ----------- |
| q    | any string          | search term |
| page | any counting number | pagination  |
| sort | comma-separated list of any of the validSortColumns, each of which may be optionally prefaced with a '-' to indicate reverse ordering | sort order for returned results |

## Permissions Levels

| Level  | Abilities                                               |
| ------ | ------------------------------------------------------- |
| Guest  | Reading, creating an account                            |
| Member | Creating content, modifying own content                 |
| Editor | Modifying other member's content, editing existing tags |
| Admin  | Everything                                              |

'*' on permissions indicates only applicable for 'owned' resources