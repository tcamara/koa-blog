
INSERT INTO `Post` (`id`, `title`, `slug`, `authorId`, `timestamp`, `content`, `image`) VALUES
(1,	'Test Post',	'test-post',	1,	'2016-01-12 14:22:41',	'Test post contents',	'0'),
(2,	'New Test Post',	'new-test-post',	1,	'2016-09-05 15:38:07',	'This is some content!',	'0');

INSERT INTO `Post_Tag` (`postId`, `tagId`) VALUES
(1,	1),
(1,	2),
(2,	1);

INSERT INTO `Tag` (`id`, `name`, `slug`, `numPosts`) VALUES
(1,	'Test Tag',	'test-tag',	1),
(2,	'First Tag',	'first-tag',	0);

INSERT INTO `User` (`id`, `name`, `email`, `numPosts`, `password`, `bio`) VALUES
(1,	'Tim Camara',	'tcamara21@gmail.com',	2,	'test',	'This is a bio about me.'),
(2,	'Test Testington',	'test@test.com',	0,	'testing',	'This is a test bio.');

INSERT INTO `Setting` (`key`, `value`) VALUES
('blogName',	'Take Five'),
('blogTagLine',	'Offbeat Comments on Code, Hobbies, & Life');