var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var pool = mysql.createPool({
  multipleStatements: true,
  connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'Whatsapp'
});

router.get('/userlist/:from/:rows', function(req, res, next) {
  pool.query('SELECT id, profile_pic, username FROM users LIMIT ' + req.params.from + ', ' + req.params.rows, function (error, results, fields){
    if(error){
      res.send(error);
    }else{
      res.send(results);
    }
  })
});

router.get('/user/:username', function(req, res, next) {
  pool.query('SELECT id, profile_pic FROM users WHERE username = ' + pool.escape(req.params.username), function (error, results, fields){
    if(error){
      res.send(error);
    }else{
      res.send(results);
    }
  })
});

router.get('/conversations/:user', function(req, res, next) {
  pool.query(
    'SELECT messages.content, messages.send_time, messages.status, users.username, users.profile_pic, conversations.id, CASE conversations.user_a WHEN ' + pool.escape(req.params.user) +
    ' THEN conversations.user_a_unread ELSE conversations.user_b_unread END AS unread FROM ((conversations INNER JOIN users ON users.id = CASE conversations.user_a WHEN ' + pool.escape(req.params.user) +
    ' THEN conversations.user_b ELSE conversations.user_a END) INNER JOIN messages ON conversations.last_msg = messages.id) WHERE user_a = ' + pool.escape(req.params.user) +
    ' OR user_b = ' + pool.escape(req.params.user) + ' ORDER BY messages.send_time DESC', function (error, results, fields){

    if(error){
      res.send(error);
    }else{
      res.send(results);
    }
  })
});

router.get('/messages/:conversation', function(req, res, next) {
  pool.query('SELECT sender, content, send_time, status FROM messages WHERE conversation = ' + pool.escape(req.params.conversation), function (error, results, fields){
    if(error){
      res.send(error);
    }else{
      res.send(results);
    }
  })
});

router.post('/messages/:conversation', function(req, res, next) {
  pool.query('INSERT INTO messages (conversation, sender, content, status) VALUES (' +
  pool.escape(req.params.conversation) + ',' +
  pool.escape(req.body.sender) + ',' +
  pool.escape(req.body.content) + ',' +
  pool.escape(req.body.status) + '); UPDATE conversations SET user_a_unread = CASE user_a WHEN ' + pool.escape(req.body.sender) +
  ' THEN user_a_unread ELSE user_a_unread + 1 END, user_b_unread = CASE user_a WHEN ' + pool.escape(req.body.sender) +
  ' THEN user_b_unread + 1 ELSE user_b_unread END WHERE id = ' + pool.escape(req.params.conversation), function (error, results, fields){
    if(error){
      res.send(error);
    }else{
      res.send(results);
    }
  })
});

module.exports = router;
