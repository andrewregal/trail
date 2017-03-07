//install and save to package json
//window.navigator.userAgent = 'react-native';

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var db = require('./db/db');
var auth = require('./auth');
var camera = require('./camera');
var friends = require('./friends');
var cors = require('cors');

//Middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var cors = require('cors');

// Pass middleware into express
app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());

io.on('connection', function(socket) {
  console.log('a client just joined', socket.id);
  socket.on('message', function (message) {
    console.log('message received:', message);
  });
  socket.on('action', function(action) {
    if (action.type === 'socket/signin') {
      auth.signin(action.payload, function(token, username, userID, posts, friendList, receivedFriendRequests, sentFriendRequests) {
        console.log('index.js socket/signin - got token, emitting action with token back to app for token', token);
        console.log('all this stuff', posts, friendList, receivedFriendRequests, sentFriendRequests)
        socket.emit('action',
          {
            type: 'LOGIN_RESPONSE',
            data: {
              username: username,
              id: userID,
              token: token,
              posts: posts || {},
              friendList: friendList || [{username: 'testUser23', id: 3}, {username: 'testUser41', id: 5}, {username: 'testUser352', id: 7}, {username: 'testUser095', id: 1}],
              receivedFriendRequests: receivedFriendRequests || [{username: 'receivedReqUser1', id: 9999}, {username: 'receivedReqUser2', id: 9998}, {username: 'receivedReqUser3', id: 9997}],
              sentFriendRequests: sentFriendRequests || [{username: 'sentReqUser1', id: 1008}, {username: 'sentReqUser2', id: 1009}, {username: 'sentReqUser3', id: 1007}]
            }
          });
      });
    }
    if (action.type === 'socket/signup') {
      auth.signup(action.payload, function(token, username, userID) {
        console.log('index.js socket/signup - got token, emitting action with token back to app for token', token);
        socket.emit('action',
          {
            type: 'LOGIN_RESPONSE',
            data: {
              username: username,
              id: userID,
              token: token,
              posts: {},
              friendList: [],
              receivedFriendRequests: [],
              sentFriendRequests: []
            }
          }
        );
      });
    }
    if (action.type === 'socket/postPhoto') {
      console.log('postPhoto action.payload === ', action.payload);
      camera.post(action.payload, function(data) {
        console.log('Post photo return: ', data);
      });
    }
    if (action.type === 'socket/searchedUser') {
      console.log('socket/searchedUser payload ==== ', action.payload);
      friends.search(action.payload.searchText.toLowerCase(), action.payload.userID, function(data) {
        console.log('returning search results for friend search', data);
        // data = username, ids
        // EXAMPLE
        // data[0].id, data[0].username
        socket.emit('action', {
          type: 'USER_SEARCHED',
          data: data
        });
      });
    }

    if (action.type === 'socket/addFriend') {
      console.log('socket/addFriend payload ==== ', action.payload);
      friends.add(action.payload.primaryID, action.payload.friendID, function(confirmation){
        console.log('friends.add stuff done', confirmation)
      })
      //action.payload should have primaryID and friendID
      //in friend.js, create a routeHelper called addFriend(user)
        //friend.addFriend should take a friend and create the proper database logs for friend request / friend connection
    }
    if (action.type === 'socket/removeFriend') {
      console.log('socket/addFriend payload ==== ', action.payload);
      friends.remove(action.payload.primaryID, action.payload.friendID, function(confirmation){
        console.log('friends.remove stuff done', confirmation)
      })
      //action.payload should have primaryID and friendID
      //in friend.js, create a routeHelper called addFriend(user)
        //friend.addFriend should take a friend and create the proper database logs for friend request / friend connection
    }

  });
  io.emit('message2', 'xxxxxxxx received from server: connection established');
});


module.exports = server;
