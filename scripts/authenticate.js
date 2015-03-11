$(document).ready(function() {
    SE.init({
        clientId : 4422,
        key : '2FgrF56*JKZBJ43DniQc7A((',
        channelUrl : 'http://tk-rand.github.io/blizzard_overflow/blank.html',
        complete : function(data) {
            console.log(data);
        }
    });

    $('#auth-button').click(function() {
        SE.authenticate({
            success : function(data) {
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('experationDate', data.experationDate);
            },
            scope : ['write_access', 'private_info'],
            error : function(data) {
                alert("The following error occured: " + data.errorName + "\n The server says: " + data.errorMessage);
            }
        });
    });

}); 


