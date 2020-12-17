// Untuk menghitung jumlah item, total item dan harga yang dipesan
var jumlahItem = 0;
var totalOrder = [];
var totalHarga = 0;
var text = "";

function plusMinus(input, namaItem, harga){
    var jenisItem = document.getElementById(namaItem).getAttribute("class");
    var value = parseInt(document.getElementById(namaItem).value);
    if (value < 1 && input == -1) {
        value = value;
    } else {
        value += input;
        jumlahItem += input;
        document.getElementById(namaItem).value = value;
        getOrder(namaItem,jenisItem,harga);
    }
}

function getOrder(namaItem, jenisItem, harga){
    var jumlah = document.getElementById(namaItem).value;
    var namaItem = namaItem.cleanString();
    var jenisItem = jenisItem;
    var harga = harga;

    /** Cek apakah di dalam array totalOrder sudah ada item itu atau belum
     * Jika sudah ada, remove yang sebelumnya dari array
     */
    for (var i = 0; i < totalOrder.length; i++) {
        if (totalOrder[i][1] == namaItem) {
            totalOrder.splice(i--,1);
            break;
        }
    }

    // Masukkan jumlah dan nama itemnya apa ke array untuk nanti ditampilkan
    totalOrder.push([jumlah,namaItem,harga]);
    // Hitung total harga
    totalHarga += harga;
    console.log(JSON.stringify(totalOrder));
    printOrderSum();
}

function printOrderSum(){
    text = "";
    for (var i = 0; i < totalOrder.length; i++) {
        // Ternyata tidak bisa diremove secara keseluruhan dengan JS, jadi diberi IF
        if (totalOrder[i][0] != "0") {
            text += "*" + totalOrder[i][0] + " " + totalOrder[i][1] + "<br>";
        }
    }

    if (text == "") {
        document.getElementById("total-order").style.removeProperty('text-transform');
        document.getElementById("total-order").innerHTML = "Wah belum ada pesanan nih..";
    } else {
        document.getElementById("total-order").style.textTransform = "capitalize";
        document.getElementById("total-order").innerHTML = text;
    }

    if (jumlahItem == 0) {
        document.getElementById("btnOrder").innerHTML = "Yuk pesan dulu~";
    } else {
        document.getElementById("btnOrder").innerHTML = jumlahItem + " item - " + totalHarga + " - Pesan Sekarang!";
    }
}

function simpanOrder(){
    var message = "Hai " + document.getElementById("customer").innerHTML + ",\n\n" + 
            "Terima kasih telah memesan di Jajan Skuy, berikut review pesanannya :" + "\n\n" + text +
            "\n\n" + "Mohon ditunggu ya kak, pesanannya sedang kami proses!";

    if (jumlahItem == 0) {
        alert("Pesan dulu ya, kak");
    } else {
        if (!liff.isInClient()) {
            alert('Pesanan sudah diterima ya, kak! Tapi kami tidak bisa mengirimkan message karena fitur tidak tersedia.');
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': message
            }]).then(function(){
                alert('Pesanan diterima');
            }).catch(function(error){
                alert(error);
            });
        }

        // Reset all
        $("input[type=text]").val('0');
        jumlahItem = 0;
        totalOrder = [];
        totalHarga = 0;
        text = "";
        document.getElementById("total-order").innerHTML = "";
        document.getElementById("btnOrder").innerHTML = "Yuk pesan dulu~";
    }
}

// Digunakan untuk membuang - pada nama item
String.prototype.cleanString = function() {
    return this.replace("-", " ");
}