/*jslint devel: true, node: true, eqeq: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, es5: true*/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
  var qParam = req.query;
  var filteredTodos = todos;
  
  if (qParam.hasOwnProperty('completed') && qParam.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (qParam.hasOwnProperty('completed') && qParam.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }
  
  if (qParam.hasOwnProperty('q') && qParam.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function (todo) {
      return todo.description.toLowerCase().indexOf(qParam.q.toLowerCase()) > -1;
    });
  }
  
  res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
  var todoID = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoID});
  
  
  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }
  
  body.description = body.description.trim();
  
  body.id = todoNextID++;

  todos.push(body);

  res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
  var todoID = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoID});
  
  if (!matchedTodo) {
    res.status(404).json({"error": "no todo found with that id"});
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
  var todoID = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoID});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};
  
  if (!matchedTodo) {
    return res.status(404).send();
  }
  
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(404).send();
  }
  
  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(404).send();
  }
  
  _.extend(matchedTodo, validAttributes);  
  res.json(matchedTodo);
});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});