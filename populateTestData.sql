INSERT INTO `Post` (`id`, `title`, `slug`, `authorId`, `timestamp`, `content`, `image`) VALUES
(1,	'Test Post',	'test-post',	1,	'2016-01-12 14:22:41',	'Test post contents',	'0'),
(2,	'New Test Post',	'new-test-post',	1,	'2016-09-05 15:38:07',	'This is some content!',	'0');

INSERT INTO `PostTag` (`postId`, `tagId`) VALUES
(1,	1),
(1,	2),
(2,	1);

INSERT INTO `Tag` (`id`, `name`, `slug`, `numPosts`) VALUES
(1,	'Test Tag',	'test-tag',	1),
(2,	'First Tag',	'first-tag',	0);

INSERT INTO `User` (`id`, `googleId`, `name`, `slug`, `email`, `numPosts`, `password`, `bio`) VALUES
(1,	112859426676842655276, 'Tim Camara',	'tim-camara', NULL,	2,	NULL,	'This is a bio about me.'),
(2,	NULL, 'Test Testington',	'test-testington', 'test@test.com',	0,	'testing',	'This is a test bio.');

INSERT INTO `Setting` (`key`, `value`) VALUES
('blogName',	'Take Five'),
('blogTagLine',	'Offbeat Comments on Code, Hobbies, & Life');
