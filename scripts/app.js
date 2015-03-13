$(document).ready(function(){
    var profile = JSON.parse(sessionStorage.getItem('user-profile'));
    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);
    
    $('#question-search').keypress(function(event){
        if(event.keyCode === 13 && event.target.value != ''){
            sessionStorage.setItem('query', event.target.value);
            if(window.location.href.indexOf('search-results') == -1){
                window.location.href = "http://tk-rand.github.io/blizzard_overflow/search-results.html";
            }else{
                useSearchApi(event.target.value, '');
            }
        }
    });   
});

    function createFavoriteTag(tag, appendTo){
        var display = "<div class='favorites-tag'>"+tag+"</div>";
        appendTo.append(display);
    };


