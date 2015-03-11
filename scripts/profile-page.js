var apiUrl = "https://api.stackexchange.com/2.2";

$(document).ready(function() {
    //get profile information
    $.ajax({
        url : apiUrl + '/me?',
        data : {
            'access_token' : sessionStorage.getItem('accessToken'),
            'site' : 'stackoverflow',
            'key' : sessionStorage.getItem('key')
        },
        success : function(data) {
            console.log(data);
            setProfileInformation(data.items[0]);
        },
        error : function(data) {
            alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
        }
    });
    
    //get badge information
    var badgeInfo = useProfileApi('badges?');
    parseBadgeInformation(badgeInfo);
    
    //get info on users tags
    var tagsInfo = useProfileApi('tags?');
    setTagInformation(tagsInfo);
    
    //get info on users favorite quetions
    var favoriteInfo = useProfileApi('favorites?');
    parseFavoritesInformation(favoriteInfo);
    
    //get the information needed to create a timeline of users rep gains and activity
    var reputationInfo = useProfileApi('reputation?');
    var mentionedInfo = useProfileApi('mentioned?');
    var timelineInfo = useProfileApi('timeline?');
    createTimeline(reputationInfo, mentionedInfo, timelineInfo);

});

function setProfileInformation(profile) {
    //save for later use on the search and question page
    sessionStorage.setItem('user-profile', profile);

    $('#user-name').text(profile.display_name);
    $('#user-rep').text(profile.reputation);
    $('#profile-image').attr('src', profile.profile_image);
    $('#website').text(profile.website);
    $('#accept-rate').text(profile.accept_rate);
    $('#member-for').text(
        moment(profile.creation_date, 'YYYYMMDD').fromNow()
    );
    $('#bronze-badge-count').text(profile.badge_counts.bronze);
    $('#silver-badge-count').text(profile.badge_counts.silver);
    $('#gold-badge-count').text(profile.badge_counts.gold);
}

function useProfileApi(call) {
    $.ajax({
        url : apiUrl + '/me/' + call,
        data : {
            'access_token' : sessionStorage.getItem('accessToken'),
            'site' : 'stackoverflow',
            'key' : sessionStorage.getItem('key')
        },
        success : function(data){
            console.log(data);
            return data;
        },    
        error : function(data) {
            alert("The following error occured: " + data.error_id + " \n and the server says: " + data.error_message);
        }
    });
}
