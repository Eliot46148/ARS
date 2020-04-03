function creatTable(){
    //這個函式的引數可以是從後臺傳過來的也可以是從其他任何地方傳過來的
    //這裡我假設這個data是一個長度為5的字串陣列 我要把他放在表格的一行裡面，分成五列
    var tablegrup="<tr><td><h4>送出日期</h4></td><td><h4>審查期限</h4></td><td><h4>類型</h4></td><td><h4>主題</h4></td><td><h4>審查狀態</h4></td></tr>";
    var tableData="";

    $.post('/committee/dashboard',{
        email : "123",
        code : "123"},
        function(data){
            var count = 0;
            var testform = data.data.needtestform;
            for (var i in testform)
            {
                tableData ="";
                tableData+="<tr>";
                tableData+="<td><h3>"+(testform[i].submitDate).substring(0,10)+"<h3></td>";
                tableData+="<td><h3>"+(testform[i].deadLine).substring(0,10)+"<h3></td>";
                tableData+="<td><h3>"+testform[i].paperType+"<h3></td>";
                tableData+="<td><h3>"+testform[i].paperTheme+"<h3></td>";
                if(testform[i].isPass)
                    tableData+="<td><h4>finish<h4></td>";
                else
                    tableData+="<td><a class = 'btn btn-info' href = './review'>click</a></td>";
                tableData+="</tr>";
                tablegrup+=tableData;

            }
            $("#tbody1").html(tablegrup);
   });
   
    //現在tableData已經生成好了，把他賦值給上面的tbody
}