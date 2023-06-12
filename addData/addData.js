var productname =JSON.parse(sessionStorage.getItem('docid'));

var monthvalue;

function changevalue(month){
    document.getElementById('changeval').innerHTML = month
    monthvalue = month
}

async function addData() {
    try {
        var data = document.getElementById('dataentry').value;
        data = data.split(',').map(function(item){
            return parseInt(item,10);
        });
        var size = data.length;
        var total=0;
        for (var i = 1; i <=size; i++) {
            total+=data[i-1];
            var info = {};
            info[i] = data[i-1];

            await ref
                .collection("allproducts")
                .doc(productname)
                .collection("data")
                .doc(monthvalue)
                .set(info, { merge: true }
            );
        }

        await ref
            .collection("allproducts")
            .doc(productname)
            .collection("data")
            .doc(monthvalue)
            .set({total:total}, { merge: true }
        );
        

        window.location.href = "../products/products.html";
    } catch (error) {
        console.log("Error adding product: ", error);
    }
}   