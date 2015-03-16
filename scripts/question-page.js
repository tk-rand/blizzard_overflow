$(document).ready(function() {
    var href = window.location.href;
    var questionId = href.split('#');

    //split is going to return an array of 2 parts I just want the second one
    questionId = questionId[1];
    useQuestionApi(questionId);

    $('.back-button').click(function() {
        window.location.href = "http://tk-rand.github.io/blizzard_overflow/search-results.html";
    });
    $('#favorite-question').click(function(){
        if($(this).hasClass('favorted')){
            favorateQuestion(questionId, true);
            $(this).removeClass('favorted');   
        }else{
            favorateQuestion(questionId, false);
            $(this).addClass('favorted');    
        }
    });
    
});

var apiURL = 'https://api.stackexchange.com/2.2/questions/';

function useQuestionApi(questionId) {
    var data = {
        'site' : 'stackoverflow',
        'filter' : '!LUcFBCs2EchoD)JH.(QXOy',
        'key' : sessionStorage.getItem('key'),
        'access_token' : sessionStorage.getItem('accessToken')
    };

    $.ajax({
        url : apiURL + questionId,
        data : data
    }).done(function(data) {
        createQuestion(data);
    }).fail(function(data) {
        alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
    });
}

function favorateQuestion(questionId, undo){
    var url = apiURL + questionId + '/favorite';
    
    if(undo){
        url += '/undo';
    }
    
    $.ajax({
        type: 'POST',
        url: url,
        data:{
            'key' : sessionStorage.getItem('key'),
            'access_token' : sessionStorage.getItem('accessToken'),
            'site': 'stackoverflow'    
        },
        dataType: 'json'   
    }).done(function(data) {
        
    }).fail(function(data) {
        alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
    });
}


function createQuestion(data) {
    console.log(data);

    $('.question-title h2').html(data.items[0].title);
    $('#question-score').text(data.items[0].score);
    $('#view-count').text(data.items[0].view_count);
    $('.question-body').prepend(data.items[0].body);
    $('#creation-date').append(moment.unix(data.items[0].creation_date).format('MMM-DD-YYYY'));

    data.items[0].tags.forEach(function(tag) {
        var display = "<div class='tag-container'>" + tag + "</div>";
        $('.question-tags').append(display);
    });

    //the comments array could be blank
    if (data.items[0].comments !== undefined) {
        var appendTo = $('.question-comments');
        createComments(data.items[0].comments, appendTo);
    }
    //answers array could be blank
    if(data.items[0].answers !== undefined){
        createAnswers(data.items[0].answers);    
    }
    
}

function createComments(comments, appendTo){
        comments.forEach(function(comment) {
            var display = "<div class='comment-container'><span class='comment-score'>" + comment.score + "</span>";
            display += "<span class='comment-owner-name'>" + comment.owner.display_name + "</span>";
            display += "<div class='comment-body'>" + comment.body + "</div><span class='comment-creation-date'>" + moment.unix(comment.creation_date).fromNow() + "</span></div>";

            appendTo.append(display);
        });    
}

function createAnswers(answers){
     answers.forEach(function(answer){
        var display = "<div class='individual-answer-container'> <div class='question-stats-column'><div class='question-stats-box'><span>"+answer.score+"</span><br/><span>score</span>";
        display += "</div></div><div class='answer-body'>"+answer.body+"<span class='creation-date'>Posted: "+ moment.unix(answer.creation_date).format('MMM-DD-YYYY')+"</span></div>";
        display += "<hr><div class='answer-comments' id='"+answer.answer_id+"'><h3>Comments:</h3></div></div>";
        $('.answers-container').append(display);
        
        if(answer.comments !== undefined){
            var appendTo = $('#'+answer.answer_id);
            createComments(answer.comments, appendTo);
        }    
     });              
}
