$(document).ready(function(){
    var query = sessionStorage.getItem(query);
    if(query != '' && query != undefined){
        useSearchApi(query, '');
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
}
