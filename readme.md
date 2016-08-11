# koa-blog
A simple blog platform using Koa rather than express

Routes:

GET / (view homepage)
GET /:page (view other named pages: about, contact, etc.)
POST /:page (update named pages)
DELETE /:page (delete named pages)

POST /session (login submission)
DELETE /session (logout)
users will handle account creation/deletion/editing/updating

what about showing posts by category, or search terms?

------------------------------------------------------------------
- Posts                                                          -
------------------------------------------------------------------
- Route               API Call            Description            -
------------------------------------------------------------------
- /posts              GET /posts          show post list         -
- /posts/new          N/A                 show create post page  -
- /posts/create       POST /posts         create post submission -
- /posts/:id/:slug    GET /posts/:id      show single post       -
- /posts/:id/update   POST /posts/:id     update post submission -
- /posts/:id/delete   DELETE /posts/:id   delete post submission -
------------------------------------------------------------------

------------------------------------------------------------------
- Users                                                          -
------------------------------------------------------------------
- Route               API Call            Description            -
------------------------------------------------------------------
- /users              GET /users          show user list         -
- /users/new          N/A                 show create user page  -
- /users/create       POST /users         create user submission -
- /users/:id/:slug    GET /users/:id      show single user       -
- /users/:id/update   POST /users/:id     update user submission -
- /users/:id/delete   DELETE /users/:id   delete user submission -
------------------------------------------------------------------

------------------------------------------------------------------
- Tags                                                           -
------------------------------------------------------------------
- Route               API Call            Description            -
------------------------------------------------------------------
- /tags               GET /tags           show tag list          -
- /tags/new           N/A                 show create tag page   -
- /tags/create        POST /tags          create tag submission  -
- /tags/:id/:slug     GET /tags/:id       show single tag        -
- /tags/:id/update    POST /tags/:id      update tag submission  -
- /tags/:id/delete    DELETE /tags/:id    delete tag submission  -
------------------------------------------------------------------
