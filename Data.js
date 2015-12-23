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
    facebook_data = fb_dict;
    visualizeMatrix(data, names, "myDiv");
    displayClusters(data, names, "clusterOutput");
    return data;
}

function visualizeMatrix(matrix, labels, div_id) {
    var data = [
        {
            z: matrix,
            x: labels,
            y: labels,
            type: 'heatmap'
        }
    ];

    var layout = {
        width: 1024,
        height: 1024
    }

    Plotly.newPlot(div_id, data, layout);

}

function visualize_reordered(fb_data, bins){
    var names = [];
    for(var i in bins){
        for(var j in bins[i]){
            names.push(bins[i][j]);
        }
    }

    var data = [];
    for (var i = 0; i < names.length; i++) {
        data.push([]);
        for (var j = 0; j < names.length; j++) {
            data[i].push(fb_data[names[i]][names[j]]);
        }
    }

    visualizeMatrix(data, names, 'reordered_output');
}

function visualizeClusters(matrix, labels, cluster_mapping, div_id) {
    var new_matrix = [];
    var cluster_color_mapping = {};
    var max_num_clusters = 0;

    for (var i in labels) {
        if (cluster_mapping[labels[i]] > max_num_clusters) {
            max_num_clusters = cluster_mapping[labels[i]];
        }
    }

    max_num_clusters = max_num_clusters + 1;
    for (var i in labels) {
        for (var j in labels) {
            if (cluster_mapping[labels[i]] == cluster_mapping[labels[j]]) {
                matrix[i][j] = cluster_mapping[labels[i]];
            } else if (matrix[i][j] != null) {
                matrix[i][j] = max_num_clusters;
            }
        }
    }

    var color_scale = [];
    for (var i = 0; i <= max_num_clusters; i++) {
        var rand255 = Math.floor(Math.random() * 255);
        var random_color = 'rgb(' + rand255 + ', ' + rand255 + ', ' + rand255 + ')';
        color_scale.push([i / max_num_clusters, random_color]);
        color_scale.push([(i + 1) / max_num_clusters, random_color]);
    }

    var data = [
        {
            z: matrix,
            x: labels,
            y: labels,
            colorscale: color_scale,
            colorbar:{
                autotick: false,
                tick0: 0,
                dtick: 1
            },
            type: 'heatmap'

        }

    ];

    var layout = {
        width: 1024,
        height: 1024
    }

    console.log(color_scale);

    Plotly.newPlot(div_id, data, layout);
}
function displayClusters(matrix, labels, div_id) {
    var edge_data = [];
    for (var i in labels) {
        for (var j in labels) {
            if (matrix[i][j] != null) {
                edge_data.push({source: labels[i], target: labels[j], weight: 1 / matrix[i][j]});
            }
        }
    }

    var community = jLouvain().nodes(labels).edges(edge_data);

    var result = community();

    var bins = {};
    var max_bin = 0;
    for (var name in result) {
        if (result[name] > max_bin) {
            max_bin = result[name];
        }
        if (!(result[name] in bins)) {
            bins[result[name]] = [name];
        } else {
            bins[result[name]].push(name);
        }
    }

    var list = document.createElement("UL");
    for (var i = 0; i <= max_bin; i++) {
        var list_group_node = document.createElement("LI");
        list_group_node.appendChild(document.createTextNode("Cluster " + i));

        var group_list = document.createElement("UL");

        for (var j in bins[i]) {
            var temp_list_item = document.createElement("LI");
            temp_list_item.appendChild(document.createTextNode(bins[i][j]));
            group_list.appendChild(temp_list_item);
        }

        list_group_node.appendChild(group_list);
        list.appendChild(list_group_node);
    }

    document.getElementById(div_id).appendChild(list);

    visualizeClusters(matrix, labels, result, 'cluster_color_output')
    visualize_reordered(facebook_data, bins);
}
