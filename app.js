angular.module( 'sample', [
  'ui.router',
  'restangular',
  'PostFeedServicesModule',
  'SaveFormServices',
  'angularFileUpload'
])
.controller('mainController', function mainController($scope, PostFeedService) {
	$scope.IsErrorInProceesing = false;
	$scope.IsStatusSubmitted = false;
	$scope.StatusData={};
	$scope.StatusDataSubmitted={};
    $scope.submitStatus = function(StatusData){
	if(StatusData.comments){
		// StatusData.timestamp = new Date().getTime()
		PostFeedService.saveStatus($scope.StatusData).then(function(respone){
		if(respone.data.errors){
			$scope.IsErrorInProceesing=true;
		}else{
			$scope.StatusDataSubmitted=$scope.StatusData;
			$scope.StatusData={};
			$scope.IsErrorInProceesing=false;
			$scope.IsStatusSubmitted = true;
		} }, function(error){
		$scope.IsErrorInProceesing=true;
		});
	}else{
	alert("Invalid StatusData");
	}
	};
   

}).controller('formController', ['$scope', 'FileUploader', function($scope, FileUploader, FormService) {
	$scope.user = {};
    // function to submit the form after all validation has occurred			
    $scope.submitForm = function () {

        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            console.log($scope.user);
            console.log('Submiting!!!!!!!!!!!');
            console.log("$pristine = " + $scope.userForm.$pristine);
            $scope.userForm.$setPristine();
            console.log("$pristine = " + $scope.userForm.$pristine);
            FormService.save($scope.user);
            //FormService.get();

            $scope.user.candidatename = null;
            $scope.user.projectname = null;
            $scope.user.practiceArea = null;
            $scope.user.requester = null;
            $scope.user.interviewername = null;
            $scope.user.signature = null;
            $scope.user.date = null;
            $scope.user.skillsReff1 = [];
            $scope.user.skillsReff2 = [];
            $scope.user.comments = null;


        }

    };
			$scope.IsFileUploaded = false;
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://localhost:8085/api/uploadImage'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
		$scope.selectFile = function(){
		uploader.queue = [];
		if(uploader){
		$scope.IsFileUploaded = true;
		}else{
		$scope.IsFileUploaded = false;
		}
		}

        console.info('uploader', uploader);
}]).controller('MSController', function ($scope) {
    $scope.user.skillsReff1 = [];

    var defaultForm = {
        skillname: "",
        jrssRating: "",
        interviewerRating: ""
    };
    $scope.addSkills = function (reff) {
        //	    var skill = {
        //	      skillname: $scope.name,
        //	      jrssRating: $scope.jrssrating,
        //	      interviewerRating: $scope.interviewrating


        //	    };
        $scope.user.skillsReff1.push(reff);
        console.log(reff);
        $scope.reff1 = angular.copy(defaultForm);
    }

}).controller('OPController', function ($scope) {
    $scope.user.skillsReff2 = [];

    var defaultForm = {
        skillname: "",
        jrssRating: "",
        interviewerRating: ""
    };
    $scope.addSkills = function (reff) {
        //	    var skill = {
        //	      skillname: $scope.name,
        //	      jrssRating: $scope.jrssrating,
        //	      interviewerRating: $scope.interviewrating


        //	    };
        $scope.user.skillsReff2.push(reff);
        console.log(reff);
        $scope.reff2 = angular.copy(defaultForm);
    }
    })
	.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
	


