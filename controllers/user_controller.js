var users = { admin: {id:1, username:"admin", password:"1234"},
		borjamm: {id:2, username:"borjamm", password:"hola"}
	    };

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function(login, password, callback) {
	if(users[login]){
		if(password === users[login].password){
			callback(null, users[login]);
		}
		else { callback(new Error('Password erróneo.')); }
	}
	else { callback(new Error('No existe el usuario')); }
};