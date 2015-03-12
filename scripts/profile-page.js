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
        return $.ajax({
            url : apiUrl + call,
            data : {
                'access_token' : sessionStorage.getItem('accessToken'),
                'site' : 'stackoverflow',
                'key' : sessionStorage.getItem('key')
            },
            beforeSend : function() {
                //TODO load spinner in timeline area
            }
        });
    }
}

function createTimeline(repInfo, responses, timelineInfo) {
   
}

function parseFavoritesInformation(data) {
    var self = this;
    this.createFavorites = function(title, tags, questionId, link){
        var display = "<a href='"+ link +"'><div class='favorite-question' id="+ questionId +"><h3>"+ title +"</h3><hr /><div class='favorite-tag-container'></div></div></a>" ;    
        $('.favorites').append(display);
        
        for(var i = 0; i < tags.length; i++){
            self.createFavoriteTag(tags[i], questionId);
        }    
    };
    
    this.createFavoriteTag = function(tag, questionId){
        var display = "<div class='favorites-tag'>"+tag+"</div>";
        $("#"+ questionId +" > .favorite-tag-container").append(display);
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
    sessionStorage.setItem('user-profile', profile);

    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);
    $('#profile-image').attr('src', profile.profile_image);
    $('#website').text(profile.website);
    $('#accept-rate').text(profile.accept_rate);
    $('#member-for').text(moment.unix(profile.creation_date).format("dddd, MMMM Do YYYY"));
    $('#bronze-badge-count').text(profile.badge_counts.bronze);
    $('#silver-badge-count').text(profile.badge_counts.silver);
    $('#gold-badge-count').text(profile.badge_counts.gold);
}

