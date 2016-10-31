var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
    user:'ckdubai',
    database:'ckdubai',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

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
                </div> <!-- container ends here -->
            </body>
        </html> `;
        return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool= new Pool(config);

app.get('/test-db',function(req,res){
   //make a select request
   //return a response with the results
   pool.query("SELECT * FROM article", function(err,result){
       if(err){
           res.status(500).send(err.toString());
              } else {
                  res.send(JSON.stringify(result.rows));
                  
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

app.get('/ui/26505.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
