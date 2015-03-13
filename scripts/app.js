$(document).ready(function(){
    var profile = sessionStorage.getItem('user-profile');
    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);    
});
