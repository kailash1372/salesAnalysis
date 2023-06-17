//firebase section

var container = document.getElementById('productcontainer');
var productsArr = [];
const products = ref.collection("allproducts");
products.get().then(
  (querySnapshot) =>{
    querySnapshot.forEach((doc)=>{
      container.insertAdjacentHTML('afterbegin', '<div class="rounded-3 pcard"><div class="h5card"><h5>'+doc.id+'</h5></div><div class="btnclass"><button class="btn btn-success" onclick="addData(\''+doc.id+'\')">add data</button><button class="btn btn-warning" onclick="details(\''+doc.id+'\')">view details</button></div></div>');
      productsArr.push([doc.id,doc.data().sellingprice]);
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
var insightsArr = [];

function firstChartData(productsArr){
  for(var i=0;i<productsArr.length;i++){
    let pname = productsArr[i][0];
    let psellp = productsArr[i][1];
    // let psellp = [];
    // console.log(psellp)
    ref.collection("allproducts").doc(pname).collection("data").doc(jsmonthvalue).get().then((doc) => {
      if(doc.exists){
        var t = doc.data().total;
        insightsArr.push([pname,psellp,t]);
        var productData = [pname, t];
        productunitspermonth.push(productData);
        index = index + 1;
        if (i === productsArr.length) {
            drawProductSales();
        }
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
        addFirstInsights(insightsArr);
    });

}
var InsertHeading = "<h6>Insights</h6>"
var listStart = "<ul class=\"text-small\">"
var listEnd = "</ul>"
function addFirstInsights(insightsArr){
  let ele="";
  for(let i=0;i<insightsArr.length;i++){
    let pname = insightsArr[i][0];
    let psellp = insightsArr[i][1];
    let tot = insightsArr[i][2];
    let rev = tot*psellp;
    ele+="<li>Revenue generated by "+"<span class=\"bold\">"+pname+"</span> is <span class=\"bold\">Rs."+rev+"</span></li>"
  }
  document.getElementById('musDescription').innerHTML = InsertHeading+listStart+ele+listEnd;
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
      addSecondInsights(arr);
  });
  
}
var bolds = "<span class=\"bold\">"
var bolde = "</span>"
function addSecondInsights(arr){
  let fSales = arr[1][1];
  let lSales = arr[12][1];
  let l1 = "<li>The total number of all product units from"+bolds+" January to December"+bolde+" are:<span class=\"bold\">"+lSales+"</span></li>"
  let l2 = "<li>The overall product trendline is <span class=\"bold\">increasing</span></li></ul>"
  if(fSales+100>lSales)p2 = "<li>The overall product trendline is<span class=\"bold\"> not increasing</span></li>"
  document.getElementById("mtDescription").innerHTML = InsertHeading+listStart+l1+l2+listEnd;
}


function drawPieChart(curVal,totVal){
    var a = [['Month','sales'],['This Month',curVal],['All Months',totVal-curVal]];

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        var data = google.visualization.arrayToDataTable(a);
        var chart = new google.visualization.PieChart(document.getElementById('pieChart'));
        chart.draw(data);
        addThirdInsights(a);
    });
}

function addThirdInsights(a){
  let l1 = "<li>Total units sold in this month:<span class=\"bold\">"+a[1][1]+"</span></li>"
  let l2 = "<li>Total units sold in the months before:<span class=\"bold\">"+a[2][1]+"</span></li>"
  document.getElementById("pcDescription").innerHTML = InsertHeading+listStart+l1+l2+listEnd;
}