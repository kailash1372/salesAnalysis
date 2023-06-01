google.charts.load('current', {'packages':['corechart','line']});
google.charts.setOnLoadCallback(drawMaxMinChart); 


var sales = [25,20,18,30,70,72,69,80,100,90];
var arr = getMaxAndMinAndSum();

function drawMaxMinChart() {
    
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Days');
    data.addColumn('number', 'Sales');
    data.addColumn({type:'string',role:'style'});
    data.addRows(sales.length);
    var i = 1;
    while(i<=sales.length){
        data.setCell(i-1,0,i,);
        data.setCell(i-1,1,sales[i-1]);
        if(sales[i-1]==arr[0])data.setCell(i-1,2,'green');
        if(sales[i-1]==arr[1])data.setCell(i-1,2,'red');

        i=i+1;
    }

    // Set chart options
    var options = {'title':'Max:Green||Min:Red',
                    'width':400,
                    'height':300};

    // Instantiate and draw our chart, passing in some options.

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data,options);
}

function getMaxAndMinAndSum(){
    var i=1;
    var arr = new Array(3);
    arr[0]=sales[0];
    arr[1]=sales[0];
    arr[2]=sales[0];

    while(i<sales.length){
        if(sales[i]>arr[0])arr[0] = sales[i];
        if(sales[i]<arr[1])arr[1] = sales[i];
        arr[2]+=sales[i];

        i=i+1;
    }

    return arr;
}