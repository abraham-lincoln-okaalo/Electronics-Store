import prodb, {bulkcreate, getData, Sortobj, createEle} from "./Module.js";

let db = prodb("Productdb", {
    products:`++id, name, seller, price`
});

// input tags
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

// buttons
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");




// insert values using the create button
btncreate.onclick = (event) => {
    let flag = bulkcreate(db.products, {
        name:proname.value,
        seller:seller.value,
        price:price.value
    })

    /*proname.value="";
    seller.value="";
    price.value=""*/

    proname.value=seller.value=price.value="";

    // set id textboox value
    getData(db.products, data => {
        userid.value=data.id + 1 || 1;
    });

    table();

    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg); 
}

// create a read event on read button 
btnread.onclick = table;

// update event
btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if(id){
        // call dexie's update method
        db.products.update(id, {
            name:proname.value,
            seller:seller.value,
            price:price.value
        }).then((updated) =>{
            // let get = updated ? `data Updated` : `Couldn't update data`;

            let get = updated ? true : false;

            let updatemsg = document.querySelector(".updatemsg");
            getMsg(get, updatemsg);

            proname.value=seller.value=price.value="";

            console.log(get)
        })
    } else {
        console.log(`Please select id:${id}`);
    }
}


// delete all records
btndelete.onclick = () => {
    db.delete();
    db = prodb("Productdb", {
        products:`++id, name, seller, price`
    });
    db.open();
    table();
    textID(userid);

    // display message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
}

// window onload event
window.onload = event => {

    // set txtbox id value
    textID(userid);
}

// textbox id
function textID(textboxid){
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    });
}

function table(){
    const tbody = document.getElementById("tbody");

    // not found
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";

    // remove all child items from the dom 
    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.products, (data, index) => {
        if(data){
            createEle("tr", tbody, tr =>{
                for (const value in data) {
                    createEle("td", tr, td => {
                        td.textContent = data.price === data[value] ? `$ ${data[value]}`: data[value];
                    })
                }
                createEle("td", tr, td => {
                    createEle('i',td, i => {
                        i.className += "fas fa-edit btnedit";
                        i.setAttribute(`data-id`,data.id);

                        // store number of edit buttons
                        i.onclick = editbtn;
                    })
                })
                createEle("td", tr, td => {
                    createEle("i",td, i => {
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute(`data-id`,data.id);
                        i.onclick = deletebtn;
                    });
                })
            });
        }else {
            notfound.textContent = "No record found in the database...!";
        }
    })
}

const editbtn = event => {
    let id = parseInt(event.target.dataset.id);

    db.products.get(id, function (data) {
        let newdata = Sortobj(data);
        userid.value = newdata.id || 0;
        proname.value = newdata.name || "";
        seller.value = newdata.seller || "";
        price.value = newdata.price || "";
    });

}

// delete icon remove element
const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
}

// function msg
function getMsg(flag, element){
    if(flag){
        // call msg
        element.className += "movedown";
        setTimeout(()=>{
            element.classList.forEach(classname => {
                classname == "movedown" ? undefined : element.classList.remove("movedown");
            })
        }, 4000);
    }
}
