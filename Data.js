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
    displayClusters(data,names,"clusterOutput");
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

function displayClusters(matrix, labels, div_id){
    var edge_data = [];
    for (var i in labels) {
        for (var j in labels) {
            if(matrix[i][j] != null) {
                edge_data.push({source: labels[i], target: labels[j], weight: 1/matrix[i][j]});
            }
        }
    }

    var community = jLouvain().nodes(labels).edges(edge_data);

    var result = community();

    var bins = {};
    var max_bin = 0;
    for(var name in result){
        if(result[name] > max_bin){
            max_bin = result[name];
        }
        if(!(result[name] in bins)){
            bins[result[name]] = [name];
        }else{
            bins[result[name]].push(name);
        }
    }

    var list = document.createElement("UL");
    for(var i = 0; i<=max_bin; i++){
        var list_group_node = document.createElement("LI");
        list_group_node.appendChild(document.createTextNode("Cluster " + i));

        var group_list = document.createElement("UL");

        for(var j in bins[i]){
            var temp_list_item = document.createElement("LI");
            temp_list_item.appendChild(document.createTextNode(bins[i][j]));
            group_list.appendChild(temp_list_item);
        }

        list_group_node.appendChild(group_list);
        list.appendChild(list_group_node);
    }

    document.getElementById(div_id).appendChild(list);

}
