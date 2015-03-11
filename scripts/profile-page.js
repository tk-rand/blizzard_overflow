var apiUrl = "https://api.stackexchange.com/2.2";

$(document).ready(function(){
   //get profile information
   $.ajax({
       url: apiUrl + '/me?',
       data: {'access_token': sessionStorage.getItem('accessToken'),
              'site': 'stackoverflow',
              'key': sessionStorage.getItem('key')
             },
       success: function(data){
           console.log(data);
           setProfileInformation(data.items[0]);
       }
   }); 
});

function setProfileInformation(profile){
    //save for later use on the search and question page
    sessionStorage.setItem('user-profile', profile);
    
    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);
    $('#profile-image').attr('src', profile.profile_image);
}
