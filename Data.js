/**
 * Created by tian on 12/21/15.
 */


function facebookDictionaryToMatrix(fb_dict) {
    var names = Object.keys(fb_dict);
    var data = [];
    for (var i = 0; i < names.length; i++) {
        data.push([]);
        for (var j = 0; j < names.length; j++) {
            data[i].push(fb_dict[data[i]][data[j]]);
        }
    }

    return data;
}