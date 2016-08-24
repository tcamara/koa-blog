const router = require('koa-router')();

const generalRouter = require('./general/routes.js');
const postRouter = require('./posts/routes.js');
const userRouter = require('./users/routes.js');
const tagRouter = require('./tags/routes.js');

router.use('/posts', postRouter.routes(), postRouter.allowedMethods());
router.use('/users', userRouter.routes(), userRouter.allowedMethods());
router.use('/tags', tagRouter.routes(), tagRouter.allowedMethods());
router.use('/', generalRouter.routes(), generalRouter.allowedMethods());

module.exports = router;