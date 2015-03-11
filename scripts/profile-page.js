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
       }
   }); 
});
