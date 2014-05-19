
/*
 * GET home page.
 */
var NEO = require('neo4j');
var db = new NEO.GraphDatabase('http://localhost:7474');
var predict = require('predict-likes');
var library = require('./library.js').books;
var correlation = require('./math.js').correlation;
var difference = require('./math.js').difference;
var average = require('./math.js').average;
var control = predict.control();


exports.index = function(req, res){
  res.render('login');
};

exports.login = function(req, res){
	var params = {name: req.body.name};
	db.query('MATCH (n:user)\nWHERE n.name = ({name})\nRETURN n', params, function(err, data) {
		if(err) {console.log(err);} else {
			req.session.user = data[0].n._data.data.name;
			res.redirect('/home');
		}
	})
}

exports.newuser = function(req, res) {
	var params = {name: req.body.name};
	db.query('CREATE (n:user { name: ({name}), likes:[] } )',params, function(err) {
		if(err) {console.log(err);} else {
			res.redirect('/');
		}
	})
}

exports.home = function(req, res) {
	var params = {name:req.session.user};
	db.query('MATCH (n:user)\nWHERE n.name = ({name})\nRETURN n', params, function(err, data) {
		req.session.userBooks = data[0].n._data.data.likes
		res.render('index', {
			userBooks: req.session.userBooks,
			user: req.session.user,
			library: library
		});
	})
}

exports.matches = function(req, res) {
	var others = [], me = {}, diff, avg,
	    index = {},
	    results = [],
	    qualities = getQualities(req.session.userBooks),
	    predictionObject = makePredictionObject(library);
	predict.setObject(predictionObject);
	predict.setQualities(qualities);
	control.getTermFrequency(function(tf) {
		control.setTermFrequency(tf);
		db.query('MATCH (n:user)\nRETURN n', function(err, data) {
		if(err) { console.log(err); } else {
			forEach(data, function(user) {
				user = user.n._data.data;
				if(user.name == req.session.user) {
					me.id = user.name;
					me.likes = user.likes;
				} else {
					index[user.name] = user.likes;
					others.push({id: user.name, likes: user.likes})
				}
			})
			predict.process(me, function(myStats) {
				myStats = returnPositive(myStats);
				//console.log(myStats);
				predict.processArray(others, function(theirStats) {
					theirStats = returnPositive(theirStats);
					//console.log(theirStats)
					forEach(Object.keys(theirStats), function (user) {
						console.log(user);
						results.push({name: user, matches: theirStats[user]});
					})
					res.render('matches', { matches: results })
				})
			})
		}
	})	
	})
}

exports.logout = function(req, res) {
	req.session.user = null;
	req.session.userBooks = null;
	res.redirect('/')
}

exports.addBook = function(req, res) {
	var book = req.params.name;
	var params = {name: req.session.user, book: book};
	db.query('MATCH (n:user)\nWHERE n.name = ({name})\nSET n.likes = n.likes + ({book})', params, 
		function (err, data) {
			res.redirect('/home');
		})
}

function getBook(name) {
	var result;
	forEach(library, function(book) {
		if(book.name == name) {
			result = book;
		}
	})
	return result;
}

function getQualities(array) {
	var results = [];
	forEach(array, function(book) {
		book = getBook(book);
		forEach(book.tags, function(tag) {
			results.push(tag);
		})
	})
	return results;
}

function makePredictionObject(library) {
	var result = {};
	forEach(library, function(book) {
		result[book.name] = book.tags;
	})
	return result;
}

function forEach(array, fn) {
	for(var i = 0; i<array.length;i++) {
		fn(array[i], i);
	}
}

function sum(list) {
	var result = 0;
	forEach(list, function(num) {
		result += num;
	})
	return result;
}

function makeLists(set) {
	var current = [];
	for(var x in set) {
		for(var y in set[x]) {
			current.push(set[x][y])
		};
		set[x] = current;
		current = [];
	};
	return set;
}

function returnPositive(set) {
	var newset = {};
	var current = [];
	for(var x in set) {
		for(var y in set[x]) {
			if(set[x][y] > 0) {
				current.push({name: y, value: set[x][y]})
			}
		};
		if(Object.keys(current).length > 0) {
			newset[x] = current;
			current = [];
		}
	};
	return newset;	
}