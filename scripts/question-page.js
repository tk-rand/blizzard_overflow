$(document).ready(function() {
    var href = window.location.href;
    var questionId = href.split('#');

    //split is going to return an array of 2 parts I just want the second one
    questionId = questionId[1];

    useQuestionApi(questionId);

});

function useQuestionApi(questionId) {
    var data = {
        'site' : 'stackoverflow',
        'filter' : '!3yXvh3jvaHG)DFsal',
        'key' : sessionStorage.getItem('key'),
        'access_token' : sessionStorage.getItem('accessToken')
    };

    $.ajax({
        url : 'https://api.stackexchange.com/2.2/questions/' + questionId,
        data : data
    }).done(function(data) {
        createQuestion(data);
    }).fail(function(data) {
        alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
    });
    ;
}

function createQuestion(data){
    console.log(data);
}
