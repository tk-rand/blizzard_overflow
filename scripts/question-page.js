$(document).ready(function() {
    var href = window.location.href;
    var questionId = href.split('#');

    //split is going to return an array of 2 parts I just want the second one
    questionId = questionId[1];

    useQuestionApi(questionId);

    $('.back-button').click(function() {
        window.location.href = "http://tk-rand.github.io/blizzard_overflow/search-results.html";
    });
});

function useQuestionApi(questionId) {
    var data = {
        'site' : 'stackoverflow',
        'filter' : '!LUcFBCs2EchoD)JH.(QXOy',
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

    //the comments array can come back empty
    if (data.items[0].comments !== undefined) {
        data.items[0].comments.forEach(function(comment) {
            var display = "<div class='comment-container'><span class='comment-score'>" + comment.score + "</span>";
            display += "<span class='comment-owner-name'>" + comment.owner.display_name + "</span>";
            display += "<div class='comment-body'>" + comment.body + "</div><span class='comment-creation-date'>" + moment.unix(comment.creation_date).fromNow() + "</span></div>";

            $('.question-comments').append(display);
        });
    }

}
