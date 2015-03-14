var apiUrl = "https://api.stackexchange.com/2.2/me";

$(document).ready(function() {
    //get profile information
    useProfileApi('?', setProfileInformation);

    //get badge information
    useProfileApi('/badges?', parseBadgeInformation);

    //get info on users tags
    useProfileApi('/tags?', setTagInformation);

    //get info on users favorite quetions
    useProfileApi('/favorites?', parseFavoritesInformation);

    //get the information needed to create a timeline of users rep gains and activity
     useProfileApi('/reputation?').then(function(data){
         var reputationInfo = data;
         useProfileApi('/mentioned?').then(function(data){
            var mentionedInfo = data;
            useProfileApi('/timeline?').then(function(data){
                var timelineInfo = data;
                createTimeline(reputationInfo, mentionedInfo, timelineInfo);
            });
         });
     });
 
});

function useProfileApi(call, callback) {
    if (callback !== undefined) {
        $.ajax({
            url : apiUrl + call,
            data : {
                'access_token' : sessionStorage.getItem('accessToken'),
                'site' : 'stackoverflow',
                'key' : sessionStorage.getItem('key')
            }
        }).done(function(data) {
            callback(data);
        }).fail(function(data) {
            alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
        });
    } else {//This is for last 3 calls since all 3 need to be made for that component to be made. turns async off and shows a spinner in place of component till finished.
        //stackoverflow accepts time in unix ephoch milliseconds
        var lastMonth = moment().subtract(1, 'months').unix();
        var today = moment().unix();
        return $.ajax({
            url : apiUrl + call,
            data : {
                'access_token' : sessionStorage.getItem('accessToken'),
                'site' : 'stackoverflow',
                'key' : sessionStorage.getItem('key'),
                fromdate: lastMonth,
                todate: today,
                order: 'desc',
                sort: 'creation'
            },
            beforeSend : function() {
                //TODO load spinner in timeline area
            }
        });
    }
}

function createTimeline(repInfo, responses, timeLineInfo) {
   //clone the arrray of items out for easy use
   var repItems = repInfo.items.slice(0);
   var resItems = responses.items.slice(0);
   var timeItems = timeLineInfo.items.slice(0);
   
   this.createTimelineEvent = function(name, date, action, postId, commentId){
       if(name.indexOf('vote') != -1){
           name = "Reputation Change: &nbsp; (+/-)";
       }else if(name.indexOf('commented') != -1){
           name = "Commented on post: ";
       }else if(name.indexOf('badge') != -1){
           name = "Earned Badge for:";
       }
       
       var display = "<div class='timeline-item'><div class='item-top-half'><span>"+ name + "&nbsp; </span><span>"+ action +" &nbsp;</span><span>On: &nbsp;"+ moment.unix(date).format('MM-dd-YYYY') + "</span></div>";
       display += "<div class='item-bottom-half'><a href='http://stackoverflow.com/questions/"+postId+"/#"+commentId+"'><span> Post: http://stackoverflow.com/questions/"+postId+"/#"+commentId+"</span></a></div></div>";
       $('.timeline-events').append(display);
   };
   
   for(var i = 0; i < repItems.length; i++){
       this.createTimelineEvent(repItems[i].vote_type, repItems[i].on_date, repItems[i].reputation_change, repItems[i].post_id, '');
   }
   for(var j = 0; j < resItems.length; j++){
       this.createTimelineEvent("Response to comment", resItems[j].creation_date, '', resItems[j].post_id, resItems[j].comment_id);
   }
   for(var k = 0; k < timeItems.length; k++){
       this.createTimelineEvent(timeItems[k].timeline_type, timeItems[k].creation_date, timeItems[k].title, timeItems[k].post_id, '' );
   }
   
}

function parseFavoritesInformation(data) {
    this.createFavorites = function(title, tags, questionId, link){
        var display = "<a href='"+ link +"'><div class='favorite-question' id="+ questionId +"><h3>"+ title +"</h3><hr /><div class='favorite-tag-container'></div></div></a>" ;    
        $('.favorites').append(display);
        
        for(var i = 0; i < tags.length; i++){
            var appendTo =  $("#"+ questionId +" > .favorite-tag-container");
            createFavoriteTag(tags[i], appendTo, 'favorites-tag');
        }    
    };
    
    for(var i = 0; i < data.items.length; i++){
        this.createFavorites(data.items[i].title, data.items[i].tags, data.items[i].question_id, data.items[i].link);
    }
}

function setTagInformation(data) {
    this.createTag = function(name, count) {
        var display = "<div class='tag-container'><a href=''>" + name + " &nbsp;&nbsp; (" + count + ")</a></div>";
        $('.tag-cloud').append(display);
    };

    if (data.items.length > 7) {
        var length = 7;
    } else {
        var length = data.items.length;
    }

    for (var i = 0; i < length; i++) {
        this.createTag(data.items[i].name, data.items[i].count);
    }
    setClickHandler();
}

function setClickHandler(){
    $('.tag-cloud a').click(function(event){
          console.log(event);  
    });    
}

function parseBadgeInformation(data) {
    this.createBadge = function(count, name, rank, link) {
        var display = "<div class='badge-container'><span>" + count + " x </span><a href='" + link + "'> <div class='" + rank + "-badge'>" + name + "</div></a>";
        $(".badges").append(display);
    };

    //right now 9 fits pretty in my design, I might change later
    if (data.items.length > 9) {
        var length = 9;
    } else {
        var length = data.items.length;
    }

    for (var i = 0; i < length; i++) {
        this.createBadge(data.items[i].award_count, data.items[i].name, data.items[i].rank, data.items[i].link);
    }
}

function setProfileInformation(data) {
    var profile = data.items[0];
    //save for later use on the search and question page
    sessionStorage.setItem('user-profile', JSON.stringify(profile));
    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);
    $('#profile-image').attr('src', profile.profile_image);
    $('#website').text(profile.website);
    $('#accept-rate').text(function(){
      return profile.accept_rate > 0 ? profile.accept_rate : 0;  
    });
    $('#member-for').text(moment.unix(profile.creation_date).format("dddd, MMMM Do YYYY"));
    $('#bronze-badge-count').text(profile.badge_counts.bronze);
    $('#silver-badge-count').text(profile.badge_counts.silver);
    $('#gold-badge-count').text(profile.badge_counts.gold);
}

