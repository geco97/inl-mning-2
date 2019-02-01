
$(function() {
    var user=getCookie("username");
    if (user != "") {
        $("#welcomwe").text("Hi, " + user );
    } 
    $("#Logoutt").click(function (event){
        removeCookie ();
    });
    $("#loginForm").click(function(event){
        event.preventDefault();

        let request = new XMLHttpRequest();
        request.onload = function () {
            if(this.readyState == 4 && this.status == 200) {
                var object = JSON.parse(this.response);
                if($("#inputEmail").val() === object.email  && $("#inputPassword").val() === object.password){
                   let username = object.firstname + " " +object.lastname;
                  
                   checkCookie(username);
                   window.location.href = "index.html";
                }
                else {
                    alert("felaktig epostadress eller lösenord!");
                }
            }
        }
        request.open("GET", "https://fe18.azurewebsites.net/api/user", true);
        request.send();
    });
    let request = new XMLHttpRequest();
    //salesreportoverview
    request.onload = function () {
        if(this.readyState == 4 && this.status == 200) {
            var object = JSON.parse(this.response);
            $("#salesreportoverview0").text(object.downloads.toLocaleString('sv-SV'));
            $("#salesreportoverview1").text(object.försäljning.toLocaleString('sv-SV'));
            $("#salesreportoverview2").text(object.users.toLocaleString('sv-SV'));
            $("#salesreportoverview3").text(object.growth.toLocaleString('sv-SV'));

        }
    };
        request.open("GET", "https://fe18.azurewebsites.net/api/salesreportoverview", true);
        request.send();
    //openinvoices
    let request1 = new XMLHttpRequest();
    request1.onload = function () {
        if(this.readyState == 4 && this.status == 200) {
            var object = JSON.parse(this.response);
            var arr1 = object.invoices;
            for(var i=0; i< arr1.length; i++) {
                 let row0="<tr><td>"+ arr1[i].invoicenumber +"</td><td>"+ arr1[i].customer +"</td><td>"+ arr1[i].shipping +"</td><td>"+ arr1[i].totalprice +"</td><td>"+ arr1[i].customerprice.toLocaleString('sv-SV') +"</td>";
                switch(arr1[i].status){
                    case "Öppen":
                        row0 +="<td><div class='badge badge-warning badge-fw'>Open</div></td>";
                    break;
                    case "Pågående":
                        row0 +="<td><div class='badge badge-success badge-fw'>Progress</div></td>";
                    break;
                    case "Tillfälligt stoppad":
                        row0 +="<td><div class='badge badge-warning badge-fw'>On hold</div></td>";
                    break;
                }
               
                row0 +="</tr>";
                $("#openInvoices").append(row0);
            } 
        
        }
    };
    request1.open("GET", "https://fe18.azurewebsites.net/api/openinvoices", true);
    request1.send();
    //updates
    let request2 = new XMLHttpRequest();
    request2.onload = function () {
        if(this.readyState == 4 && this.status == 200) {
            var object = JSON.parse(this.response);
            var arr1 = object.updates;
            arr1.reverse();
            for(var i=0; i< arr1.length; i++) {
              let row0="<li><h6>"+ arr1[i].title +"</h6><p class='mt-2'>"+ arr1[i].description +"</p><p class='text-muted mb-4'><i class='mdi mdi-clock-outline'></i>";

                let updateTimeIms = Date.parse(arr1[i].time);
                let updateTime = new Date(updateTimeIms);
                let current_date = new Date();
                row0 +=Math.round(diffMonth(updateTime,current_date))+"  months ago.</p>";               
                row0 +="</li>";
                $("#UpdateBox").append(row0);
            } 
        
        }
    };
    request2.open("GET", "https://fe18.azurewebsites.net/api/updates", true);
    request2.send();
    //
    //tickets
    let request3 = new XMLHttpRequest();
    request3.onload = function () {
        if(this.readyState == 4 && this.status == 200) {
            var object = JSON.parse(this.response);
            //ticketsYears
            var arr1 = object.years; 
            let yearDropDown=' <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuDate1">';
            for(var i=0; i< arr1.length; i++) {
                if(arr1[i] == '2018'){
                    $('#dropdownMenuDate1').text(arr1[i]);
                }
                yearDropDown+='<a class="dropdown-item" href="#">'+arr1[i]+'</a>'; 
               
            } 
            yearDropDown+='</div>';
            $("#ticketsYears").append(yearDropDown);
           //ticketsTable    
            var arr2 = object.tickets;
            for(var i=0; i< arr2.length; i++) {
                let row0="<tr>";
                row0 +="<td class='pl-0'><div class='";
                let city = arr2[i].city;
                switch(city){
                    case "Stockholm":
                    row0 +=" icon-rounded-primary ";
                    break;
                    case "Västerås":
                    row0 +=" icon-rounded-info ";
                    break;
                    case "Sala":
                    row0 +=" icon-rounded-danger ";
                    break;
                    case "Fagersta":
                    row0 +=" icon-rounded-warning ";
                    break;
                }
                row0 +=" icon-rounded-md'><h4 class='font-weight-medium'>";
                let fullname = arr2[i].fullname;
                let fullanme = fullname.split(" ");
                fname_firstLetter = fullanme[0][0];
                Lname_firstLetter = fullanme[1][0];
                row0 +=fname_firstLetter+Lname_firstLetter;
                row0 +="</h4></div></td>";
                row0 += "<td><p class='mb-0'>"+fullname+"</p><p class='text-muted mb-0'>"+city+"</p></td>";
                row0 += "<td><p class='mb-0'>"+arr2[i].date+"</p><p class='text-muted mb-0'>"+arr2[i].time+"</p></td>";
                row0+= "<td><p class='mb-0'>"+arr2[i].project+"</p><p class='text-muted mb-0'>"+arr2[i].status+"</p></td>";
                row0 +="<td class='pr-0'><i class='mdi mdi-dots-horizontal icon-sm cursor-pointer'></i></td>";
                row0 +="</tr>";
                $("#TicketsTable").append(row0);
            } 
        
        }
    };
    request3.open("GET", "https://fe18.azurewebsites.net/api/tickets", true);
    request3.send();
    //
    //TotalGrowth
    let request4 = new XMLHttpRequest();
   request4.onload = function () {
        if(this.readyState == 4 && this.status == 200) {
            var object = JSON.parse(this.response);
            let row1 ="<h3 class='mb-0 mb-md-1 mb-lg-0 mr-1'>"+object.amount.toLocaleString('sv-SV')+""+object.currency+"</h3><small class='mb-0'>"+object.period+"</small>";
            $("#TotalGrowth").append(row1);
        }
    };
    request4.open("GET", "https://fe18.azurewebsites.net/api/totalgrowth", true);
    request4.send();
    //
    //
    let request5 = new XMLHttpRequest();
   request5.onload = function () {
        if(this.readyState == 4 && this.status == 200) {
            var object = JSON.parse(this.response);
            let row1 ="<h3 class='mb-0 mb-md-1 mb-lg-0 mr-1'>"+object.amount.toLocaleString('sv-SV')+""+object.currency+"</h3><small class='mb-0'>"+object.period+"</small>";
            $("#TotalOrders").append(row1);
        }
    };
    request5.open("GET", "https://fe18.azurewebsites.net/api/totalorders", true);
    request5.send();
    //
    //
    let request6 = new XMLHttpRequest();
    request6.onload = function () {
         if(this.readyState == 4 && this.status == 200) {
             var object = JSON.parse(this.response);
             let row1 ="<h3 class='mb-0 mb-md-1 mb-lg-0 mr-1'>"+object.amount.toLocaleString('sv-SV')+""+object.currency+"</h3><small class='mb-0'>"+object.period+"</small>";
             $("#TotalPurchases").append(row1);
         }
     };
     request6.open("GET", "https://fe18.azurewebsites.net/api/totalpurchases", true);
     request6.send();
    //TotalSales
    let request7 = new XMLHttpRequest();
    request7.onload = function () {
         if(this.readyState == 4 && this.status == 200) {
             var object = JSON.parse(this.response);
             let row1 ="<h3 class='mb-0 mb-md-1 mb-lg-0 mr-1'>"+object.amount.toLocaleString('sv-SV')+""+object.currency+"</h3><small class='mb-0'>"+object.period+"</small>";
             $("#TotalSales").append(row1);
         }
     };
     request7.open("GET", "https://fe18.azurewebsites.net/api/totalsales", true);
     request7.send();

    //https://fe18.azurewebsites.net/api/user
    //user


    //https://fe18.azurewebsites.net/api/salereportchart
    //salereportchart
    let request8 = new XMLHttpRequest();
    request8.onload = function () {
         if(this.readyState == 4 && this.status == 200) {
             var object = JSON.parse(this.response);
             array1 = object.labels;
             array2 = object.datasets.data;  
            }
     };
     request8.open("GET", "https://fe18.azurewebsites.net/api/salereportchart", true);
     request8.send();
     
     
     
     
     
     
     
     //diffMonth function
        function diffMonth(date1, date2){
            var date1 = new Date(date1);
            var date2 = new Date(date2);
            var diffYears = date2.getFullYear()-date1.getFullYear();
            var diffMonths = date2.getMonth()-date1.getMonth();
            var diffDays = date2.getDate()-date1.getDate();
            var months = (diffYears*12 + diffMonths);
            if(diffDays>0) {
                    months += '.'+diffDays;
            } else if(diffDays<0) {
                    months--;
                    months += '.'+(new Date(date2.getFullYear(),date2.getMonth(),0).getDate()+diffDays);
                }
            return months;
        }   
 });
//cookies

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function checkCookie(usernae) {
    var user=getCookie("username");
    if (user != "") {
        $("#welcomwe").text("Hi, " + user );
    } else {
         setCookie("username", usernae, 1);
       }
  }
  function removeCookie () {
    document.cookie="username=;expires=Wed 01 Jan 1970";
    window.location.href = "login.html";
  }
 
  
