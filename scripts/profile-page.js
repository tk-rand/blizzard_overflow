var apiUrl = "https://api.stackexchange.com/2.2";

$(documen).ready(function(){
   //get profile information
   $.ajax({
       url: apiUrl + '/me?',
       data: {'access_token': sessionStorage.getItem('accessToken'), 'site': 'stackoverflow'},
       success: function(data){
           console.log(data);
       }
   }); 
});
