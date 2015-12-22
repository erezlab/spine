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
    facebokCallBackFunction = callbackFuction;
    FB.login(function () {
        FB.api('/me/photos', 'GET', {}, processPhotos);
    }, {scope: 'user_photos'});
}

function processPhotos(response) {
    for (i in response.data) {
        FB.api('/' + response.data[i].id + '/tags', 'GET', {}, processTags);
    }

    //process next page
    if ("next" in response.paging) {
        FB.api(response.paging.next, 'GET', {}, processPhotos)
    }else{
        facebokCallBackFunction(data);
    }

}

function processTags(response) {
    for (i in response.data) {
        for (j in response.data) {
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
            //}
        }
    }

    document.getElementById("output").innerHTML = JSON.stringify(data);
}
