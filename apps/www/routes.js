const router = require('koa-router')();

const postRouter = require('./posts/routes.js');
const userRouter = require('./users/routes.js');
const tagRouter = require('./tags/routes.js');

router.use('/posts', postRouter.routes(), postRouter.allowedMethods());
router.use('/users', userRouter.routes(), userRouter.allowedMethods());
router.use('/tags', tagRouter.routes(), tagRouter.allowedMethods());

module.exports = router;