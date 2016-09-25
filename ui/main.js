 var button = document.getElementById('counter');
 
 button.onclick = function (){
// create a request
var request = new XMLHttpRequest();

//Capture the response and store it in a variable
 request.onreadystatechange = function() {
 if(request.steadystate === XMLHttpRequest.DONE) {
    
  if(request.status===200){
        counter = request.responseText;
        document.getElementById('count').innerText=counter;
        
    }
}

};

//make request
request.open('GET','http://ckdubai.imad.hasura-app.io/counter',true);
request.send(null);

};