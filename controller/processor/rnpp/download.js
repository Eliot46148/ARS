var app = angular.module('ProcessorDownload', []);
app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    // Redirect if not login

    $scope.downloaddata  = function(){
        $http.post(window.location+"/loadCsv",{
            data:{name : "test"}        //change to json data
        },function(req,res){
            alert(res.data)
        })

    }

    if (!$.cookie('account')){window.location='/processor';}

    var set_state = function(load, state=0){
        $scope.loading = load;
        $scope.loading_state = state;
    };
    
    set_state(true, 1);
    $http.get('/form/id').success(function(data){
        $scope.forms = [];
        for (var i=0; i<data.data.length; i++){
            var id = data.data[i];
            $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                var form = JSON.parse(JSON.stringify(data.data));

                if (form.ChartData.length < 8){
                    var length = form.ChartData.length;
                    for (var j=0; j<8-length;j++)
                        form.ChartData.push(null);
                }

                $scope.forms.push(form);
            });
        }
        //console.log($scope.forms);
        
        $timeout(function() {
            set_state(false);
        }, 1500);
    });
});

if (!$.cookie('account')){window.location='/processor';}
angular.module('Processor', []).controller('MainCtrl', function($scope, $http) {
});