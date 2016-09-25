/*var button = document.getElementById('counter');
var counter = 0;
button.onclick = function () {
    
    counter = counter+1;
    var span = document.getElementById('count');
    span.innerHtml=counter.toString();
    document.getElementById('count').innerText=counter;
    
};*/
 var button = document.getElementById('counter');
 
 button.onclick = function (){
// create a request
var request = new XMLHttpRequest();

//Capture the response and store it in a variable
 request.onsteadystatechange = function() {
 if(request.steadystate === XMLHttpRequest.DONE) {
    
  if(request.status===200){
        counter = request.responsseText;
        var span = document.getElementById('count');
        span.innerText = counter;
    }
}

};

//make request
request.open('GET','http://ckdubai.imad.hasura-app.io/counter',true);
request.send(null);

};