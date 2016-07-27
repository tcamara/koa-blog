# koa-blog
A simple blog platform using Koa rather than express

Routes:

GET / (view homepage)
GET /:page (view other named pages: about, contact, etc.)

POST /session (login submission)
DELETE /session (logout)

GET /login
POST /login
POST /logout
GET /register
POST /register

/post/new
/post/create
/post/list (pagination)
/post/:id/:seo_phrase
/post/:id/edit
/post/:id/update
/post/:id/delete

/user/new
/user/create
/user/list (pagination)
/user/:id/:seo_phrase
/user/:id/edit
/user/:id/update
/user/:id/delete

/tag/new
/tag/create
/tag/list (pagination)
/tag/:id/:seo_phrase
/tag/:id/edit
/tag/:id/update
/tag/:id/delete