var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = {
    user:'ckdubai',
    database:'ckdubai',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var articles = {
    'article-one':{
    title:'Mohmmed Anish article',
    heading:'My First Article',
    date:'Sep 24 2016',
    content: `<div>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
        </div>`},
    'article-two':{title:'Mohmmed Anish article',
    heading:'My Second Article',
    date:'Sep 25 2016',
    content: `<div>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
          
        </div>`},
    'article-three':{title:'Mohmmed Anish article',
    heading:'My Third Article',
    date:'Sep 30 2016',
    content: `<div>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
            <p>
                My first Article is published here...  My first Article is published here...    My first Article is published here...
            </p>
        </div>`}
    
    
};



function createTemplate(data){
    var title= data.title;
    var heading=data.heading;
    var date=data.date;
    var content= data.content;
    var author_id = data.author_id;
    var category = data.category;
    var htmlTemplate=
          `<html>
            <head>
                <title>${title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link href="/ui/style.css" rel="stylesheet" />
                <style>
                 
                </style>
            </head>
            <body>
                <div class="container">
                <h1>${heading}</h1>
                <div>
                     <a href="/">Home</a>
                <hr>
                    <h3>${author_id}</h3>
                </div>
                <div>
                    <h4>${date.toDateString()}</h4>
                </div>
                 <div>
                    <h4>${category}</h4>
                </div>
                <div>
                   ${content}
                </div>
                <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
                </div> <!-- container ends here -->
                <script type="text/javascript" src="/ui/article.js"></script>
            </body>
        </html> `;
        return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return["pbkdf2",salt,"1000", hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
    
    var hashedString =hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString);
    
});

app.post('/create-user',function(req,res){
   
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString= hash(password,salt);
   pool.query('INSERT INTO "user"(username,password) VALUES($1,$2)',[username,dbString],function(err,result){
         if(err){
           res.status(500).send(err.toString());
              } else {
                  res.send('User Succesfully created: '+username);
                  
              }
   });
});

app.post('/login',function(req,res){
     var username = req.body.username;
   var password = req.body.password;
   
   
   pool.query('SELECT * FROM "user" WHERE username =$1',[username],function(err,result){
         if(err){
           res.status(500).send(err.toString());
              } else {
                  if(result.rows.length === 0) {
                      res.status(403).send('username/password is invalid');
                      } else
                      {
                          var dbString = result.rows[0].password;
                          var salt = dbString.split('$')[1];
                          var hashedPassword = hash(password,salt);
                          if(hashedPassword === dbString) {
                          //set session here
                          req.session.auth ={userId: result.rows[0].id};
                          
                          res.send('credentials are correct');
                          } else {
                              
                              res.status(403).send('username/password is invalid');
                          }
                      }
                  
                  
              }
   });
    
});

app.get('/login-check',function(req,res){
    if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout',function(req,res){
   delete req.session.auth;
    res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          //var articleData = result.rows[0];
                //res.send(createTemplate(articleData));
          res.send(JSON.stringify(result.rows));
      }
   });
});

var pool= new Pool(config);
app.get('/test-db',function(req,res){
   //make a select request
   //return a response with the results
   pool.query("SELECT * FROM article", function(err,result){
       if(err){
           res.status(500).send(err.toString());
              } else {
                
                  //res.send(JSON.stringify(result.rows));
                  
              }
  
   });
});
var counter=0;
app.get('/counter',function(req,res){
    counter = counter+1;
    res.send(counter.toString());
    
});

var names=[];
app.get('/submit-name',function(req,res) {
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
    
});

app.get('/articles/:articleName', function (req, res) {
    //var articleName= req.params.articleName;
    pool.query("SELECT * FROM article WHERE title =$1",[req.params.articleName],function(err,result) {
        
        if(err){
            res.status(500).send(err.toString());
        }else {
            if(result.rows.length ===0){
                res.status(404).send('Article not Found');
            }else {
                
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
            
        }
    });
  //res.send(createTemplate(articles[articleName]));
});



//app.get('/article-two', function (req, res) {
  //res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
//});

//app.get('/article-three', function (req, res) {
  //res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
//});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'bootstrap.min.css'));
});

app.get('/ui/css/bootstrap.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'bootstrap.css'));
});

app.get('/ui/css/bootstrap-theme.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'bootstrap-theme.min.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
