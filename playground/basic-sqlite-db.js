/*jslint devel: true, node: true, eqeq: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, es5: true*/
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-db.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 250] // validation, this means the string has to be between 1 char and 250 chars
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

sequelize.sync().then(function () {
  console.log('Everything is synced');
  
  Todo.findById(2).then(function (todo) {
    if (todo) {
      console.log(todo.toJSON);
    } else {
      console.log('Todo not found');
    }
  })
  
//  Todo.create({
//    description: 'Walk my dog',
//    completed: false
//  }).then(function (todo) {
//    return Todo.create({
//      description: 'Clean office'
//    });
//  }).then(function () {
//    //return Todo.findById(1)
//    return Todo.findAll({
//      where: {
//        description: {
//          $like: '%trash%'
//        }
//      }
//    });
//  }).then(function (todos) {
//    if (todos) {
//      todos.forEach(function (todo) {
//        console.log(todo.toJSON());
//      })
//    } else {
//      console.log('No todos found.');
//    }
//  }).catch(function (e) {
//    console.log(e);
//  })
});

// in the sequelize.sync, use {force: true} to drop a table and upload fresh data. Usefull when you make a mistake while pushing data to a table
//sequelize.sync({force: true}).then(function () {
//  console.log('Everything is synced');
//  
//  Todo.create({
//    description: 'Walk my dog',
//    completed: false
//  }).then(function (todo) {
//    console.log('Finished.');
//    console.log(todo);
//  })
//});