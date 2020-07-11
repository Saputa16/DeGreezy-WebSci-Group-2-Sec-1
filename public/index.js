var app = angular.module('app', []);

// let $scope.num_semesters = 2;

app.controller('ctrl', function ($scope, $http) {
    // $scope.Math=window.Math;

  const param = new URLSearchParams(location.search);
  // $scope.userObj = JSON.parse(param.get("result"));
  $scope.userToken = JSON.parse(param.get("result"));

  $scope.run = function(){
    $http({
      method: 'GET',
        url: '/courses?searchString='
      }).then(function successCallback(response) {
          $scope.courses = response.data;
          console.log("Success!");
      }, function errorCallback(response) {
          console.log(response.data);
    });
    
    var all_semester_content = [[], [], [], [], [], [], [], [], [], []];

    function update_semesters() {
      for (var s = 1; s <= $scope.num_semesters; s++) {
        var string = '#sem_hide' + s;
        var simple = '#sem' + s;
        var indic_string = '#indicator_hide' + s;

        $(string).find('div').show();
        $(string).removeClass('slide-hide-on-mobile');

        $(indic_string).show();
      }

      for (var s = $scope.num_semesters; s < 10; s++) {
        var number = s + 1;
        var string = '#sem_hide' + number;
        var simple = '#sem' + number;
        var indic_string = '#indicator_hide' + number;

        $(string).find('div').hide();
        $(string).addClass('slide-hide-on-mobile');

        $(indic_string).hide();

        // prevents accessing hidden semesters when adding/subtracting
        if ( $(string).hasClass('active') ) {
          var last_active = '#sem_hide' + $scope.num_semesters;
          var last_active_indic = '#indicator_hide' + $scope.num_semesters;

          $(string).removeClass('active');
          $(indic_string).removeClass('active');

          $(last_active).addClass('active');
          $(last_active_indic).addClass('active');

        }
      }

    }

    $http({
      method: 'GET',
        url: '/users?token=' + $scope.userToken
      }).then(function successCallback(response) {
          // $scope.courses = response.data;
          // console.log("Success!");
          
          $scope.userObj = response.data;

          $scope.num_semesters = response.data.semesterCount;
          update_semesters();
          $scope.reqCheck();
          
      }, function errorCallback(response) {
          console.log(response.data);
    });

    // let $scope.num_semesters = count;
    // alert($scope.num_semesters);

    // let default_$scope.num_semesters = $scope.userObj.semesterCount;
    // alert($scope.num_semesters);
    // let $scope.num_semesters = default_$scope.num_semesters;

    for (let i = 1; i <= 10; i++) {
      var string = 'sem' + i;
      var user_string = $scope.userToken + '_' + string;
      var link = '/semesters?_id=' + user_string;
      // alert(link);

      $http({
          method: 'GET',
          url: link
        }).then(function successCallback(response) {
            var head = response.data.courses;

            for (let j in head) {
              // alert(JSON.stringify(head[j]));
              all_semester_content[i-1].push(head[j]);
            }
            $scope.sem_content = all_semester_content;

            console.log("Success!");
        }, function errorCallback(response) {
            console.log(response.data);
      });
    }



    $scope.sub = function() {
      if ($scope.num_semesters > 1) {
        $scope.num_semesters = $scope.num_semesters - 1;
      }

      update_semesters();
    }
    
    $scope.add = function() {
      if ($scope.num_semesters < 10) {
        $scope.num_semesters = $scope.num_semesters + 1;
      }

      update_semesters();
    }

    $scope.export = function() {
      $http({
        method: 'GET',
        url: 'users/exportCSV?token=' + $scope.userObj.usertoken,
      }).then(function successCallback(response) {
        console.log(response);
        var myWindow = window.open("", "CSV Data", "width=800, height = 400");
        var csv = response.data;
        myWindow.document.write(csv);
      }, function errorCallback(response) {
        console.log("Error");
        console.log(response.data);
      })
    }

    $(window).on('beforeunload', function() {
      // $('#carousel').carousel('pause');

      var update = {
        semesterCount: $scope.num_semesters
      };

      $http({
        method: 'POST',
        url: 'users/update?token=' + $scope.userObj.usertoken,
        dataType: 'JSON',
        data: update
      }).then(function successCallback(response) {
        console.log("Profile updated"); 
      }, function errorCallback(response) {
        console.log("HELP!!!");
        console.log(response.data);
      });
      
    });

  }

  // $scope.originalProfile = {
  //   usertoken: '',
  //   firstName: 'RPI',
  //   lastName: 'Student',
  //   semesterAdmitted: 'Spring 2016',
  //   expectedGraduation: 'Fall 2023',
  //   firstProgram: '',
  //   secondProgram: ''
  // };

  // $scope.profile = angular.copy($scope.originalProfile);

  $scope.submitProfileForm = function () {


    var updateProfile = {
      first_name: $scope.profile.firstName,
      last_name: $scope.profile.lastName,
      semesterAdmitted: $scope.profile.semesterAdmitted,
      expectedGraduation: $scope.profile.expectedGraduation,
      programs: [ $scope.profile.firstProgram , $scope.profile.secondProgram ]
    }

    console.log(updateProfile.programs);
    
    console.log()
    $http({
        method: 'POST',
        url: 'users/update?token=' + $scope.userObj.usertoken,
        dataType: 'JSON',
        data: updateProfile
    }).then(function successCallback(response) {
        $scope.reqCheck();
        console.log("Profile updated"); 
    }, function errorCallback(response) {
        console.log("HELP!!!");
        console.log(response.data);
    });

  };

  $scope.runPrograms = function(){
    $http({
      method: 'GET',
        url: '/programs/all'
      }).then(function successCallback(response) {
          $scope.programInfo = response.data;
          console.log("Success!");
      }, function errorCallback(response) {
          console.log(response.data);
        });
      };
    
    
    
    
    
    
      $(document).ready(function(){
        $("#carousel").carousel({
          interval : false
        });
    
    
    
    
        $('#carousel').on('slide.bs.carousel', function(slide){
          var next_slide = slide.relatedTarget;
          var next_id = next_slide.id;
          var next_id_string = '#' + next_slide.id;
    
          if($(next_id_string).hasClass("slide-hide-on-mobile")) {
            // generates an error message, but required for expected behavior
            slide.relatedTarget = getElementById('#sem_hide1');
    
            // slide.from = 0;
    
            // if (slide.direction == 'right') {
            //   // $('.carousel-control-prev').css('background-color', 'pink');
            // } else {
            //   // $('.carousel-control-next').css('background-color', 'blue');
            //   // slide.to = 10;
            //   // slide.relatedTarget = document.getElementById('#sem_hide1');
            //   $('#sem_hide1').addClass('active');
            //   slide.to = 0;
    
            //   $('#carousel').on('slid.bs.carousel', function(e){
            //     $('#sem_hide1').removeClass('active');
            //     slide.from = 0;
            //   });
    
            // }
          }
        });
      });
        
  // Carousel (mobile only view)
  $(window).on('load resize', function() {
    // $('#carousel').carousel('pause');

    if ( document.documentElement.clientWidth <= 767 ) {
      $('.sem_col').addClass('carousel-item');
      $('.sem_col').removeClass('col-md-6');
      $('.sem_col').removeClass('col-sm-6');
      $('.sem_col').removeClass('col-xs-6');


      // $('.sem').css('padding-left', '20px');
      // $('.sem').css('padding-right', '20px');
      // $('.sem').css('border', 'none');
      // $('.sem').css('border-bottom', '10px solid #F1F1F1');
      $('.sem').css('border-radius', 0);
      $('.sem').css('min-height', '37rem');

      $('.carousel-indicators').show();
      $('.carousel-control-prev').show();
      $('.carousel-control-next').show();

      $('.outside').addClass('carousel-inner');
      $('.outside').removeClass('row');

    } else {
      $('.sem_col').removeClass('carousel-item');
      $('.sem_col').addClass('col-md-6');
      $('.sem_col').addClass('col-sm-6');
      $('.sem_col').addClass('col-xs-6');

      // $('.sem').css('padding', '10px');
      // $('.sem').css('border', '5px solid #F5F5F5');
      $('.sem').css('border-radius', 10);
      $('.sem').css('min-height', '400px');

      $('.carousel-indicators').hide();
      $('.carousel-control-prev').hide();
      $('.carousel-control-next').hide();

      $('.outside').removeClass('carousel-inner');
      $('.outside').addClass('row');

    }
  });

  $(window).on('beforeprint', function() {
    $('.sem_col').removeClass('carousel-item');
    $('.sem_col').addClass('col-md-6');
    $('.sem_col').addClass('col-sm-6');
    $('.sem_col').addClass('col-xs-6');

    // $('.sem').css('padding', '10px');
    // $('.sem').css('border', '5px solid #F5F5F5');
    $('.sem').css('border-radius', 10);
    $('.sem').css('min-height', '400px');

    $('.carousel-indicators').hide();
    $('.carousel-control-prev').hide();
    $('.carousel-control-next').hide();

    $('.outside').removeClass('carousel-inner');
    $('.outside').addClass('row');
  });

  var drake = dragula([
    document.getElementById("queue"),
    document.getElementById("sem1"),
    document.getElementById("sem2"),
    document.getElementById("sem3"),
    document.getElementById("sem4"),
    document.getElementById("sem5"),
    document.getElementById("sem6"),
    document.getElementById("sem7"),
    document.getElementById("sem8"),
    document.getElementById("sem9"),
    document.getElementById("sem10")
  ],
  {
    invalid: function(el, handle){
      var sems = document.getElementsByClassName('sem');
      for(i = 0; i < sems.length; i++){
        var li = handle.getElementsByTagName("li");
        for(n = 0; n < li.length; n++){
          if(el.id == li[n].innerHTML){
            return true;
          }
        }
      }
      //if not false aka TRUE
      if(!$scope.preReq()){
        //return false
        return $scope.preReq();
      }
      //if not false AKA TRUE
      if(!$scope.coReq()){
        //return false
        return $scope.coReq();
      }
    }
  });
  
    // ON DROP
  // uses target of the drag (where it will be dropped) &
  // uses source of the drag (where the dragged element originated from)
  drake.on('drop', (el, target, source) => {
    // alert(el.id);
    $scope.drop(source.id, target.id, el.id);
    // console.log(source.id);
    el.classList.add('ex-moved');
    //getprogress  reruns
    $scope.reqCheck();
  });
  $scope.drop = function(sourceID, semesterID, courseName){
    var userToken = $scope.userObj.usertoken;
    // alert(userToken);

    var to_delete = {
      course: courseName,
      _id: userToken + '_' + sourceID,
      token: userToken
    };

    var to_insert = {
      course: courseName,
      _id: userToken + '_' + semesterID,
      token: userToken
    };

    $http({
        method: 'POST',
        url: '/semesters/pull',
        dataType: 'JSON',
        data: to_delete
      }).then(function successCallback(response) {
          console.log("DELETE successful");
      }, function errorCallback(response) {
          console.log(response.data);
    });

    $http({
        method: 'PUT',
        url: '/semesters/push',
        dataType: 'JSON',
        data: to_insert
      }).then(function successCallback(response) {
          console.log("PUT successful");
      }, function errorCallback(response) {
          console.log(response.data);
    });


    $scope.reqCheck();
  }
  $scope.reqCheck = function (){
      var urlString = "/users/getprogress?token=";
      var userToken = $scope.userObj.usertoken;
      // var userToken = 'Joe Ross';
      $http({
        method: 'GET',
        url: urlString+userToken
     }).then(function successCallback(response) {
          $scope.require = response.data.concentrations;
          console.log("Requirements data: "+ JSON.stringify(response.data.concentrations));
      }, function errorCallback(response) {
          console.log(response.data);
    });
  }
  $scope.preReq = function (){

  }
  $scope.coReq = function (){

  }

});


/* Dragula inspired by https://codepen.io/nikkipantony/pen/qoKORX */

// search
function searchFunction() {
  var input = document.getElementById("myInput");
  var filter = input.value.toUpperCase();
  var ul = document.getElementById("queue");
  var li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    var a = li[i]
    var txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

