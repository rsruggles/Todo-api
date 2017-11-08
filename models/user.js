var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING
    },
    passwordHash: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [8, 100]
      },
      set: function (value) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);
        
        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('passwordHash', hashedPassword);
      }
    }
  }, {
    hooks: {
      beforeValidate: function (user,options) {
        // user.email to lowercase
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }
      }
    },
    classMethods: {
      authenticateMethod: function (body) {
        return new Promise(function (resolve, reject){
          if (typeof body.email !== 'string' || typeof body.password !== 'string') {
            return reject();
            console.log('wut');
          }

          user.findOne({
            where: {
              email: body.email
            }
          }).then(function (user) {    
            if (!user || !bcrypt.compareSync(body.password, user.get('passwordHash'))) {
              return reject();
            }
            resolve(user);
          }, function (e) {
            reject();
          });
        });
      }
    },
    instanceMethods: {
      toPublicJSON: function () {
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
      }
    }
  });
  return user;
};