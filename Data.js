/**
 * Created by tian on 12/21/15.
 */


function facebookDictionaryToMatrix(fb_dict) {
    var names = Object.keys(fb_dict);
//    names.sort(function(a, b){return names_score[names.indexOf(b)]-names_score[names.indexOf(a)]})
    var data = [];
    for (var i = 0; i < names.length; i++) {
        data.push([]);
        for (var j = 0; j < names.length; j++) {
            data[i].push(fb_dict[names[i]][names[j]]);
        }
    }

    console.log(JSON.stringify(names));
    console.log(JSON.stringify(data));

    visualizeMatrix(data, names, "myDiv");
    return data;
}

function visualizeMatrix(matrix, labels, div_id){
    var data = [
        {
            z: matrix,
            x: labels,
            y: labels,
            type: 'heatmap'
        }
    ];

    Plotly.newPlot(div_id, data);
}