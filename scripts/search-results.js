$(document).ready(function() {
    var query = '';
    var tag = '';
    if(sessionStorage.getItem('query') != undefined){
        var query = sessionStorage.getItem('query');
    }else if(sessionStorage.getItem('tag') != undefined){
        var tag = sessionStorage.getItem('tag'); 
    }

    if (query != '' && query != undefined) {
        useSearchApi(query, '', '');
        document.title += ' ' + query;
        $('#query-display').text(query);
        $('#question-search').value(query);
    }else if (tag != '' && tag != undefined){
        useSearchApi('', tag, '');
        document.title += ' ' + tag;
        $('#query-display').text('Tag: ' +tag);
    }
    
    $('#sort-results').onblur(function(){
        console.log($(this).val());
    });
});

function useSearchApi(query, tag, sortType) {
    sortType == '' ? 'activity' : sortType;
    var data = {
            order : 'desc',
            sort : sortType,
            site : 'stackoverflow',
            intitle : query,
            tagged : tag
    };
    
    // the SE.api chokes if intitle is there but an empty string so have to get rid of it if we are just searching by tag type
    if(query == undefined || query == ''){
        delete data.intitle;
    }
    
    $.ajax({
        url : 'https://api.stackexchange.com/2.2/search?',
        data : data
    }).done(function(data) {
        createSearchResults(data);
    }).fail(function(data) {
        alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
    });
}

function createSearchResults(data) {
    this.createSearchResult = function(title, link, tags, activityDate, score, ownerName, ownerLink, ownerImage, questionId) {
        var display = "<div class='query-result-container' id='" + questionId + "'><div class='owner-info'><a href='" + ownerLink + "'>";
        display += "<span class='created-by-span'>Created By: </span><img src='" + ownerImage + "' alt='image of user:" + ownerName + "' /><span class='owners-name'>" + ownerName + "</span>";
        display += "</a></div><div class='quesiton-score'><span>" + score + "</span><br/><span>votes</span></div><div class='question-info-container'>";
        display += "<a href='" + link + "'><h3>" + title + "</h3></a><div class='question-info-bottom-half'><div class='question-tags-container'> </div>";
        display += "<span> Last active: &nbsp;" + moment.unix(activityDate).format('MM-dd-YYYY') + "</span></div></div></div>";

        $('.search-results-container').append(display);

        tags.forEach(function(tag) {
            var appendTo = $("#" + questionId).find(".question-tags-container");
            createFavoriteTag(tag, appendTo, 'questions-tag');
        });
    };

    data.items.forEach(function(item) {
        this.createSearchResult(item.title, item.link, item.tags, item.last_activity_date, item.score, item.owner.display_name, item.owner.link, item.owner.profile_image, item.question_id);
    });
}
