/**
 * Created by Tian on 11/5/2015.
 */

//To become the dictionary representing the graph
var data = {};

window.fbAsyncInit = function () {
    FB.init({
        appId: '882006358580431',
        xfbml: true,
        version: 'v2.5'
    });
};

(function (d, s, id) {

    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));

// Only works after `FB.init` is called
function myFacebookLogin(callbackFuction) {
    document.getElementById('importing_div').style.display = '';
    facebokCallBackFunction = callbackFuction;
    FB.login(function () {
        FB.api('/me?fields=id,birthday,context', 'GET', {}, function (response) {
            my_id = response.id;

            birthday = response.birthday;
            friend_count = response.context.mutual_friends.summary.total_count;
            document.getElementById('birthday').value = birthday.slice(6, 10) + "-" + birthday.slice(0, 2) + "-" + birthday.slice(3, 5);
            //document.getElementById('birthday').disabled = true;
            document.getElementById('friend_count').value = friend_count;
            //document.getElementById('friend_count').disabled = true;
            document.getElementById('anon_id').value = Sha1.hash(my_id);

            FB.api('/me/photos', 'GET', {}, processPhotos);
        });
    }, {scope: 'user_photos,user_friends,user_birthday'});
}


function processPhotos(response) {
    for (i in response.data) {
        FB.api('/' + response.data[i].id + '/tags', 'GET', {}, processTags);
    }

    //process next page
    if ("next" in response.paging) {
        FB.api(response.paging.next, 'GET', {}, processPhotos)
    } else {
        facebokCallBackFunction(data);
    }

}


loading_dot_counter = 0;
function processTags(response) {
    for (i in response.data) {
        for (j in response.data) {
            if (response.data[i].id != my_id && response.data[j].id != my_id) {
                //if (response.data[i].name != response.data[j].name) {
                if (response.data[i].name in data) {
                    if (response.data[j].name in data[response.data[i].name]) {
                        data[response.data[i].name][response.data[j].name] += 1;
                    } else {
                        data[response.data[i].name][response.data[j].name] = 1;
                    }
                } else {
                    data[response.data[i].name] = {};
                    data[response.data[i].name][response.data[j].name] = 1;
                }
            }
        }
    }

    loading_dot_counter = ((loading_dot_counter + 1) % 20);
    document.getElementById("importing").innerHTML = "Importing" + Array(loading_dot_counter).join(".");

    //document.getElementById("raw_data").value = JSON.stringify(data);
}
