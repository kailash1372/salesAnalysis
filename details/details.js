const docid = JSON.parse(sessionStorage.getItem('docid'));
document.getElementById('pname').innerHTML = docid;
const docRef = ref.collection("allproducts").doc(docid).collection("data");
var fc = -1;
var vc = -1;
var sp = -1;

var date = new Date();
date = date.toDateString();
date = date.split(' ');

const jsMonth = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
const monthMap = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}
var jsmonthvalue = monthMap[jsMonth[date[1]]];

const MonthMap = new Map();
const everyMonthTotal = new Map();
ref.collection("allproducts").doc(docid).get().then((doc)=>{
    fc = doc.data().fixedcost;
    vc = doc.data().variablecost;
    sp = doc.data().sellingprice;
    ref.collection("allproducts").doc(docid).collection("data").get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            everyMonthTotal.set(doc.id,doc.data().total);
            if(doc.id==jsmonthvalue){drawMinandMax(doc.data());drawCurMonthTrend(doc.data())}
            if(everyMonthTotal.size==querySnapshot.size){drawBEA(fc,vc,sp);drawQtrend();}
        });
    });
});
function drawBEA(fc,vc,sp){
    let sorted = [['Month','Revenue','Expenses']]
    let revenue = 0;
    let expense= fc;
    for(let i=1;i<=12;i++){
        // ordered.push([monthMap[i],everyMonthTotal.get(monthMap[i])]);
        let total = everyMonthTotal.get(monthMap[i]);
        revenue+=(total*sp);
        expense+=(total*vc);
        let temp = [monthMap[i],revenue,expense];
        sorted.push(temp);
    }
    // ['January', 139765, 527953],['February', 281020, 556204],['March', 465160, 593032],['April', 671485, 634297],['May', 937595, 687519],['June', 1251090, 750218],['July', 1612335, 822467],['August', 2034415, 906883],['September', 2532855, 1006571],['October', 3133635, 1126727],['November', 3794500, 1258900]['December', 4512335, 1402467]
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(sorted);
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        var options = {
            hAxis: {
                format:"#"
            }
        };
        chart.draw(data,options);
    });
}

function drawMinandMax(obj){
    let size = Object.keys(obj).length-1;
    let minmax = getMinMax(obj,size);
    let arr = [['Day','Sales',{role:'style'}]]
    for(let i=1;i<=size;i++){
        let temp = []
        if(obj[i]==minmax[0])temp = [i,obj[i],'green']
        else if(obj[i]==minmax[1])temp = [i,obj[i],'red']
        else temp = [i,obj[i],'#3366cc']
        arr.push(temp);
    }
    google.charts.load('current',{packages:['corechart']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(arr);
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
        chart.draw(data);
    });
}

function getMinMax(obj,size){
    let minmax= new Array(2);
    minmax[0] = obj[1]
    minmax[1] = obj[1]
    for(let i=2;i<=size;i++){
        if(obj[i]>minmax[0])minmax[0] = obj[i];
        if(obj[i]<minmax[1])minmax[1] = obj[i];
    }
    return minmax;
}

function drawCurMonthTrend(obj){
    let size = Object.keys(obj).length-1;
    let arr = [['Day','Sales']]
    for(let i=1;i<=size;i++)arr.push([i,obj[i]]);
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(arr);
        var chart = new google.visualization.LineChart(document.getElementById('curMonthTrend'));
        chart.draw(data);
    });
}


function drawQtrend(){
    let q1=[['Month','Total Sales']];
    let q2=[['Month','Total Sales']];
    let q3=[['Month','Total Sales']];

    for(let i=1;i<=12;i++){
        if(i<=4){
            q1.push([monthMap[i],everyMonthTotal.get(monthMap[i])]);
        }
        else if(i<=8){
            q2.push([monthMap[i],everyMonthTotal.get(monthMap[i])]);
        }
        else{
            q3.push([monthMap[i],everyMonthTotal.get(monthMap[i])]);
        }
    }

    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(q1);
        var chart = new google.visualization.ColumnChart(document.getElementById('q1bar'));
        chart.draw(data);
        var chart = new google.visualization.LineChart(document.getElementById('q1line'));
        chart.draw(data);

    });
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(q2);
        var chart = new google.visualization.ColumnChart(document.getElementById('q2bar'));
        chart.draw(data);
        var chart = new google.visualization.LineChart(document.getElementById('q2line'));
        chart.draw(data);
    });
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(q3);
        var chart = new google.visualization.ColumnChart(document.getElementById('q3bar'));
        chart.draw(data);
        var chart = new google.visualization.LineChart(document.getElementById('q3line'));
        chart.draw(data);

    });
}

// ref.collection("allproducts").doc(docid).get().then((doc) => {
//     if (doc.exists) {
//         fc = doc.data().fixedcost;
//         vc = doc.data().variablecost;
//         sp = doc.data().sellingprice;

//         docRef.get().then((doc) => {
//             if (doc.exists) {
//                 var info = doc.data();
//                 var size = Object.keys(info).length;
//                 var min = info[1];
//                 var max = info[1];

//                 google.charts.load('current', { packages: ['corechart', 'line'] });
//                 google.charts.setOnLoadCallback(drawchart);
//                 google.charts.setOnLoadCallback(drawMinMax);

//                 function drawchart() {
//                     var data = new google.visualization.DataTable();
//                     data.addColumn('number', 'Days');
//                     data.addColumn('number', 'Expenditure');
//                     data.addColumn('number', 'Revenue');
//                     data.addRows(size + 1);
//                     var i = 1;
//                     data.setCell(0, 0, 0);
//                     data.setCell(0, 1, fc);
//                     data.setCell(0, 2, 0);
//                     var expenditure = fc;
//                     var revenue = 0;

//                     while (i <= size) {
//                         if(info[i]<min)min = info[i];
//                         if(info[i]>max)max = info[i];
//                         expenditure += info[i] * vc;
//                         revenue += info[i] * sp;
//                         data.setCell(i, 0, i);
//                         data.setCell(i, 1, expenditure);
//                         data.setCell(i, 2, revenue);
//                         i = i + 1;
//                     }

//                     var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
//                     var options = {
//                         hAxis: {
//                             format:"#"
//                         }
//                     };
//                     chart.draw(data,options);
//                 }



//                 function drawMinMax(){
//                     var data = new google.visualization.DataTable();
//                     data.addColumn('number', 'Days');
//                     data.addColumn('number', 'Sales');
//                     data.addColumn({type:'string',role:'style'});
//                     data.addRows(size+1);
//                     var i = 1;
//                     while(i<=size){
//                         data.setCell(i,0,i,);
//                         data.setCell(i,1,info[i]);
//                         if(info[i]==max)data.setCell(i,2,'green');
//                         if(info==min)data.setCell(i,2,'red');
                
//                         i=i+1;
//                     }
                
//                     // Set chart options
//                     var options = {'title':'Max:Green||Min:Red',
//                                     'width':400,
//                                     'height':300};
                
//                     // Instantiate and draw our chart, passing in some options.
                
//                     var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
//                     chart.draw(data,options);
//                 }
//             } else {
//                 console.log("No such document!");
//             }
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//     } else {
//         console.log("No such document!");
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });
