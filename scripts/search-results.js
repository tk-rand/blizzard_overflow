$(document).ready(function(){
    var query = sessionStorage.getItem('query');
    console.log(query);
    if(query != '' && query != undefined){
        useSearchApi(query, '');
        document.title += ' '+ query;
        $('#query-display').text(query);
    }    
});

function useSearchApi(query, sortType){
    sortType == '' ? 'activity' : sortType;
    $.ajax({
        url: 'https://api.stackexchange.com/2.2/search?',
        data: {
            order: 'desc',
            sort: sortType,
            site: 'stackoverflow',
            intitle: query
        }     
    }).done(function(data){
        createSearchResults(data);
    }).fail(function(data){
        alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
    });
}

function createSearchResults(data){
    console.log(data);
    
    this.createSearchResult = function(title, link, tags, activityDate, score, ownerName, ownerLink, ownerImage, questionId){
        var display = "<div class='query-result-container' id='"+questionId+"'><div class='owner-info'><a href='"+ownerLink+"'>";
        display += "<img src'"+ownerImage+"' alt='image of user:"+ownerName+"' />";
        display += "<span>"+ownerName+"</span></a></div><div class='quesiton-score'><span>"+score+"</span><br/><span>votes</span></div>";
        display += "<div class='question-info-container'><a href='"+link+"'><h3>"+title+"<h3></a><div class='question-info-bottom-half'>";
        display += "<div class='question-tags-container'> </div><span> Last active: &nbsp;"+ activityDate+"</span></div></div></div>";
        
        $('.search-results-container').append(display);
        
        tags.forEach(function(tag){
            var appendTo = $("#"+ questionId +" > .question-tags-container");
            createFavoriteTag(tag, appendTo );
        });  
    };
    
    data.items.forEach(function(item){
        this.createSearchResult(item.title, item.link, item.tags, item.last_activity_date, item.score, 
                                item.owner.display_name, item.owner.link, item.owner.profile_image, item.question_id);    
    });
}
