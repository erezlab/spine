/**
 * Created by tian on 12/21/15.
 */

function loginCallback(fb_dict) {

    document.getElementById("importing").style.display = 'none';
    document.getElementById("fb_login_btn").style.display = 'none';
    document.getElementById("square_row").style.display = '';


    var adj_matrix_labels = Object.keys(fb_dict);
    var adj_matrix = facebookDictionaryToMatrix(fb_dict, adj_matrix_labels);
    var cluster_mapping = computeClusters(adj_matrix, adj_matrix_labels);

    //  visualizeMatrix(adj_matrix, adj_matrix_labels, "myDiv");
    var d3_object = createD3jsonObject(fb_dict, cluster_mapping);

    var clusters = generateClusterLists(d3_object);

    document.getElementById('square_row').style.display= '';

    var order_function = runD3(d3_object, clusters, "square", "lists", document.getElementById("square_row").offsetWidth);
    order_function(document.getElementById("order").value);

    var anon_data = facebookDictionaryToMatrix(fb_dict, adj_matrix_labels);
    for(var i in anon_data){
        for(var j in anon_data[i]){
            if(anon_data[i][j] == null){
                anon_data[i][j] = 0;
            }
        }
    }
    document.getElementById('anon_data').value = JSON.stringify(anon_data);
    document.getElementById('friend_count').disabled = true;
    document.getElementById('anon_id').value = Sha1.hash(my_id);
}

function facebookDictionaryToMatrix(fb_dict, names) {
    //Convert facebook matrix to a dictionary
    var data = [];
    for (var i = 0; i < names.length; i++) {
        data.push([]);
        for (var j = 0; j < names.length; j++) {
            data[i].push(fb_dict[names[i]][names[j]]);
        }
    }

//    facebook_data = fb_dict;
//    visualizeMatrix(data, names, );
//    displayClusters(data, names, "clusterOutput");
    return data;
}

function visualizeMatrix(matrix, labels, div_id) {
    //visualize a matrix, given labels, on a div with id, div_id

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


function computeClusters(matrix, labels) {
    var edge_data = [];
    for (var i in labels) {
        for (var j in labels) {
            if (matrix[i][j] != null) {
                edge_data.push({source: labels[i], target: labels[j], weight: 1 / matrix[i][j]});
            }
        }
    }

    var community = jLouvain().nodes(labels).edges(edge_data);
    return community();
}

function generateClusterLists(d3_object) {
    var clusters = {};

    //find max cluster
    var max = 0;
    for (var i in d3_object.nodes) {
        if (clusters[d3_object.nodes[i].group] == null) {
            clusters[d3_object.nodes[i].group] = "<ul><li style='color: #00CCFF'>" + d3_object.nodes[i].name + "</li>";
        } else {
            clusters[d3_object.nodes[i].group] = clusters[d3_object.nodes[i].group] + "<li style='color: #00CCFF'>" + d3_object.nodes[i].name + "</li>";
        }
    }

    for (var key in Object.keys(clusters)) {
        clusters[key] += "</li>";
    }

    return clusters;
}
function createD3jsonObject(fb_data, cluster_mapping) {

    var d3_obj = {"nodes": [], "links": []};

    var names = Object.keys(fb_data);

    for (var i in names) {
        d3_obj["nodes"].push({"name": names[i], "group": cluster_mapping[names[i]]});
        for (var j in names) {
            if (fb_data[names[i]][names[j]] != null) {
                d3_obj["links"].push({"source": i, "target": j, "value": fb_data[names[i]][names[j]]});
            }
        }
    }

    //console.log(JSON.stringify(d3_obj))
    return d3_obj;
    //document.getElementById('output').innerHTML = JSON.stringify(d3_obj);
}

function runD3(miserables, clusters, square_div_id, list_div_id, width) {

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        height = width;

    var x = d3.scale.ordinal().rangeBands([0, width]),
        z = d3.scale.linear().domain([0, 4]).clamp(true),
        c = d3.scale.category10().domain(d3.range(10));

    //var svg = d3.select("#square");
    var svg = d3.select("#" + square_div_id)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var matrix = [],
        nodes = miserables["nodes"],
        n = nodes.length;

    // Compute index per node.
    nodes.forEach(function (node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function (j) {
            return {x: j, y: i, z: 0};
        });
    });

    // Convert links to matrix; count character occurrences.
    miserables.links.forEach(function (link) {
        matrix[link.source][link.target].z += link.value;
        matrix[link.target][link.source].z += link.value;
        matrix[link.source][link.source].z += link.value;
        matrix[link.target][link.target].z += link.value;
        nodes[link.source].count += link.value;
        nodes[link.target].count += link.value;
    });

    // Precompute the orders.
    var orders = {
        name: d3.range(n).sort(function (a, b) {
            return d3.ascending(nodes[a].name, nodes[b].name);
        }),
        count: d3.range(n).sort(function (a, b) {
            return nodes[b].count - nodes[a].count;
        }),
        group: d3.range(n).sort(function (a, b) {
            return nodes[b].group - nodes[a].group;
        })
    };

    // The default sort order.
    x.domain(orders.name);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);

    var row = svg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) {
            return "translate(0," + x(i) + ")";
        })
        .each(row);

    row.append("line")
        .attr("x2", width);

    //row.append("text")
    //    .attr("x", -6)
    //    .attr("y", x.rangeBand() / 2)
    //    .attr("dy", ".1em")
    //    .attr("text-anchor", "end")
    //    .text(function (d, i) {
    //        return "";
    //        //return nodes[i].name;
    //    });

    var column = svg.selectAll(".column")
        .data(matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function (d, i) {
            return "translate(" + x(i) + ")rotate(-90)";
        });

    column.append("line")
        .attr("x1", -width);

    //column.append("text")
    //    .attr("x", 6)
    //    .attr("y", x.rangeBand() / 2)
    //    .attr("dy", ".1em")
    //    .attr("text-anchor", "start")
    //    .text(function (d, i) {
    //        return "";
    //        //return nodes[i].name;
    //    });


    function row(row) {
        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function (d) {
                return d.z;
            }))
            .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function (d) {
                return x(d.x);
            })
            .attr("width", x.rangeBand())
            .attr("height", x.rangeBand())
            .style("fill-opacity", function (d) {
                return z(d.z);
            })
            .style("fill", function (d) {
                return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null;
            })
            .on("click", mouseover);
        //.on("mouseout", mouseout);
    }

    function mouseover(p) {
        if (miserables.nodes[p.y].group == miserables.nodes[p.x].group) {
            $('#collapse' + miserables.nodes[p.y].group).collapse();
            //document.getElementById(list_div_id).innerHTML = clusters[miserables.nodes[p.y].group];
        }
    }

    d3.select("#order").on("change", function () {
        clearTimeout(timeout);
        order(this.value);
    });

    function order(value) {
        x.domain(orders[value]);

        var t = svg.transition().duration(2500);

        t.selectAll(".row")
            .delay(function (d, i) {
                return x(i) * 4;
            })
            .attr("transform", function (d, i) {
                return "translate(0," + x(i) + ")";
            })
            .selectAll(".cell")
            .delay(function (d) {
                return x(d.x) * 4;
            })
            .attr("x", function (d) {
                return x(d.x);
            });

        t.selectAll(".column")
            .delay(function (d, i) {
                return x(i) * 4;
            })
            .attr("transform", function (d, i) {
                return "translate(" + x(i) + ")rotate(-90)";
            });
    }

    var timeout = setTimeout(function () {
        order("group");
        d3.select("#order").property("selectedIndex", 2).node().focus();
    }, 5000);

    //print clusters
    var keys = Object.keys(clusters);
    keys.sort();
    keys.reverse();

    for (var key in keys) {
        console.log("INNER HTML ERROR");
        document.getElementById('lists').innerHTML = document.getElementById('lists').innerHTML +
            '<div class="panel panel-default" id="panel'+key+'"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-target="#collapse'+key+'" href="#collapse'+key+'"> Cluster #'+key+' </a> </h4> </div> <div id="collapse'+key+'" class="panel-collapse collapse in"> <div class="panel-body">'+clusters[key]+'</div> </div> </div>';
        $('.collapse').collapse()
    }

    return order;
}

