const CGOT = 1;
const CSIZE = 3;    //size of the completed data ??
const DIR = 5;      //data target directory
const NAME = 7;     //the name of the torrent
const NUM = 9;      //??
const IHASH = 11;   //info hash
const PCGOT = 13;   //peers got
const PCOUNT = 15;  //peers count
const PCCOUNT = 17; //peers ??
const PCSEEN = 19;  // peers ??
const RATEDWN = 21; //download download rate
const RATEUP = 23;  //upload rate
const SESSDWN = 25; //in session downloaded
const SESSUP = 27;  //in session uploaded
const STATE = 29;   //state (seeding, starting, downloading, stopping ... )
const TOTDWN = 31;  //total uploaded (including the network traffic)
const TOTUP = 33;   //total uploaded
const TRERR = 35;   //torrent error ??
var timed_fader_timer = 0;
var timed_fader_obj = new Array();
var obj_couner = 0;
var itt_tart = 0;

var timed_fader_time_up = function (i,max) {
    clearInterval(timed_fader_obj);
    if ($("#row_"+i).length < 1) {
        i++;
        timed_fader_time_up(i,max);
    }else {
        $("#row_" + i).animate({
            "opacity": 1
        }, 100,function(){
            obj_couner++;
            if (obj_couner>=max) {
                return false;
            }else{
                i++;
                timed_fader_time_up(i,max);
                return true;
            }

        });
    }


}

var start_timed_fader = function (i,max) {
    timed_fader_obj = setInterval("timed_fader_time_up(" + i + ", "+max+")", 100);
}

var start_torrent = function (id) {
    $.ajax({
        error: function(Xhr,errorStr,throwmsg) {
            showerror(errorStr,true);
        },
        type: "POST",
        url: "api.php",
        dataType: "json",
        data: "cmd=start&id=" + id
    });
}

var stop_torrent = function (id) {
    $.ajax({
        error: function(Xhr,errorStr,throwmsg) {
            showerror(errorStr,true);
        },
        type: "POST",
        url: "api.php",
        dataType: "json",
        data: "cmd=stop&id=" + id
    });
}
var getAvailableLanguages = function () {
    $.ajax({
        error: function(Xhr,errorStr,throwmsg) {
            showerror(errorStr,true);
        },
        type: "POST",
        url: "api.php",
        dataType: "json",
        data: "LANG_LIST=get",
        success: function(data) {   
           var current_lang = Get_Cookie("language");                        
           for (var i = 0; i < data.length; i++) {
               if (current_lang == data[i]) {
                    $("#language_selector").append("<option selected=\"selected\" value='"+data[i]+"'>"+data[i]+"</option>");                   
               }else{
                    $("#language_selector").append("<option value='"+data[i]+"'>"+data[i]+"</option>");              
               }
              
           }
        }
    });
}

var getAvailableThemes = function () {
    $.ajax({
        error: function(Xhr,errorStr,throwmsg) {
            showerror(errorStr,true);
        },
        type: "POST",
        url: "api.php",
        dataType: "json",
        data: "THEME_LIST=get",
        success: function(data) {   
           var current_theme = Get_Cookie("theme");               
           for (var i = 0; i < data.length; i++) {
               if (current_theme == data[i]) {
                   $("#theme_selector").append("<option selected=\"selected\" value='"+data[i]+"'>"+data[i]+"</option>");              
               }else{
                    $("#theme_selector").append("<option value='"+data[i]+"'>"+data[i]+"</option>");              
               }
           }
        }
    });
}

var delete_torrent = function (id) {
    var r = confirm(lng_strings["confirm_delete"]);
    if (r) {
        $.ajax({
            error: function(Xhr,errorStr,throwmsg) {
                showerror(errorStr,true);
            },
            type: "POST",
            url: "api.php",
            data: "cmd=delete&id=" + id,
            success: function (data) {
                if (data["resp"].length > 0) {
                    if (data["resp"] == "ok") {
                        $("#row_" + id).fadeOut(1200);
                    } else {
                        showerror(data["resp"],true);
                    }
                }

            }
        });
    }
}

request = function () {
    $.ajax({
        type: "POST",
        url: "api.php",
        dataType: "json",
        data: "cmd=list",
        ifModified: true,
        error: function(Xhr,errorStr,throwmsg) {
            showerror(errorStr,true);
        },
        success: function (data) {
            if (data["err"] && data["err"].length>0) {
                showerror(data["err"],true);
                return;
            }
            /*
             *@desc summary of the used bandwidth
             **/
            var sum_upspeed = sum_downspeed = 0;
            /*
             * @desc main data summary of all torrent
             */
            var sum_uploaded = sum_downloaded = sum_allsize = sum_numpeer = 0;
            var max = data.length;
            for (var i = 0; i < max; i++) {
                var exists = false;

                timed_fader_timer = i;

                var szoveg = data[i];
                var row,torrent_control,torrent_name,torrent_state,torrent_upspeed,torrent_downspeed,torrent_peers,torrent_up,torrent_down,torrent_tdown;

                if ($("tr#row_" + szoveg[NUM]).length == 0) {
                    row = $("<tr/>");
                    row.attr("id","row_" + szoveg[NUM]);
                    if (row.css("opacity")>0) {
                        row.css("opacity", 0);
                        if (i==0) {
                            timed_fader_obj = setInterval("timed_fader_time_up(0, "+max+")", 200);
                        }

                    }
                    if ($("#summary").length == 1) {
                        $("#summary").before(row);
                    } else {
                        $("#torrent_lista").append(row);
                    }
                    torrent_name = $("<td/>");
                    torrent_state = $("<td/>");
                    torrent_upspeed = $("<td/>");
                    torrent_downspeed = $("<td/>");
                    torrent_peers =$("<td/>");
                    torrent_up =$("<td/>");
                    torrent_down =$("<td/>");
                    torrent_tdown =$("<td/>");
                    torrent_control = $("<td/>");

                    row.append(torrent_name);
                    row.append(torrent_state);
                    row.append(torrent_upspeed);
                    row.append(torrent_downspeed);
                    row.append(torrent_peers);
                    row.append(torrent_up);
                    row.append(torrent_down);
                    row.append(torrent_tdown);
                    row.append(torrent_control);

                } else {
                    exists = true;
                    row = $("#row_" + szoveg[NUM]);
                    var child = row.children("td");
                    torrent_name = $(child[0]);
                    torrent_state = $(child[1]);
                    torrent_upspeed = $(child[3]);
                    torrent_downspeed = $(child[2]);
                    torrent_peers = $(child[4]);
                    torrent_down = $(child[5]);
                    torrent_up = $(child[6]);                    
                    torrent_tdown = $(child[7]);
                    torrent_control = $(child[8]);
                }
                var procent = (szoveg[CGOT] / szoveg[CSIZE]) * 100;
                procent = Math.round(procent) + "%";


               if (!exists) {
                    torrent_name.attr("class","torrent_name");
                    torrent_name.html("<span onclick=\"torrent_details("+szoveg[NUM]+")\">"+ szoveg[7]+"</span>");
               }


                /*	state	*/
                if (torrent_state.html() != state(szoveg[STATE])) {
                    torrent_state.attr("class","torrent_state");
                    torrent_state.html(state(szoveg[STATE]));
                }


                torrent_downspeed.attr("class","torrent_speed down");
                torrent_downspeed.html(bytesToSize(szoveg[RATEDWN], 2,true));

                torrent_upspeed.attr("class","torrent_speed up");
                torrent_upspeed.html(bytesToSize(szoveg[RATEUP], 2,  true));

                torrent_peers.attr("class","torrent_peers");
                torrent_peers.html((szoveg[PCOUNT] == 0 ? "" : szoveg[PCOUNT]));

                torrent_down.attr("class","size");
                torrent_down.html(bytesToSize(szoveg[TOTDWN], 2));


                torrent_up.attr("class","size");
                torrent_up.html(bytesToSize(szoveg[TOTUP], 2));


                
                torrent_tdown.attr("class","size");
                
                torrent_tdown.html(bytesToSize(szoveg[CSIZE], 2));
                


                if (torrent_control.attr("class")!="torrent_control") {
                    torrent_control.attr("class","torrent_control");
                }
                /*	controls	*/

                var trctrl_str = "";
                switch (szoveg[STATE]) {
                    case 0:
                    case 2:
                        trctrl_str+= "[<span class=\"control-start\" onclick=\"start_torrent(" + szoveg[NUM] + "); return false;\">START</span>]";
                        break;
                    default:
                        trctrl_str+= "[<span class=\"control-stop\" onclick=\"stop_torrent(" + szoveg[NUM] + "); return false;\">STOP</span>]";
                        break;
                }
                trctrl_str += " [<span class=\"control-delete\" onclick=\"delete_torrent(" + szoveg[NUM] + "); return false;\">DELETE</span>]";
                if (torrent_control.html()!=trctrl_str) {
                    torrent_control.html(trctrl_str);
                }



                //torrent_control,torrent_name,torrent_state,torrent_upspeed,torrent_downspeed,torrent_peers,torrent_up,torrent_down,torrent_tdown
                sum_upspeed += szoveg[RATEUP];
                sum_downspeed += szoveg[RATEDWN];
                sum_downloaded += szoveg[TOTDWN];
                sum_uploaded += szoveg[TOTUP];
                sum_allsize += szoveg[CSIZE];
                sum_numpeer += szoveg[PCOUNT];

            }
            document.title = "BTPD webui - U: " + bytesToSize(sum_upspeed, 0, true) + " D: " + bytesToSize(sum_downspeed, 0, true);
            var html = "<td colspan=\"2\" class=\"torrent_name\">"+lng_strings["summary"]+": </td>" + "<td class=\"torrent_speed down\">" + bytesToSize(sum_downspeed, 2, true) + "</td>" + "<td class=\"torrent_speed up\">" + bytesToSize(sum_upspeed, 2, true) + "</td>" + "<td class=\"size\">" + sum_numpeer + "</td>" + "<td class=\"size\">" + bytesToSize(sum_downloaded, 2) + "</td>" + "<td class=\"size\">" + bytesToSize(sum_uploaded, 2) + "</td>" + "<td class=\"size\">" + bytesToSize(sum_allsize, 2) + "</td>" + "<td></td>";

            var sum_row;
            if ($("#summary").length < 1) {
                sum_row = $("<tr id=\"summary\">");
                $("#torrent_lista").append(sum_row);
            } else {
                sum_row = $("#summary");
            }
            sum_row.html(html);

        }
    });
}
var space_req = function () {
    $.ajax({
        url: "api.php",
        data: "cmd=space",
        dataType: "json",
        type: "POST",
        ifModified: true,
        error: function(Xhr,errorStr,throwmsg) {
            showerror(errorStr,true);
        },
        success: function (data) {

            var bgcolor = '#BFBFBF'; //gray
            var fgcolor = '#fff';
            var used = data["usedp"];
            if (used >= 75) {
                bgcolor = '#00D021'; //green
                fgcolor = '#000000'
            }

            if (used > 50 && used < 75) {
                bgcolor = '#9BE384'; //light green
                fgcolor = '#000000'
            }
            if (used < 50 && used > 25) {
                bgcolor = '#DEE23E'; //yellow
                fgcolor = '#fff'
            }
            if (used < 25) {
                bgcolor = '#FF3B3E'; //red
                fgcolor = '#fff'
            }



            var allstring = lng_strings["free"]+": " + bytesToSize(data["free"], 2) + " <small>(" + Math.round(used) + "%)</small> "+lng_strings["used"]+": " + bytesToSize(data["used"], 2) + " "+lng_strings["total"]+": " + bytesToSize(data["total"], 2);
            $(".meter-text").html(allstring);
            $(".meter-text").css("color",fgcolor);
            $(".meter-value").css("backgroundColor", bgcolor);
            $(".meter-value").animate({
                "width": used + "%"
            }, 1000);


        }

    });
}

var translator = function() {
    var bcontent = $("body").html();
    $.each(lng_strings,function(key,val) {
        reg = new RegExp('\{'+key+'\}', 'gi');
        bcontent = bcontent.replace(reg,val);
    });
    $("body").html(bcontent);
}
$(document).ready(function () {
   

    var list_interval = setInterval(request, 1000);
    var space_interval = setInterval(space_req, 5000);
    translator();
    var details_win = $("#details");
    details_win.css({
        "left" : (($(window).width()/2) - 200) + "px",
        "top" :  (($(window).height()/2) - 250) + "px"
    });
    getAvailableLanguages();
    getAvailableThemes();

$('#theme_selector').bind("change",function(){
   Set_Cookie("theme", $("#theme_selector option:selected").text());
   window.location = document.URL;
});
$('#language_selector').bind("change",function(){  
  Set_Cookie("language", $("#language_selector option:selected").text());
  window.location = document.URL;
  translator();
});

  
  var onSampleResized = function(e){  
    var table = $(e.currentTarget); //reference to the resized table
  };  
/*
 $("#torrent_lista").colResizable({
    liveDrag:false,
    minWidth: "150px",
    gripInnerHtml:"<div class='grip'></div>", 
    draggingClass:"dragging", 
   // onResize:onSampleResized
  });    
  */

  $("#torrent_lista").colResizable();
  $("#torrent_lista tr td").css({
      "border": '1px solid #cacaca'
  });



});
 /*   $('#theme_selector').change(function() {
    alert('Handler for .change() called.');
    });*/


$(window).resize(function() {
    var details_win = $("#details");
    var overlay = $("#overlay");
    overlay.css({
        width: $(document).width(),
        height: $(document).height
    });
    var new_left = (($(window).width()/2) - 200);
    var new_top = (($(window).height()/2) - 250);
    if (new_left < 0 ) {
        new_left = 0;
    }
    if (new_top < 0) {
        new_top = 0;
    }
    details_win.css({
        "left" : new_left + "px",
        "top" :  new_top  + "px"
    });
});
