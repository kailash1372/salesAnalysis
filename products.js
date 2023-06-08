//google charts section

google.charts.load('current', {'packages':['corechart','line']});
google.charts.setOnLoadCallback(drawMaxMinChart); 

var size = Object.keys(d).length;
var arr = getMaxAndMinAndSum();

function drawMaxMinChart() {
    
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Days');
    data.addColumn('number', 'Sales');
    data.addColumn({type:'string',role:'style'});
    data.addRows(size+1);
    var i = 1;
    while(i<=size+1){
        data.setCell(i-1,0,i,);
        data.setCell(i-1,1,d[i-1]);
        if(d[i-1]==arr[0])data.setCell(i-1,2,'green');
        if(d[i-1]==arr[1])data.setCell(i-1,2,'red');

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
    arr[0]=d[1];
    arr[1]=d[1];
    arr[2]=d[1];

    while(i<=size+1){
        if(d[i]>arr[0])arr[0] = d[i];
        if(d[i]<arr[1])arr[1] = d[i];
        arr[2]+=d[i];
        //console.log("min:"+arr[1]+d[1])

        i=i+1;
    }

    return arr;
}







//firebase section

var email;
ref.get().then((doc)=>{
   if(doc.exists){
       companyName = doc.data().companyName;
       document.getElementById('logout').innerHTML = companyName;
   }
   else{
       console.log("doc dont exists");
   }
});


var container = document.getElementById('productcontainer');

const products = ref.collection("allproducts");
products.get().then(
   (querySnapshot) =>{
       querySnapshot.forEach((doc)=>{
           container.insertAdjacentHTML('afterbegin', '<div class="rounded-3 pcard"><h5>'+doc.id+'</h5><button class="btn btn-warning detailsbtn" onclick="details(\''+doc.id+'\')">view details</button></div>');
       });
})
.catch((error) => {
    console.log('Error getting product names: ', error);
});


function addProduct(){
    window.location.href ="./addProduct.html";
}  
var cName=1;
function logout(){
    if(cName==1){
        document.getElementById('logout').innerHTML = "logout";
        cName=0;
    }
    else{
        firebase.auth().signOut().then(() => {
            alert("signout success");
            window.location.href = "./login.html";
          }).catch((error) => {
            console.log(error);
          });
    }
}

function details(docid){

    sessionStorage.setItem('docid',JSON.stringify(docid));
    window.location.href = "./details.html"
    const detRef = ref.collection("allproducts").doc(docid).collection("data").doc("january");
    detRef.get().then((doc)=>{
        if(doc.exists){
            var info = doc.data();
            
        }
        else{
            console.log("no such document exists")
        }
    })
    
}