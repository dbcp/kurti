var app = angular.module('angularPicSearch', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider

            // route for the home page
            .when('/home/:id', {
                templateUrl: 'pages/main.html',
                controller: 'myCtrl'
            })

            // route for the about page
            .when('/', {
                templateUrl: 'pages/modern.html',
                controller: 'dCtrl'
            })
            
            .when('/contact', {
                templateUrl: 'pages/contact.html',
            })
//
//            // route for the contact page
//            .when('/contact', {
//                templateUrl: 'pages/contact.html',
//                controller: 'contactController'
//            });
});

app.service('myService', function ($http) {
    this.myServiceJsonData = '';
    this.myServiceSearchData = '';
    this.myCategoryJsonData = '';
    this.getData = function () {
        return  $http.get('imageXml.xml');
    }
});
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

app.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
});
app.controller('myCtrl', ['$scope', '$location','$routeParams', 'myService', function ($scope, $location,$routeParams, myService) {

        $scope.cuurentIndex = '';
        $scope.calculateNextImageID = '';
        $scope.noOfPages = '';
        $scope.beginIndex = '';
        $scope.searchItemModel = '';
        $scope.nav=$routeParams.id;
        // $scope.currentImageUrl = '';
        myService.getData().then(function (d)
        {
            $scope.jsonData = $.parseXML(d.data);
            myService.myServiceJsonData = $scope.jsonData;
            $scope.showCategory($routeParams.id);
        });
        $scope.stockClick = function (obj)
        {
            $location.path('/stockDetails/' + obj);
        }

        $scope.showCategory = function (x)
        {
//            for (var i = 0; i < 188; i++)
//            {
//                if (i < 10)
//                    var no = '00' + i;
//                else if (i >= 10 && i < 100)
//                    var no = '0' + i;
//                else if (i >= 100)
//                    var no = i;
//                console.log('<image serachTag="MS//17//' + no + '">kurti' + i + '.jpeg</image>')
//            }
            $scope.searchItemModel = '';
            $scope.beginIndex = 0;
            $($scope.jsonData).find('images').each(function ()
            {
                if (x === $(this).attr('data-filter'))
                {
                    var makeJson = '';
                    var folderLoc = $(this).attr('folder');
                    $(this).find('model').each(function ()
                    {
                        var serachTag = $(this).attr('serachTag');
                        makeJson += '{"serachTag":' + '"' + serachTag + '"' + ',';
                        makeJson += '"path":[';
                        var imageCount = [];
                        $(this).find('image').each(function ()
                        {
                            imageCount.push('"' + folderLoc + '/' + $(this).text() + '"');
                        });
                        makeJson += imageCount + ']},'
                    });
                    // console.log(makeJson);

                    makeJson = makeJson.substring(0, makeJson.length - 1);
                    var jsonObj = '[' + makeJson + ']';
                    $scope.filteredSearchData = jsonObj;
                    $scope.filteredSearchData = JSON.parse($scope.filteredSearchData);
                    myService.myCategoryJsonData = $scope.filteredSearchData;
                    //console.log($scope.filteredSearchData.length);
                    $scope.noOfPages = Math.ceil(parseInt($scope.filteredSearchData.length) / parseInt(10));
                    // $scope.noOfPages=15;
                    var calculateWidth = 0;
//                    if (parseInt($scope.noOfPages) > parseInt('9'))
//                    {
//                        calculateWidth = (parseInt('9')) * parseInt('34');
//                        calculateWidth += (parseInt($scope.noOfPages) - parseInt('9')) * parseInt('42');
//                        calculateWidth += 1;
//                    } else
//                    {
                    calculateWidth = parseInt($scope.noOfPages) * parseInt('36');
                    //$('.paginationParent').css('width', calculateWidth);

                    // }
//$('.paginationSubParent').css('width', parseInt($scope.noOfPages) * parseInt(40));
                    $('.paginationSubParent').css('width', calculateWidth);
                }
            });
        }

        $scope.showCategorySearch = function ()
        {
            var makeJson = '';
            $($scope.jsonData).find('images').each(function ()
            {
                var folderLoc = $(this).attr('folder');
                $(this).find('model').each(function ()
                {
                    var serachTag = $(this).attr('serachTag');
                    makeJson += '{"serachTag":' + '"' + serachTag + '"' + ',';
                    makeJson += '"path":[';
                    var imageCount = [];
                    $(this).find('image').each(function ()
                    {
                        imageCount.push('"' + folderLoc + '/' + $(this).text() + '"');
                    });
                    makeJson += imageCount + ']},'
                });
            });
            makeJson = makeJson.substring(0, makeJson.length - 1);
            var jsonObj = '[' + makeJson + ']';
            $scope.filteredSearchData = jsonObj;
            $scope.filteredSearchData = JSON.parse($scope.filteredSearchData);
            // console.log($scope.filteredSearchData.length);
            var noOfStringContain = 0;
            for (var i = 0; i < $scope.filteredSearchData.length; i++) {
                var obj = $scope.filteredSearchData[i];
                if (obj.serachTag.toLowerCase().indexOf($scope.searchItemModel.toLowerCase()) > -1) {
// console.log(obj.serachTag.toLowerCase());
                    noOfStringContain++;
                }
            }
            $scope.noOfPages = Math.ceil(parseInt(noOfStringContain) / parseInt(10));
            // console.log(noOfStringContain + ":::" + $scope.noOfPages);
            var calculateWidth = 0;
//            if (parseInt($scope.noOfPages) > parseInt('9'))
//            {
//                calculateWidth = (parseInt('9')) * parseInt('34');
//                calculateWidth += (parseInt($scope.noOfPages) - parseInt('9')) * parseInt('42');
//                calculateWidth += 1;
//            } else
//            {
            calculateWidth = parseInt($scope.noOfPages) * parseInt('36');

            // }
//$('.paginationSubParent').css('width', parseInt($scope.noOfPages) * parseInt(40));

            $('.paginationSubParent').css('width', calculateWidth);
            $('.paginationSubParent').animate({'margin-left': '0px'});
            $scope.updateIndex(1);
        }

        $scope.zoom = function (x, $index, e)
        {
// $('.SecondParentDiv').css('height', $(document).height());
            $scope.cuurentIndex = $index;
//            if ($scope.currentImageUrl === '')
//            {
//                $scope.currentImageUrl = x.path[0];
//            }
            $scope.imageArray = x.path;
            //alert($(e.target).attr('ng-src'));
            $('.zoomImage').attr('src', $(e.target).attr('ng-src'));
            $scope.getValue();
        }
        $scope.zoomReplicate = function (x)
        {
            $('.zoomImage').attr('src', x);
            //$scope.getValue();
        }
        $scope.getValue = function ()
        {
            //alert($(document).height());
            var setHeight = '';
            if ($(document).height() < 600)
            {
                setHeight = 600;
            } else
                setHeight = $(document).height();
            //$('.zommImageParent').css('height', '500px');
            $('.SecondParentDiv').css('height', setHeight);
            //$('.SecondParentDiv').css('width', $(document).width());
            $('.SecondParentDiv').show();
            $('.searchItem').hide();
            $('html, body').animate({scrollTop: 0});
        }

        $scope.nextImage = function ()
        {
            if (parseInt($scope.cuurentIndex) !== 9)
                $scope.calculateNextImageID = parseInt($scope.cuurentIndex) + parseInt('1');
            else
                $scope.calculateNextImageID = $scope.cuurentIndex;
            //alert($scope.calculateNextImageID);
            $('.main .currentImage').each(function ()
            {
                if (parseInt($(this).index()) === $scope.calculateNextImageID)
                {
                    $scope.cuurentIndex = $scope.calculateNextImageID;
                    var str = $(this).find('#path img').attr('ng-src');
                    var hiddenContent = $(this).find('.content').html();
                    hiddenContent = JSON.parse(hiddenContent);
                    $scope.imageArray = hiddenContent;
                    //alert(hiddenContent);
//                    str = str.replace("/Thumb", "");
                    $('.zoomImage').attr('src', str);
                    $scope.getValue();
                }
            });
        }
        $scope.prevImage = function ()
        {
            if (parseInt($scope.cuurentIndex) !== 0)
                $scope.calculateNextImageID = parseInt($scope.cuurentIndex) - parseInt('1');
            else
                $scope.calculateNextImageID = $scope.cuurentIndex;
            //alert($scope.calculateNextImageID);
            $('.main .currentImage').each(function ()
            {
                if (parseInt($(this).index()) === $scope.calculateNextImageID)
                {
                    $scope.cuurentIndex = $scope.calculateNextImageID;
                    var str = $(this).find('#path img').attr('ng-src');
//                    str = str.replace("/Thumb", "");
                    var hiddenContent = $(this).find('.content').html();
                    hiddenContent = JSON.parse(hiddenContent);
                    $scope.imageArray = hiddenContent;
                    $('.zoomImage').attr('src', str);
                    $scope.getValue();
                }
            });
        }
        $scope.closeImage = function ()
        {
            $('.SecondParentDiv').hide();
            //$scope.currentImageUrl = '';
            $('.searchItem').show();
        }
        $scope.updateIndex = function (x)
        {
            $('.pagination1 li').removeClass('active');
            $(".pagination1 li").each(function (i)
            {
                if (parseInt(i) + parseInt('1') === x)
                    $(this).addClass('active');
            });
            $scope.beginIndex = parseInt(x) * parseInt(10) - parseInt(10);
        }
        $scope.print = function ()
        {
            var divContents = $(".zommImageParent").html();
            divContents = divContents.substr(0, divContents.length - 1) + 'style="height:100%;width:100%">';
            var printWindow = window.open('', '', 'height=500,width=800');
            printWindow.document.write('<html><head><title>Print</title>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<div style="height:500px;width:300px">');
            printWindow.document.write(divContents);
            printWindow.document.write('</div>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
        $scope.moveLeft = function ()
        {
            var left = $('.paginationSubParent').css('margin-left');
            left = left.substring(0, left.length - 2);
            var x1 = $('.paginationSubParent').css('margin-left').substring(0, $('.paginationSubParent').css('margin-left').length - 2) * parseInt('-1');
            var x2 = parseInt($('.paginationSubParent').css('width').substring(0, $('.paginationSubParent').css('width').length - 2)) - parseInt('216');
            var moveLeft = parseInt(left) - parseInt(36 * 3);
            //console.log(x1 + '::::' + x2);

            if (parseInt(x1) < parseInt(x2)) {
                //console.log((parseInt(x1) + (parseInt(38 * 3))));
                if ((parseInt(x1) + (parseInt(36 * 3))) < parseInt(x2))
                {
                    $('.paginationSubParent').animate({'margin-left': moveLeft});
                } else
                {
                    var lessLeftMove = parseInt(x2) - parseInt(x1);
                    var moveLeft = parseInt(left) - parseInt(lessLeftMove);
                    //console.log('hi' + lessLeftMove);
                    $('.paginationSubParent').animate({'margin-left': moveLeft});
                }
            }
        }
        $scope.moveRight = function ()
        {
            var right = $('.paginationSubParent').css('margin-left');
            right = right.substring(0, right.length - 2);
            var x1 = parseInt($('.paginationSubParent').css('margin-left').substring(0, $('.paginationSubParent').css('margin-left').length - 2));
            var moveRight = parseInt(right) + parseInt(36 * 3);
            //console.log(x1);
            if (x1 < 0)
            {
                if ((parseInt(x1) + (parseInt(36 * 3))) <= 0)
                {
                    $('.paginationSubParent').animate({'margin-left': moveRight});
                } else
                {
                    //var lessRightsMove = 0 - parseInt(x1);
                    var moveRight = parseInt(right) - parseInt(x1);
                    //console.log('hi' + lessLeftMove);
                    $('.paginationSubParent').animate({'margin-left': moveRight});
                }
                //$('.paginationSubParent').animate({'margin-left': moveRight});
            }
        }
        $scope.thumbNailClick = function (p, i, e)
        {
            $(e.target).parent().parent().parent().find('img').each(function ()
            {
                if ($(this).hasClass('smallImage'))
                {
                    //$scope.currentImageUrl = p;
                    $(this).attr('ng-src', p);
                    $(this).attr('src', p);
                }
            });
        }

    }]);


app.controller('dCtrl', ['$scope', '$location', function ($scope, $location) {



    }]);
