$(document).ready(function(){
    LoadListProduct();

    EventChange();
});

var arrayProduct = [
    {
        id:1,
        name:"Iphone11",
        priceDisplay:"12.000.000",
        price:12000000,
        quantity:10,
        img:"./img/iphone1.jpg"
    },
    {
        id:2,
        name:"Iphone12",
        priceDisplay:"15.000.000",
        price:15000000,
        quantity:5,
        img:"./img/iphone2.jpg"
    },
    {
        id:3,
        name:"Iphone13",
        priceDisplay:"20.000.000",
        price:20000000,
        quantity:6,
        img:"./img/iphone3.jpg"
    },
    {
        id:4,
        name:"Iphone13 promax",
        priceDisplay:"25.580.000",
        price:25580000,
        quantity:6,
        img:"./img/iphone1.jpg"
    },
    {
        id:5,
        name:"Iphone14",
        priceDisplay:"36.190.000",
        price:36190000,
        quantity:8,
        img:"./img/iphone2.jpg"
    },
    {
        id:6,
        name:"Iphone14 promax",
        priceDisplay:"40.980.000",
        price:40980000,
        quantity:15,
        img:"./img/iphone3.jpg"
    },
];

var arrayShoppingCard = [];

function EventChange(){
    $(".card-plus-notify").on("click",function(){
        OpenModal("#md-shoppingcard-detail");

        LoadHTMLShoppingCardDetail();
    });

    $("#btn-pay").on("click",function(){
        $(".info-notify-pay").html("Thành toán đơn hàng thành công!");
        $(".count-shoppingCard").html(0);
        Refresh();
    });
}

function Refresh(){
    arrayShoppingCard = [];
}

function GetListProduct(){
    return arrayProduct;
}

function GetListShoppingCard(){
    return arrayShoppingCard;
}

function OpenModal(id){
    $(id).modal("show");
}

function CloseModal(id){
    $(id).modal("hide");
}

function AddShoppingCard(id){
    var listProduct = GetListProduct();

    listProduct.forEach(x=>{
        if(x.id == id){
            var shoppingCard = {
                id:x.id,
                name:x.name,
                priceDisplay:x.priceDisplay,
                price:x.price,
                quantity:1,
                img:x.img
            };

            if(arrayShoppingCard.length <= 0){
                arrayShoppingCard.push(shoppingCard);
            }else{
                var check = false;
                arrayShoppingCard.forEach(x=>{
                    if(x.id == shoppingCard.id){
                        x.quantity += 1;
                        check = true;
                    }
                });

                if(check == false){
                    arrayShoppingCard.push(shoppingCard);
                }
            }
        }
    });
}

function SetChangeCountShoppingCard(){
    var listShoppingCard = GetListShoppingCard();

    $(".count-shoppingCard").html(listShoppingCard.length);
}

function LoadListProduct(){
    var listProduct = GetListProduct();

    var html = "";
    var count = 1;
    listProduct.forEach(x=>{
        if(count == 1 || count == 4){
            html += '<div class="row">';
        }

        html += '<div class="col-4">';
        html += '<div class="card" style="width: 18rem;">';
        html += '<img class="card-img-top img-thumbnail"  src="'+ x.img +'" alt="Card image cap">';
        html += '<div class="card-body">';
        html += '<h5 class="card-title">'+ x.name +'</h5>';
        html += '<p class="card-price">Price : '+ x.priceDisplay +' VNĐ</p>';
        html += '<p class="card-quantity">Quantity : '+ x.quantity +'</p>';
        html += '<a class="btn btn-primary" onclick="EventAddShoppingCard('+ x.id +')"><i class="fa fa-plus" aria-hidden="true"></i> Add card</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        if(count == 3 || count == 6){
            html += '</div>';
        }

        count++;
    });

    $(".content-product").html(html);
}

async function EventAddShoppingCard(id){
    await AddShoppingCard(id);
    SetChangeCountShoppingCard();
}

function CreateHTMLTable(){
    var html = '';

    html += '<table class="table table-bordered" id="tbl-shoppingcard-detail">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>STT</th>';
    html += '<th>Image</th>';
    html += '<th>Product Name</th>';
    html += '<th>Quantity</th>';
    html += '<th>Price</th>';
    html += '<th>Total Amount</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    html += '</tbody>';
    html += '</table>';
    html += '<p class="info-notify-pay"></p>';
    html += '<p class="info-total-amount"></p>';

    $("#md-shoppingcard-detail .modal-body").html(html);
}

function LoadHTMLShoppingCardDetail(){
    var listShoppingCard = GetListShoppingCard();

    var html = "";

    if(listShoppingCard.length <= 0){
        html += '<p>Chưa có sản phẩm nào trong giỏ hàng</p>';
        $("#md-shoppingcard-detail .modal-body").html(html);
        return;
    }

    CreateHTMLTable();

    var count = 1;
    var totalAmount = 0;
    if(listShoppingCard.length > 0){
        listShoppingCard.forEach(x=>{
            html += '<tr>';

            html += '<td>' + count + '</td>';
            html += '<td><img width="50px" height="50px" src="'+ x.img +'"/></td>';
            html += '<td>' + x.name + '</td>';
            html += '<td style="text-align:center">';
            html += '<button class="btn btn-primary" onclick="EventReduce('+ x.id +')">-</button>';
            html += '<input style="width:50px;text-align:center" value="'+ x.quantity +'" readonly/>';
            html += '<button class="btn btn-primary" onclick="EventReDouble('+ x.id +')">+</button>';
            html += '</td>';
            html += '<td>' + x.priceDisplay + '</td>';
            html += '<td>' + formatMoney(x.quantity * x.price) + '</td>';

            html += '</tr>';

            count++;

            totalAmount += x.quantity * x.price;
        });
    }

    $(".info-total-amount").html('Tổng tiền : ' + formatMoney(totalAmount) + ' VNĐ');
    $("#tbl-shoppingcard-detail tbody").html(html);
}

function formatMoney(n) {
    return n.toFixed(0).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
    });
  }

function EventReduce(id){
    var listShoppingCard = GetListShoppingCard();

    if(listShoppingCard.length > 0){
        listShoppingCard.forEach(x=>{
            if(x.id == id){
                if(x.quantity > 0){
                    x.quantity -= 1;
                }
            }
        });
    }

    LoadHTMLShoppingCardDetail();
}

function EventReDouble(id){
    var listShoppingCard = GetListShoppingCard();

    if(listShoppingCard.length > 0){
        listShoppingCard.forEach(x=>{
            if(x.id == id){
                x.quantity += 1;
            }
        });
    }

    LoadHTMLShoppingCardDetail();
}

