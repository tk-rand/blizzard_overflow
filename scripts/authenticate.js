$(document).ready(function() {
    SE.init({
        clientId : 4422,
        key : '2FgrF56*JKZBJ43DniQc7A((',
        channelUrl : 'http://tk-rand.github.io/blank.html',
        complete : function(data) {
        }
    });

    $('#auth-button').click(function() {
        SE.authenticate({
            success : function(data) {
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('experationDate', data.expirationDate);
                sessionStorage.setItem('key', '2FgrF56*JKZBJ43DniQc7A((');
                window.location = "http://tk-rand.github.io/blizzard_overflow/profile-page.html";
            },
            scope : ['write_access', 'private_info'],
            error : function(data) {
                alert("The following error occured: " + data.errorName + "\n The server says: " + data.errorMessage);
            }
        });
    });

}); 


