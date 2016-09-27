 var button = document.getElementById('counter');
 
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

};

//Submit button 

var submit = document.getElementById('btn_submit');

submit.onclick = function(){
// create a request
var request = new XMLHttpRequest();

//Capture the response and store it in a variable
 request.onreadystatechange = function() {
 if(request.readyState === XMLHttpRequest.DONE) {
    
  if(request.status===200){
      
//Make a request to the server and send names

    var names =request.responseText;
    names = JSON.parse(names);
    var list = '';
    for(var i=0; i<names.length; i++) {
        list+= '<li>' + names[i] + '</li>';
                                      }
  document.getElementById('namelist').innerHTML=list;
  }
  }  
};
var nameInput = document.getElementById('name');
var name = nameInput.value;
request.open('GET','http://ckdubai.imad.hasura-app.io/submit-name?name='+name,true);
request.send(null);

};
