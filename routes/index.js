var router = require('koa-router')();
var user_controller = require('../app/controllers/user_controller');
var posts_controller = require('../app/controllers/posts_controller');

router.get('login', user_controller.getUserLogin);
router.post('login', user_controller.loginUser);
router.get('register', user_controller.getUserRegister);
router.post('register', user_controller.registerUser);
router.get('logout', user_controller.logoutUser);

router.get('create', posts_controller.getCreate);
router.post('create', posts_controller.postCreate);
router.get('posts', posts_controller.getPosts);
router.get('posts/:postId', posts_controller.getPostId);
router.post('posts/:postId', posts_controller.postPostId);
router.get('posts/:postId/edit', posts_controller.getPostIdEdit);
router.post('posts/:postId/edit', posts_controller.postPostIdEdit);
router.get('posts/:postId/remove', posts_controller.getPostIdRemove);
router.post('posts/:postId/comment/:commentId/remove', posts_controller.postPostIdCommentIdRemove);

module.exports = router;
