const router = require('koa-router')();

const postRouter = require('./posts/routes.js');
const userRouter = require('./users/routes.js');
const tagRouter = require('./tags/routes.js');

router.use('/posts', postRouter.routes());
router.use('/users', userRouter.routes());
router.use('/tags', tagRouter.routes());

module.exports = router;