const docRef = ref.collection("allproducts").doc(docid).collection("data").doc("january");
var info;
docRef.get().then((doc) => {
    if (doc.exists) {
        info = doc.data()
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});


var size = Object.keys(info).length;

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawchart);

function drawchart(){
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Days');
    data.addColumn('number', 'Sales');
    data.addRows(size+1);
    var i = 1;
    while(i<=size+1){
        data.setCell(i-1,0,i);
        data.setCell(i-1,1,info[i]);
        i=i+1;
    }






    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data);
}