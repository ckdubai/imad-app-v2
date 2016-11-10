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

var loginHtml = `
        <h3>Login/Register to unlock awesome features</h3>
        <input type="text" id="username" placeholder="username" />
        <input type="password" id="password" />
        <br/><br/>
        <input type="submit" id="login_btn" value="Login" />
        <input type="submit" id="register_btn" value="Register" />
        `;
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
   alert('logged in successfully');
   
   }//200 status ends here
   else if(request.status===403){
       alert('username/password is incorrect');
   }
   else if(request.status=== 500){
       alert('something went wrong on the server');
       
   }
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





var articles = document.getElementById('articles');

articles.onclick = function () {
    
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
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
                innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
};

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}