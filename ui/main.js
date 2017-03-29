 /*var button = document.getElementById('counter');
 
 button.onclick = function (){
// create a request
var request = new XMLHttpRequest();

//Capture the response and store it in a variable
 request.onreadystatechange = function() {
 if(request.readyState === XMLHttpRequest.DONE) {
    
  if(request.status===200){
        var counter = request.responseText;
        document.getElementById('count').innerText=counter;
        
    }
}

};

//make request
request.open('GET','http://ckdubai.imad.hasura-app.io/counter',true);
request.send(null);

};*/
function loadLoginForm () {
var loginHtml = `<div class="form-group">
                        <input type="text" class="form-control" name="username" id="username" placeholder="Username">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password">
                    </div>
                    <button type="submit" id="btn_submit" class="btn btn-default">Sign In</button>
                    <button type="submit" id="reg_submit" class="btn btn-default">Register</button>`;
    document.getElementById('login_form').innerHTML = loginHtml;
    


//login Submit button username

var submit = document.getElementById('btn_submit');


submit.onclick = function(){
// create a request
var request = new XMLHttpRequest();
//Capture the response and store it in a variable
 request.onreadystatechange = function() {
 if(request.readyState === XMLHttpRequest.DONE) {
   if(request.status===200){
//Make a request to the server and send names

    /*var names =request.responseText;
    names = JSON.parse(names);
    var list = '';
    for(var i=0; i<names.length; i++) {
        list+= '<li>' + names[i] + '</li>';
                                      }
  document.getElementById('namelist').innerHTML=list;*/
   console.log('user logged in');
   
   
   }//200 status ends here
   else if(request.status===403){
       alert('username/password is incorrect');
   }
   else if(request.status=== 500){
       alert('something went wrong on the server');
       
   }
   loadLogin();
  }//ready state   
};
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
console.log(username);
console.log(password);
//request.open('GET','http://ckdubai.imad.hasura-app.io/submit-name?name='+name,true);
request.open('POST','http://ckdubai.imad.hasura-app.io/login',true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username:username,password:password}));

};

  var register = document.getElementById('reg_submit');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if(username && password) {
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
        }
        else
        { alert("fields cannot be empty");
        }
    };

}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_form');
    loginArea.innerHTML = `
        <div> Hi <i>${username}</i>
        <a href="/logout">Logout</a> </div>`;
}       

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
                document.getElementById("article_link").style.display = "block";
                document.getElementById("info").style.display = "none";
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET','/login-check', true);
    request.send(null);
}


var articles = document.getElementById('articles');

articles.onclick = function () {
    
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var artic = document.getElementById('dis');
            
            if (request.status === 200) 
            {  
                var content = '<ul class="list-group">';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li class="list-group-item">
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                   
                }
                content += "</ul>";
                artic.innerHTML = content;
            } else {
                artic.innerHTML('Oops! Could not load all articles!');
            }
        }
    }; 
    
    request.open('GET','/get-articles', true);
    request.send(null);
};

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
       
            var artic = document.getElementById('dis');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>";
                artic.innerHTML = content;
            } else {
                artic.innerHTML('Oops! Could not load all articles!');
            }
       
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}

// The first thing to do is to check if the user is logged in!
loadLogin();

document.getElementById("article_link").style.display = "none";
//loadArticles();
