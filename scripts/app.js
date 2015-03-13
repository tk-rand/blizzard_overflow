$(document).ready(function(){
    var profile = JSON.parse(sessionStorage.getItem('user-profile'));
    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);
    
    $('#question-search').keypress(function(event){
        if(event.keyCode === 13){
            console.log(target);
            useSearchApi(event.target.value);    
        }
    });   
});

function useSearchApi(query){
    console.log(query);
}
