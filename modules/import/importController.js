appImport.controller('importController', ['$scope', '$filter', '$q', '$modal', 'commonvariable', 'categoryOptions', function ($scope, $filter, $q,$modal, commonvariable, categoryOptions) {

    //variables
    var $translate = $filter('translate');
    $scope.loading = false;
    $scope.alerts = [{ type: "warning", msg: $translate("MSG_INTRO") }];
    $scope.readyForImport = true;
    $scope.ImportResult = [];
    $scope.ImportResultColor = [];
    $scope.numposition = 0;
    $scope.webStrategy = "CREATE";
    $scope.dataforImport = { "categoryOptions": [] };
    $scope.objIgnored = 0;
    $scope.objUpdated = 0;
    $scope.objDeleted = 0;
    $scope.objImported = 0;
    

    var dhisResources = {
        "categotyOptions": categoryOptions
    };


    ///methods

    // crelar variable
    $scope.ClearForm = function () {
        $scope.Importfinished = false;
        $scope.kon = 0;
        $scope.readyForImport = false;
        $scope.objIgnored = 0;
        $scope.objUpdated = 0;
        $scope.objDeleted = 0;
        $scope.objImported = 0;
        $scope.numposition = 0;
        $scope.readyForImport = true;
        $scope.ImportResult = [];
        $scope.ImportResultColor = [];
        $scope.numposition = 0;
        $scope.webStrategy = "CREATE";
        $scope.loading = false;
        $scope.numRegister = 0;
        $scope.alerts = [{ type: "warning", msg: $translate("MSG_INTRO") }];
        $scope.dataforImport = { "categoryOptions": [] };
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function (type, message) {
        $scope.alerts.push({ type: type, msg: message});
    };

    $scope.handler = function (e, files) {
        try{
            var reader = new FileReader();
            reader.onload = function (e) {
                var string = reader.result;
                $scope.conten = string;
                $scope.loading = false;
                //
                $scope.Importfinished = false;
                $scope.kon = 0;
                $scope.readyForImport = false;
                $scope.objIgnored = 0;
                $scope.objUpdated = 0;
                $scope.objDeleted = 0;
                $scope.objImported = 0;
                $scope.ImportResult = [];
          
            }
            reader.readAsText(files[0]);
        }
        catch (err) {
            $scope.loading = false;
            $scope.Importfinished = false;
            $scope.kon = 0;
            $scope.readyForImport = false;
            $scope.objIgnored = 0;
            $scope.objUpdated = 0;
            $scope.objDeleted = 0;
            $scope.objImported = 0;
            $scope.ImportResult = [];
        }
    }
    $scope.validationDate = function (value) {
        var defered = $q.defer();
        var promise = defered.promise;
        var dateformat = value.split("-");
        var ndate = new Date(value);
        try {
            if (dateformat[0].trim().length == 4 && dateformat[1].trim().length == 2 && dateformat[2].trim().length == 2 && ndate != "Invalid Date")
                defered.resolve(true);
            else
                defered.resolve(false);
        }
        catch (err) {
            defered.resolve(false);
        };

        return promise;
    };


    $scope.validation = function (data, position) {
       
        var Error = false;
        var defered = $q.defer();
        var promise = defered.promise;
            //length of array validation
        if (data.length != 5) {
            $scope.addAlert("danger", $translate("MSG_ERRORLENGTH")+ position);
            Error = true;
        }
        //Strings Validation
        if (data[0] == "" || data[0].trim().length == 0) {
            $scope.addAlert("danger", $translate("MSG_ERRORTEXTNAME") + position + " (" + data[0].trim() + ") ");
            Error = true;
        }
        //Strings Validation
        if (data[2] == "" || data[2].trim().length == 0) {
            $scope.addAlert("danger", $translate("MSG_ERRORTEXTCODE") + position + " (" + data[2].trim() + ") ");
            Error = true;
        }

        //uids validation
        if ((data[1].trim().length != 11 || isNaN(data[1].substr(0, 1)) == false) && data[1] != "") {
            $scope.addAlert("danger", $translate("MSG_ERRORTEXTUID") + position + " (" + data[1].trim() + ") ");
            Error = true;
        }
        //uids validation
        if (data[1] == "" || data[1].trim().length == 0) {
            $scope.addAlert("warning", $translate("MSG_WARNINGTEXTUID") + position);
            Error = false;
        }
        
        // Dates validation
          $scope.validationDate(data[3]).then(function (response1) {
              if (response1 == false) {
                  $scope.addAlert("danger", $translate("MSG_ERRORDATEFORMAT1") + position + " (" + data[3].trim() + ") ");
                  Error = true;
              }
          });

          $scope.validationDate(data[4]).then(function (response2) {
             
              if (response2 == false) {
                  $scope.addAlert("danger", $translate("MSG_ERRORDATEFORMAT2") + position + " (" + data[4].trim() + ") ");
                  Error = true;
              }

              defered.resolve(Error);

          });


        return promise;
    };


    $scope.readFile = function () {
        $scope.ClearForm()
        $scope.alerts = [];
        $scope.readyForImport = "init";
        try {
            var arrayImport = $scope.conten.split("\n");
            angular.forEach(arrayImport, function (value, key) {
                if (key > 0) {
                    var datainArray = value.split(",");
                    $scope.validation(datainArray, key).then(function (response) {
                        if (response == true) {
                            $scope.readyForImport = true;
                        }
                        else {
                            if (datainArray[1].trim().length == 11) {
                                $scope.dataforImport.categoryOptions.push(
                                    {
                                        "id": datainArray[1],
                                        "name": datainArray[0],
                                        "shortName": datainArray[0],
                                        "code": datainArray[2],
                                        "startDate": datainArray[3],
                                        "endDate": datainArray[4],
                                        "organisationUnits": []
                                    }
                                  );
                            }
                            else {
                                $scope.dataforImport.categoryOptions.push(
                                    {
                                        "name": datainArray[0],
                                        "shortName": datainArray[0],
                                        "code": datainArray[2],
                                        "startDate": datainArray[3],
                                        "endDate": datainArray[4],
                                        "organisationUnits": []
                                    }
                                  );
                            }

                        }
                        
                        if (key == arrayImport.length - 1) {
                            if ($scope.readyForImport == "init") {
                                $scope.addAlert("info", $translate("MSG_READYFORIMPORT"));
                                $scope.readyForImport = false;
                                $scope.typeinformation = "CategoryOptions"
                                $scope.numRegister = $scope.dataforImport.categoryOptions.length;
                            }
                        }
                    });
                    
                }
            });
            
           

        } catch (err) {
            $scope.addAlert("danger", $translate("MSG_ERRORFORIMPORT") + err);
            //$scope.readyForImport = true;
        };
        
    }
    $scope.startImport = function (position) {
        $scope.loading = true;
        //disable button
        $scope.readyForImport = true;
        //progress Bar
        $scope.kon = Math.round(position * 100 / ($scope.dataforImport.categoryOptions.length - 1));

        //Using API
        var param = { strategy: $scope.webStrategy };
        categoryOptions.POST(param, $scope.dataforImport.categoryOptions[position]).$promise.then(function (resp) {

            //// Count
            $scope.objIgnored = $scope.objIgnored + resp.response.importCount.ignored * 1;
            $scope.objUpdated = $scope.objUpdated + resp.response.importCount.updated * 1;
            $scope.objDeleted = $scope.objDeleted + resp.response.importCount.deleted * 1;
            $scope.objImported = $scope.objImported + resp.response.importCount.imported * 1;
            $scope.objResponses = {
                Ignored: $scope.objIgnored,
                Updated: $scope.objUpdated,
                Deleted: $scope.objDeleted,
                Imported: $scope.objImported
            };
            //change Color 
            if (resp.response.importCount.ignored == 1)
                $scope.ImportResultColor[position] = "danger";
            if (resp.response.importCount.updated == 1)
                $scope.ImportResultColor[position] = "info";
            if (resp.response.importCount.deleted == 1)
                $scope.ImportResultColor[position] = "warning";
            if (resp.response.importCount.imported == 1)
                $scope.ImportResultColor[position] = "success";
            //////
            $scope.ImportResult.push(resp.response)
            if (position < $scope.dataforImport.categoryOptions.length - 1){
                $scope.loading = false;
                $scope.startImport(position + 1);
            }
                
            else {
                $scope.readyForImport = false;
                $scope.loading = false;
                $scope.openmodal($scope.objResponses);
                $scope.addAlert("success", $translate("MSG_FINISHED"));
            }
        });
   
    }

    ///modal

    $scope.animationsEnabled = true;

    $scope.openmodal = function (obj) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'ModalFinished.html',
            controller: 'ModalFinished',
            backdrop: false,
             resolve: {
                obj: function () {
                    return obj;
                }

            }
        });

        modalInstance.result.then(function () {
            console.log("closed");
        }, function () {

        });
    };

   


}]);

appImport.controller('ModalFinished', function ($scope, $modalInstance, obj) {
    $scope.obj = obj;
    $scope.ok = function () {
        $modalInstance.close();
    };
});