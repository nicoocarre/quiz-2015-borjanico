var path = require('path');

//Postgress DATABASE_URL = postgress://user:passwd@host:port/database
//SQLite DATABAsE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o postgress
var sequelize = new Sequelize(DB_name, user, pwd,
			{ dialect: protocol,
			  protocol: protocol,
			  port: port,
			  host: host,
			  storage: storage,
			  omitNull: true
			}
		);

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la definicion de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0) {  //la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
				      respuesta: 'Roma'
				});
			Quiz.create({ pregunta: 'Capital de Portugal',
				      respuesta: 'Lisboa'
				});
			Quiz.create({ pregunta: 'Capital de España',
				      respuesta: 'Madrid'
				});
			Quiz.create({ pregunta: 'Capital de Alemania',
				      respuesta: 'Berlin'
				})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});