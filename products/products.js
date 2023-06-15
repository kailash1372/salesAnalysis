//firebase section

var container = document.getElementById('productcontainer');
var productsArr = [];
const products = ref.collection("allproducts");
products.get().then(
  (querySnapshot) =>{
    querySnapshot.forEach((doc)=>{
      container.insertAdjacentHTML('afterbegin', '<div class="rounded-3 pcard"><div class="h5card"><h5>'+doc.id+'</h5></div><div class="btnclass"><button class="btn btn-success" onclick="addData(\''+doc.id+'\')">add data</button><button class="btn btn-warning" onclick="details(\''+doc.id+'\')">view details</button></div></div>');
      productsArr.push(doc.id);
      if(productsArr.length==querySnapshot.size)firstChartData(productsArr);
    });
})
.catch((error) => {
  console.log('Error getting product names: ', error);
});


function addProduct(){
    window.location.href ="../addProduct/addProduct.html";
}

function addData(docid){
    sessionStorage.setItem('docid',JSON.stringify(docid));
    window.location.href = "../addData/addData.html";
}

function details(docid){

    sessionStorage.setItem('docid',JSON.stringify(docid));
    window.location.href = "../details/details.html"    
}

var date = new Date();
date = date.toDateString();
date = date.split(' ');

const jsMonth = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
const monthMap = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}
var jsmonthvalue = monthMap[jsMonth[date[1]]];

var productunitspermonth = [['productName', 'monthlySales']];
var index = 0;

function firstChartData(productsArr){
  for(var i=0;i<productsArr.length;i++){
    let pname = productsArr[i];
    ref.collection("allproducts").doc(pname).collection("data").doc(jsmonthvalue).get().then((doc) => {
      var t = doc.data().total;
      var productData = [pname, t];
      productunitspermonth.push(productData);
      index = index + 1;
      if (index === productsArr.length) {
          drawProductSales();
      }
    });
  }
}
function drawProductSales() {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(() => {
        var data = google.visualization.arrayToDataTable(productunitspermonth);
        var chart = new google.visualization.ColumnChart(document.getElementById('monthlyunitssold'));
        chart.draw(data);
    });
}
const MonthMap = new Map();
var times = 0;
var totalDocs = 0;

async function fetchData() {
  const querySnapshot = await ref.collection("allproducts").get();
  totalDocs = querySnapshot.size;
  for (const doc of querySnapshot.docs) {
    times++;
    var pname = doc.id;
    var sp = doc.data().sellingprice;
    var m = 0;
    const innerSnapshot = await ref.collection("allproducts").doc(pname).collection("data").get();

    innerSnapshot.forEach((doc) => {
      if (MonthMap.has(doc.id)) {
        MonthMap.set(doc.id, MonthMap.get(doc.id) + doc.data().total);
      } else {
        MonthMap.set(doc.id, doc.data().total);
      }
      m++;
    //   console.log(times + " " + m)
      if (times === totalDocs && m === 12) {
        monthlyTrend(MonthMap);
      }
    });
  }
}

fetchData();

function monthlyTrend(MonthMap) {
  var arr = [['Month','Sales']];
  var t = 0;
  for (var i = 1; i <= 12; i++) {
    var temp = [monthMap[i].substring(0,3), MonthMap.get(monthMap[i])];
    arr.push(temp);
    t+=MonthMap.get(monthMap[i]);
    if(monthMap[i]==jsmonthvalue)drawPieChart(MonthMap.get(monthMap[i]),t)
  }

  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(() => {
      var data = google.visualization.arrayToDataTable(arr);
      var chart = new google.visualization.LineChart(document.getElementById('monthlytrend'));
      chart.draw(data);
  });
  
}


function drawPieChart(curVal,totVal){
    var a = [['Month','sales'],['This Month',curVal],['All Months',totVal-curVal]];

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        var data = google.visualization.arrayToDataTable(a);
        var chart = new google.visualization.PieChart(document.getElementById('pieChart'));
        chart.draw(data);
    });
}