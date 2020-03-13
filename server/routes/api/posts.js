const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validations/post');

// GET - /api/posts/test
// Des - Test route
// Access - Public 
router.get('/test', (req, res) => {
    res.json({msg: 'Posts Works'})
});
// GET - /api/posts
// Des - Get ALL posts
// Access - Public 
router.get('/', (req, res) => {
    Post.find({})
    .sort({createdAt: -1})
    .then(posts => res.json(posts))
    .catch(err => res.json({error: 'Could not find this post'}));
});
// GET - /api/posts/:id
// Des - Get posts by Id
// Access - Public 
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.json({error: 'Internal error on line 30'}));
});
// POST - /api/posts
// Des - Create Post
// Access - Private 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {text, name, avatar} = req.body;
    const user = req.user.id;
    const {errors, isValid} = validatePostInput({text, name, avatar});

    if(!isValid) {
        return res.status(400).json(errors)
    } 
    new Post({text, name, avatar, user})
    .save()
    .then(post => res.json(post))
    .catch(err => res.status(422).json({error: 'Internal error on line 46'}));
});
// DELETE - /api/posts/:id
// Des - Delete posts by Id
// Access - private 
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        if(post.user != req.user.id) {
           return res.status(401).json({error: 'This post does not belong to you'})
        }
        Post.findByIdAndDelete(req.params.id)
        .then(deleted => res.json({status: 'Success'}))
        .catch(err => res.status(422).json({error: 'Can not delete this post'}))
    })
    .catch(err => res.status(404).json({error: 'Could not find this post'}));
});
// POST - /api/posts/like/:id
// Des - Like or unlike post
// Access - private 
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
    // Check if the current user is in the like array (meaning if they have liked it or not), if they are then we get their index, and splice it from the like array. If they are not we will add them.
        let isUserInLikeArray = post.likes.filter(like => like.user.toString() === req.user.id);
        if(isUserInLikeArray.length > 0) {
            const indexOfUserInLikeArray = post.likes.indexOf(isUserInLikeArray[0]);
            post.likes.splice(indexOfUserInLikeArray, 1);
        }
        else {
            post.likes.push({user: req.user.id});
        }
        post.save()
        .then(newPost => res.json(newPost))
    })
    .catch(err => res.status(404).json({error: 'Cannot find this post'}))
});
// POST - /api/posts/comment/:id
// Des - Add comment on a post
// Access - private 
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {text, name, avatar} = req.body;
    const user = req.user.id;

    const {errors, isValid} = validatePostInput({text, name, avatar});
    if(!isValid) {
        return res.status(400).json(errors)
    } 

    Post.findById(req.params.id)
    .then(post => {
        const newComment = {text, name, avatar, user}
        // Add to comment array
        post.comments.push(newComment);
        post.save()
        .then(newPost => res.json(newPost))
        .catch(err => res.status(422).json({error: 'Internal error on line 98'}))
    })
    .catch(err => res.status(404).json({error: 'Could not find this post'}))
});
// Delete - /api/posts/comment/:id/:comment_id
// Des - Delete comment on post
// Access - private 
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}),  (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        // Find comment in array of comments
        const requestedCommentInArray = post.comments.filter(comment => comment._id.toString() === req.params.comment_id)
        if(requestedCommentInArray.length === 0) {
            return res.status(404).json({error: 'Could not find this comment'});
        }
        const commentToBeDeleted = requestedCommentInArray[0];
        console.log(commentToBeDeleted);
        if(commentToBeDeleted.user.toString() !== req.user.id) {
            return res.status(401).json({error: 'This comment does not belong to you'})
        }
        const indexOfCommentInCommentArray = post.comments.indexOf(commentToBeDeleted);
        post.comments.splice(indexOfCommentInCommentArray, 1);
        post.save()
        .then(newPost => res.json(newPost))
        .catch(err => res.status(422).json({error: 'Internal error on line 98'}))
    })
    .catch(err => res.status(404).json({error: 'Could not find this post'}))
});
module.exports = router;
