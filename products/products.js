//firebase section

var container = document.getElementById('productcontainer');

const products = ref.collection("allproducts");
products.get().then(
   (querySnapshot) =>{
       querySnapshot.forEach((doc)=>{
           container.insertAdjacentHTML('afterbegin', '<div class="rounded-3 pcard"><div class="h5card"><h5>'+doc.id+'</h5></div><div class="btnclass"><button class="btn btn-success" onclick="addData(\''+doc.id+'\')">add data</button><button class="btn btn-warning" onclick="details(\''+doc.id+'\')">view details</button></div></div>');
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

jsMonth = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
monthMap = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}
jsmonthvalue = monthMap[jsMonth[date[1]]];

var productunitspermonth = [['productName', 'monthlySales']];
var index = 0;

ref.collection("allproducts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const productname = doc.id;
        ref.collection("allproducts").doc(productname).collection("data").doc(jsmonthvalue).get().then((doc) => {
            var t = doc.data().total;
            var productData = [productname, t];
            productunitspermonth.push(productData);
            index = index + 1;

            if (index === querySnapshot.size) {
                drawMonthlySales();
            }
        });
    });
});

function drawMonthlySales() {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(() => {
        var data = google.visualization.arrayToDataTable(productunitspermonth);
        var chart = new google.visualization.ColumnChart(document.getElementById('monthlyunitssold'));
        chart.draw(data);
    });
}


// ref.collection("allproducts").get().then((querySnapshot)=>{
//     querySnapshot.forEach((doc)=>{

//     });
// });
