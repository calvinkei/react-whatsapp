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

router.get('/users', function(req, res, next) {
  pool.query('SELECT id, profile_pic, username FROM users', function (error, results, fields){
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
    ' THEN conversations.user_b ELSE conversations.user_a END) LEFT JOIN messages ON conversations.last_msg = messages.id) WHERE user_a = ' + pool.escape(req.params.user) +
    ' OR user_b = ' + pool.escape(req.params.user) + ' ORDER BY messages.send_time DESC', function (error, results, fields){

    if(error){
      res.send(error);
    }else{
      res.send(results);
    }
  })
});

router.post('/conversations/:user', function(req, res, next) {
  pool.query('SELECT id FROM conversations WHERE (user_a = ' +
  req.params.user + ' AND user_b = ' + req.body.user + ') OR (user_b = ' +
  req.params.user + ' AND user_a = ' + req.body.user + ')', function (error, results, fields){
    if(error){
      res.send(error);
    }else if (results.length > 0){
      res.send(results[0]);
    }else{
      pool.query(
        'INSERT INTO conversations (user_a, user_b) VALUES (' + req.params.user + ', ' + req.body.user + '); SELECT LAST_INSERT_ID();', function (error, results, fields){
        if(error){
          res.send(error);
        }else{
          res.send({id: results[1][0]['LAST_INSERT_ID']});
        }
      })
    }
  })

});

router.get('/messages/:conversation/:user/:from/:noOfMsg', function(req, res, next) {
  pool.query('SELECT id, sender, content, send_time, status FROM messages WHERE conversation = ' + pool.escape(req.params.conversation) +
  ' ORDER BY send_time DESC LIMIT ' + pool.escape(Number(req.params.from)) + ',' + pool.escape(Number(req.params.noOfMsg)) +
  // Update unread number
  '; SELECT CASE user_a WHEN ' + pool.escape(req.params.user) + ' THEN user_b ELSE user_a END AS user FROM conversations WHERE id = ' + pool.escape(req.params.conversation) +
  '; UPDATE conversations SET user_a_unread = CASE user_a WHEN ' + pool.escape(req.params.user) +
  ' THEN 0 ELSE user_a_unread END, user_b_unread = CASE user_b WHEN ' + pool.escape(req.params.user) +
  ' THEN 0 ELSE user_b_unread END WHERE id = ' + pool.escape(req.params.conversation) +
  // Update message status (blue tick)
  '; SELECT id FROM messages WHERE conversation = ' + pool.escape(req.params.conversation) + ' AND status != 2 AND sender != ' + pool.escape(req.params.user) +
  '; UPDATE messages SET status = 2 WHERE conversation = ' + pool.escape(req.params.conversation) + ' AND status != 2 AND sender != ' + pool.escape(req.params.user), function (error, results, fields){
    if(error){
      res.send(error);
    }else{
      res.io.of('/' + results[1][0].user).emit('read', {conversation: req.params.conversation, messages: results[3]});
      res.send(results[0]);
    }
  })
});

router.post('/messages/:conversation', function(req, res, next) {
  pool.query('SELECT CASE user_a WHEN ' + pool.escape(req.body.sender) + ' THEN user_b ELSE user_a END AS user FROM conversations WHERE id = ' + pool.escape(req.params.conversation) +
  ';INSERT INTO messages (conversation, sender, content, status) VALUES (' +
  pool.escape(req.params.conversation) + ',' +
  pool.escape(req.body.sender) + ',' +
  pool.escape(req.body.content) + ',' +
  pool.escape(req.body.status) + '); SELECT * FROM messages WHERE id = LAST_INSERT_ID(); UPDATE conversations SET last_msg = LAST_INSERT_ID(), user_a_unread = CASE user_a WHEN ' + pool.escape(req.body.sender) +
  ' THEN user_a_unread ELSE user_a_unread + 1 END, user_b_unread = CASE user_a WHEN ' + pool.escape(req.body.sender) +
  ' THEN user_b_unread + 1 ELSE user_b_unread END WHERE id = ' + pool.escape(req.params.conversation), function (error, results, fields){
    if(error){
      res.send(error);
    }else{
      res.io.of('/' + results[0][0].user).emit('newMsg', results[2][0]);
      res.send({id: results[2][0].id});
    }
  })
});


module.exports = router;
