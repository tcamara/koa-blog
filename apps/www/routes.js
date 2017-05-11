const router = require('koa-router')();

const postRouter = require('./posts/routes.js');
const userRouter = require('./users/routes.js');
const tagRouter = require('./tags/routes.js');
const pageRouter = require('./pages/routes.js');
const generalRouter = require('./general/routes.js');

router.use('/posts', postRouter.routes());
router.use('/users', userRouter.routes());
router.use('/tags', tagRouter.routes());
router.use('/pages', pageRouter.routes());
router.use(generalRouter.routes());

module.exports = router;
