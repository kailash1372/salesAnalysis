const docid = JSON.parse(sessionStorage.getItem('docid'));
const docRef = ref.collection("allproducts").doc(docid).collection("data").doc("January");
var fc = -1;
var vc = -1;
var sp = -1;

ref.collection("allproducts").doc(docid).get().then((doc) => {
    if (doc.exists) {
        fc = doc.data().fixedcost;
        vc = doc.data().variablecost;
        sp = doc.data().sellingprice;

        docRef.get().then((doc) => {
            if (doc.exists) {
                var info = doc.data();
                var size = Object.keys(info).length;
                var min = info[1];
                var max = info[1];

                google.charts.load('current', { packages: ['corechart', 'line'] });
                google.charts.setOnLoadCallback(drawchart);
                google.charts.setOnLoadCallback(drawMinMax);

                function drawchart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('number', 'Days');
                    data.addColumn('number', 'Expenditure');
                    data.addColumn('number', 'Revenue');
                    data.addRows(size + 1);
                    var i = 1;
                    data.setCell(0, 0, 0);
                    data.setCell(0, 1, fc);
                    data.setCell(0, 2, 0);
                    var expenditure = fc;
                    var revenue = 0;

                    while (i <= size) {
                        if(info[i]<min)min = info[i];
                        if(info[i]>max)max = info[i];
                        expenditure += info[i] * vc;
                        revenue += info[i] * sp;
                        data.setCell(i, 0, i);
                        data.setCell(i, 1, expenditure);
                        data.setCell(i, 2, revenue);
                        i = i + 1;
                    }

                    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                    var options = {
                        hAxis: {
                            format:"#"
                        }
                    };
                    chart.draw(data,options);
                }



                function drawMinMax(){
                    var data = new google.visualization.DataTable();
                    data.addColumn('number', 'Days');
                    data.addColumn('number', 'Sales');
                    data.addColumn({type:'string',role:'style'});
                    data.addRows(size+1);
                    var i = 1;
                    while(i<=size){
                        data.setCell(i,0,i,);
                        data.setCell(i,1,info[i]);
                        if(info[i]==max)data.setCell(i,2,'green');
                        if(info==min)data.setCell(i,2,'red');
                
                        i=i+1;
                    }
                
                    // Set chart options
                    var options = {'title':'Max:Green||Min:Red',
                                    'width':400,
                                    'height':300};
                
                    // Instantiate and draw our chart, passing in some options.
                
                    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
                    chart.draw(data,options);
                }
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
