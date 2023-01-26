// JS Init
var API_host;
if (window.location.host!=""){
    API_host = "http://"+window.location.host;
}else{
    API_host = "http://127.0.0.1:8086";
}
// 訊息彈窗
function pushinfo(title, text, type, s){
    if (s == null){s = 4;}
    document.getElementById('info').classList.add(type);
    function tran(id, bool){
        if ($(id).transition("is visible") != bool){
            $(id).transition('fade right');
        }
    }
    document.getElementById("info_title").innerText = title;
    document.getElementById("info_text").innerText = text;
    tran("#info", true);
    setTimeout(function(){
        tran("#info", false);
        document.getElementById('info').classList.remove(type);
    }, Number(s)*1000);
}
// Loading 訊息彈窗
var loading_pushinfo = function(){
    let _this = this;
    let tran = (id, bool)=>{
        if ($(id).transition("is visible") != bool){
            $(id).transition('fade left');
        }
    }
    this.createLoading = (title, text, type)=>{
        _this.type = type;
        document.getElementById('loading-info').classList.add(_this.type);
        document.getElementById("loading-info_title").innerText = title;
        document.getElementById("loading-info_text").innerText = text;
        tran("#loading-info", true);
    }
    this.closeLoading = ()=>{
        tran("#loading-info", false);
        document.getElementById('loading-info').classList.remove(_this.type);
    }
}
// Copy 到剪貼板
function copy(text){
    let input = document.getElementById('copy');
    input.value = text;
    input.select();
    document.execCommand("copy");
    pushinfo("Copy!", "URL已Copy到剪貼板", "success");
}
// 設定
function openSet(info){
    switch(info){
        case "startXD":
            $.ajax({
                url: API_host+"/api/getIp",
                type: "POST",
                timeout: 5000,
                success: function(re){
                    $('#modal .header').text('啟用網頁伺服器');
                    let iphtml = "";
                    for (let i=0;i<re.length;i++){
                        iphtml += "<li><a class='pointer' onclick='copy(`http://"+re[i]+":8086/`)'>http://"+re[i]+":8086/</a></li>";
                    }
                    $('#modal .content').html(`<p>請嘗試使用行動裝置/PC瀏覽器訪問下面的幾個URL</p><ul>`+iphtml+`</ul>`);
                    $('#modal').modal('show');
                },
                error: function(){
                    pushinfo("發生錯誤", "請重新啟動嘗試解決問題", "error");
                }
            })
            break;
        case "addNhentai":
            $('#modal .header').text('從 Nhentai 新增');
            $('#modal .content').html(`<div class="ui form">
                <div class="field">
                    <label>請鍵入Nhentai鏈接 (例: <i>https://nhentai.net/g/368325/</i>)</label>
                    <input type="text" id="nhentai-input" placeholder="Nhentai URL">
                </div>
                <button class="ui button" onclick="addBook('nhentai')">添加到隊列</button>
            </div>`);
            $('#modal').modal('show');
            break;
    }
}
// AddBook
function addBook(type){
    switch(type){
        case "nhentai":
            let url = document.getElementById('nhentai-input').value;
            if (url != ""){
                let loading = new loading_pushinfo();
                loading.createLoading("處理隊列", "Please wait, 時間過長請重啟應用程式", "warning");
                $.ajax({
                    url: API_host+"/api/addNhentai",
                    type: "POST",
                    data: {"url": url},
                    success: function(re){
                        if (re['status'] == "ok"){
                            document.getElementById('nhentai-input').value="";
                            pushinfo("Add OK", "隊列已完成", "success");
                            setTimeout(()=>{
                                reload();
                            }, 2000);
                        }else{
                            pushinfo("發生錯誤", "未知錯誤，請重啟應用程式", "error");
                        }
                        loading.closeLoading();
                    }
                })
            }else{
                pushinfo("Warning", "請鍵入URL", "warning");
            }
            break;
    }
}
// page loading
function pageLoading(bool){
    if (!bool){
        let pageLoading = $('#pageLoading');
        pageLoading.animate({"opacity":0}, 250);
        setTimeout(()=>{
            pageLoading.css("display", "none");
        }, 250);
    }else{
        let pageLoading = $('#pageLoading');
        pageLoading.css("display", "");
        pageLoading.animate({"opacity":1}, 250);   
    }
}
// Reload
function reload(){
    pageLoading(true);
    document.getElementById('booklist').innerHTML="";
    init();
    pageLoading(false);
}
// init
function init(){
    let page = localStorage.getItem("pagenum");
    if (page == ""){page="1"};
    $.ajax({
        url: API_host+"/api/booklist",
        type: "POST",
        timeout: 5000,
        data: {"page":page},
        success: function(re){
            let booklist = document.getElementById('booklist');
            for (let i=0;i<re['booklist'].length;i++){
                let authorList = JSON.parse(re['booklist'][i]['author']);
                let tagList = JSON.parse(re['booklist'][i]['tag']);
                let tagListHtml="";
                for (let i in tagList){
                    tagListHtml += `<div class="ui tiny label booktag">${tagList[i]}</div>`;
                }

                booklist.innerHTML += `<div class="ui card c-card" onclick="javascript:window.location='book.html?bid=${re['booklist'][i]['bid']}'">
                    <div class="image">
                        <img data-original="${re['booklist'][i]['image']}">
                    </div>
                    <div class="content">
                        <div class="header book-title">${re['booklist'][i]['bookname']}</div>
                        <div class="description">${authorList.join(', ')}</div>
                        <div style="padding-top: 8px;">${tagListHtml}</div>
                    </div>
                </div>`;

                $("img").lazyload({effect: "fadeIn"});
            }
            // Close Page Loading
            pageLoading(false);
        },
        error: function(){
            pushinfo("發生錯誤", "BookList 載入錯誤", "error");
        }
    })
}
// Read Info
function bookinfo_init(){
    let bid = getQueryVariable('bid');
    $.ajax({
        url: API_host+"/api/getBookInfo",
        type: "POST",
        data: {"bid": bid},
        success: function(re){
            document.getElementById("cover").setAttribute('data-original', re['image']);
            document.getElementById("bookname").innerText=re['bookname'];
            document.getElementById("author").innerText=JSON.parse(re['author']).join(", ");
            let tagList = JSON.parse(re['tag']);
            let tagHtml = document.getElementById("tags");
            for (let i in tagList){tagHtml.innerHTML += `<div class="ui label booktag">${tagList[i]}</div>`;}
            document.getElementById('addtime').innerHTML+=`<div class="ui label booktag">${formartTime(re['time'])}</div>`;
            document.getElementById('pagenum').innerHTML = re['num'];

            $("img").lazyload({effect: "fadeIn"});
            pageLoading(false);
        }
    })
}
// 得到get參數
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
// Format Time
function formartTime(time=+new Date()) {
    let date = new Date(new Date(parseInt(time) + 8 * 3600 * 1000));
    return date.getFullYear()+'-'+add0(date.getMonth()+1)+'-'+add0(date.getDate());
}
function add0(m){return m<10?'0'+m:m}