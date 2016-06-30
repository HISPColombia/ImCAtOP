/*
 *	Architeture 
 * 	Helder Yesid Castrillón
 * 	Hisp Colombia 2014
 * 
 * Core Module for using WebApi of dhis2
 * It is the persistence in the FrontEnd
 * 
 * */
var Dhis2Api = angular.module("Dhis2Api", ['ngResource']);

var urlApi = "../../../api";
//Create all common variables of the apps 
Dhis2Api.factory("commonvariable", function () {
	var Vari={
	    url: urlApi
			};

   return Vari; 
});


Dhis2Api.constant("urlApi", urlApi);



////Api Category option
Dhis2Api.factory("categoryOptions", ['$resource', 'commonvariable', function ($resource, commonvariable) {
    return $resource(commonvariable.url + "/categoryOptions/:uid",
		{uid:'@uid'},
		{
		    POST: { method: "POST" },
		    DELETE: { method: "DELETE" },
		    PUT: { method: "PUT" },
		    PATCH: { method: "PATCH" }
		});
}]);

////Api Category option
Dhis2Api.factory("metadataImport", ['$resource', 'commonvariable', function ($resource, commonvariable) {
    return $resource(commonvariable.url + "/metadata",
		{},
		{
		    POST: { method: "POST" }
		});
}]);



