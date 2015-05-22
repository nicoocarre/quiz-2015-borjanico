var models = require('../models/models.js');
var busqueda = "";

// Autoload - factoriza el código si ruta incluye :quidId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
			}).then(
		function(quiz) {
			if (quiz){
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error) { next(error);});
};

//POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors:err.errors});
			}else{
				quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function(){res.redirect('/quizes');})
			} // Redireccion HTTP (URL relativo) lista de preguntas.
		}
	);
};


// GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz, errors: []});
	})
};

// GET /quizes/:quizId/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// Get /quizes/new
exports.new= function(req, res) {
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta: "pregunta", respuesta: "respuesta"}
	);
	
	res.render('quizes/new', {quiz: quiz, errors: []});
};


// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === req.quiz.respuesta){
			res.render('quizes/answer', {quiz: req.quiz, respuesta:'Correcto', errors: []});
		}else{
			res.render('quizes/answer', {quiz: req.quiz, respuesta:'Incorrecto', errors: []});
		}
	})
};

// Get /quizes
exports.index = function(req, res){
	if(req.query.search){		
		busqueda = "%"+req.query.search+"%";
	}
	if(busqueda){
		models.Quiz.findAll({where: ["pregunta like ?", busqueda]}).then(function(quizes){
			res.render('quizes/index.ejs', {quizes : quizes, errors: []});
		})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs', {quizes : quizes, errors: []});
		})
	}

	busqueda = "";
		
};
//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
	  function(err) {
			if(err) {
				res.render ('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else {
				req.quiz //save: guarda campos pregunta y respuesta en DB
				.save({ fields: ["pregunta", "respuesta"]})
				.then( function(){ res.redirect('/quizes');});
			}		//Redirecion HTTP a la lista de preguntas (URL relativo)
		}
	);
};

//Delete /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};