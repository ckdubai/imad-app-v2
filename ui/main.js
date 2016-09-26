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
var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('btn_submit');

//Make a request to the server and send names
submit.onclick = function(){
    var names= ['name1','name2','name3','name4'];
    var list = '';
    for(var i =0; i<name.length; i++) {
        list+= '<li>'+names[i]+'</li>';
                                      }
  var ul = document.getElementById('namelist');
  ul.innerText=list;
    
};

