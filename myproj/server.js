


var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.69.147.26',
                user: 'root',
                password: 'team024',
                database: 'tokyoOlympics'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  var countrysql = `SELECT Gold_Medal,Silver_Medal,Bronze_Medal,Country FROM Country WHERE Rank_ != 0 ORDER BY Rank_ ASC LIMIT 10`;
  console.log(countrysql)
  connection.query(countrysql, function(err, result) {
      if (err) {
        res.send(err)
        return;
      }
      res.render('index', {title:'Tokyo Olympics Homepage', result});
  });
});
app.get('/login', function(req, res) {
  res.render('login', { title: 'User Login Page' });
});
app.get('/successUsers', function(req, res) {
      res.send({'message': 'Action performed successfully!'});
});
app.get('/about_user',function(req,res){
  var usersql = `SELECT Login,About FROM Users`;
  console.log(usersql)
  connection.query(usersql, function(err, result) {
      if (err) {
        res.send(err)
        return;
      }
      res.render('AboutUsers', {title:'About Users', result});
  });
});
app.get('/topAthletes',function(req,res){
  var topsql = 'SELECT Medals.athlete_name, Athlete.birth_place, Athlete.birth_country,Medals.medal_type FROM Medals JOIN Athlete on Medals.athlete_name = Athlete.name WHERE Medals.medal_Type = "Gold Medal" UNION SELECT Medals.athlete_name, Athlete.birth_place, Athlete.birth_country, Medals.medal_type FROM Medals JOIN Athlete on Medals.athlete_name = Athlete.name WHERE Medals.medal_Type = "Silver Medal" UNION SELECT Medals.athlete_name, Athlete.birth_place, Athlete.birth_country, Medals.medal_type FROM Medals JOIN Athlete on Medals.athlete_name = Athlete.name WHERE Medals.medal_Type = "Bronze Medal"';
  console.log(topsql);
	connection.query(topsql, function(err, result) {
    	if (err) {
      		res.send(err)
      		return;
    	}
      res.render('topAthlete', {title:'Top Athletes by Country', result});
  	});

});
app.get('/winners',function(req,res){
	var winsql = 'SELECT Medals.athlete_name,Medals.medal_type, Athlete.country FROM Medals JOIN Athlete ON (Medals.athlete_name = Athlete.name) WHERE (Medals.medal_type = "Gold Medal" OR Medals.medal_type = "Silver Medal" OR Medals.medal_type = "Bronze Medal")';
	console.log(winsql);
	connection.query(winsql, function(err, result) {
    	if (err) {
      		res.send(err)
      		return;
    	}
	res.render('winners', {title:'Olympics Winners',result});
  	});
});
app.get('/popular',function(req,res){
var popsql = `CALL result()`;
  console.log(popsql)
  connection.query(popsql, function(err, result) {
      if (err) {
        res.send(err)
        return;
      }
      res.render('popular', {title:'Popular Olympics Athletes in USA', result});
  });
});
app.get('/search',function(req,res){
  if (typeof req.query === undefined || req.query === {}) {
    res.render('AthleteSearch', {title:'Athlete Search', result:[]});
  } else {
    var athlete = req.query.athlete;
    var searchql = `SELECT athlete_name,discipline,event,medal_type FROM Medals WHERE (athlete_name LIKE CONCAT("%", SUBSTRING_INDEX("${athlete}"," ",1), "%")) AND (athlete_name LIKE CONCAT("%", SUBSTRING_INDEX("${athlete}"," ",-1), "%"))`;
    console.log(searchql)
    connection.query(searchql, function(err, result) {
      if (err) {
        res.send(err)
        return;
      }
      res.render('AthleteSearch', {title:'Athlete Search', result});
    });
  }
});

app.get('/success', function(req, res) {
      res.send({'message': 'Action performed successfully!'});
});
app.get('/inputFailure', function(req, res) {
      res.send({'message': 'There already exists such an user. Try again!'});
});
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var login = req.body.login;
  var about = req.body.about;
  var password = req.body.password;
  var sql = `INSERT INTO Users (Login, Password, About) VALUES 
('${login}','${password}','${about}')`;
console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send({'message':'There was an error adding that login. Please use another login'})
      return;
    }
    res.redirect('/successUsers');
  });
});


app.post('/mark2', function(req, res) {
  var login2 = req.body.login2;
  var password2 = req.body.password2;
  var sql2 = `DELETE FROM Users WHERE '${login2}' = Login AND '${password2}' = Password`;



console.log(sql2);
  connection.query(sql2, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/successUsers');
  });
});

app.post('/mark3', function(req, res) {
  var login3 = req.body.login3;
  var about3 = req.body.about3;
  var password3 = req.body.password3;
  var sql3 = `UPDATE Users SET About = '${about3}' WHERE '${login3}' = Login AND '${password3}' = Password`;



console.log(sql3);
  connection.query(sql3, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/successUsers');
  });
});

app.post('/mark4', function(req, res) {
var sql4 = 'SELECT Medals.athlete_name, Athlete.birth_place, Athlete.birth_country,Medals.medal_type FROM Medals JOIN Athlete on Medals.athlete_name = Athlete.name WHERE Medals.medal_Type = "Gold Medal" UNION SELECT Medals.athlete_name, Athlete.birth_place, Athlete.birth_country FROM Medals JOIN Athlete on Medals.athlete_name = Athlete.name WHERE Medals.medal_Type = "Silver Medal" UNION SELECT Medals.athlete_name, Athlete.birth_place, Athlete.birth_country FROM Medals JOIN Athlete on Medals.athlete_name = Athlete.name WHERE Medals.medal_Type = "Bronze Medal"';
console.log(sql4);
  connection.query(sql4, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.send(result)
  });
});

app.post('/mark5', function(req, res) {
var sql5 = `call result`;
console.log(sql5);
  connection.query(sql5, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.send(result);
  });
});

app.post('/mark6', function(req, res) {
  var athlete = req.body.athlete;
  var sql6 = `SELECT athlete_name,discipline,event,medal_type FROM Medals WHERE (athlete_name LIKE CONCAT("%", SUBSTRING_INDEX("${athlete}"," ",1), "%")) AND (athlete_name LIKE CONCAT("%", SUBSTRING_INDEX("${athlete}"," ",-1), "%"))`;
  console.log(sql6);
  connection.query(sql6, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    var tosend = result
  });
  console.log("Results sent");
});

app.post('/mark8', function(req, res) {
  var login4 = req.body.login4;
  var new4 = req.body.new4;
  var password4 = req.body.password4;
  var sql8 = `UPDATE Users SET Password = '${new4}' WHERE '${login4}' = Login AND '${password4}' = Password`;



console.log(sql8);
  connection.query(sql8, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/successUsers');
  });
});

//app.use((req,res) => {
//	res.render('./views/404.ejs',{title: '404'});
//});
app.listen(80, function () {
    console.log('Node app is running on port 80');
});





