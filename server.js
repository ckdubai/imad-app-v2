var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articleOne ={
    title:'Mohmmed Anish article',
    heading:'My First Article',
    date:'Sep 25 2016',
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
        </div>`
    
};

function createTemplate(data){
    var title= data.title;
    var heading=data.heading;
    var date=data.date;
    var content= data.content;
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
                    <h3>${heading}</h3>
                </div>
                <div>
                    <h4>${date}</h4>
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

app.get('/article-one', function (req, res) {
  res.send(createTemplate(articleOne));
});


app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
