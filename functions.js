    /**
     * Convert number of bytes into human readable format
     *
     * @param integer bytes     Number of bytes to convert
     * @param integer precision Number of digits after the decimal separator
     * @return string
     */
    function bytesToSize(bytes, precision, speed,show_null)
    {  
		if (bytes==0 && !show_null) { return ""; }
        var kilobyte = 1024;
        var megabyte = kilobyte * 1024;
        var gigabyte = megabyte * 1024;
        var terabyte = gigabyte * 1024;
       
        if ((bytes >= 0) && (bytes < kilobyte)) {
            return bytes + ' B' + (speed?"/s":"");
     
        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
            return (bytes / kilobyte).toFixed(precision) + ' KB' + (speed?"/s":"");
     
        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
            return (bytes / megabyte).toFixed(precision) + ' MB' + (speed?"/s":"");
     
        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            return (bytes / gigabyte).toFixed(precision) + ' GB' + (speed?"/s":"");
     
        } else if (bytes >= terabyte) {
            return (bytes / terabyte).toFixed(precision) + ' TB' + (speed?"/s":"");
     
        } else {
            return bytes + ' B' + (speed?"/s":"");
        }
    }
function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

//pads left
var lpad = function(str,padString, length) {	
    while (str.length < length)
        str = padString + str;
    return str;
}

var state = function(id) {
 var statte_a = new Array();
	 statte_a = ["Inactive","Starting...","Stopped","<span class=\"down\">Downloading</span>","<span class=\"up\">Uploading</span>"];
 return statte_a[id];
}
var hideerror = function() {
		var e = $("#error");
		if (e.css("display")=='none') {
			return;
		}
		e.fadeOut(1200);		
                $("#torrent_lista").animate({"opacity":1},1000);
}
var autohideerror = function(secs) {
	if (typeof(secs)!='integer') {
		secs = 10000;
	}
	var intval_obj = setInterval(function(){
		hideerror();	
		clearInterval(intval_obj);
	},secs);
}

var showerror = function(string,autohide) {
	var el = $("#error");
        var elp = $("#error p");
	elp.html(string);
	if (el.css("display")=='none') {
		el.fadeIn(1200);
                $("#torrent_lista").animate({"opacity":0},1000);
	}
	if (autohide)  {
		autohideerror();
	}
}
function cutTitle(title, length) {
	if (!length) {
		length = 24;
	}
	if (title.length > length) {
		return title.substr(0,length) + "...";
	}
	return title;
}
var torrent_details = function(id) {
	$.ajax({
			type: "POST",
			dataType: "json",
			data: 'cmd=details&id='+id,
			url : "api.php",
			success: function(data) {
				
				
				var details_name = $("#details_name");
				var details_full_size = $("#details_full_size");
				var details_downloaded = $("#details_downloaded");
				var details_downloaded_have = $("#details_downloaded_have");
				var details_uploaded = $("#details_uploaded");
				var details_session_up = $("#details_session_up");
				var details_session_down = $("#details_session_down");
				var details_ratio = $("#details_ratio");		
				var details_path = $("#details_path");	
				var details_hash = $("#details_hash");
				var details_error = $("#details_error");
				details_name.html("");
				details_full_size.html("");
				details_downloaded.html("");
				details_downloaded.html("");
				details_uploaded.html("");
				details_session_up.html("");
				details_session_down.html("");
				details_ratio.html("");
				details_path.html("");
				details_hash.html("");
				details_error.html("");
				
				var details_win = $("#details");				
				if (details_win.css("display")=='none') {
					showOverlay();
					
				details_name.html(cutTitle(data[NAME],30));
				details_name.attr("title",data[NAME]);
				details_full_size.html(bytesToSize(data[CSIZE],2,false,true));
				details_downloaded.html(bytesToSize(data[TOTDWN],2,false,true));
				details_downloaded_have.html(bytesToSize(data[CGOT],2,false,true));
				details_uploaded.html(bytesToSize(data[TOTUP],2,false,true));
				details_session_up.html(bytesToSize(data[SESSUP],2,false,true));
				details_session_down.html(bytesToSize(data[SESSDWN],2,false,true));
				details_ratio.html(roundNumber(data[TOTUP] / data[TOTDWN],1));
				details_path.html(data[DIR]);
				details_hash.html(data[IHASH]);
				if (data[TRERR] == 0) {
					details_error.html(lng_strings["no_error"]);
				}else{
					details_error.html(data[TRERR]);
				}					
					
					details_win.fadeIn(1200);
				}			
				

				

			},
			 ifModified: true,
			 error: function(Xhr,errorStr,throwmsg) {
				 showerror(errorStr);
			 },
	});
}
function showOverlay() {
	var overlay = $("#overlay");
	if (overlay.css("display")=='none') {
		var windth = $(document).width();
		var height = $(document).height();
		overlay.css({
			width: windth,
			height: height				
		});
		overlay.fadeIn(1200);
	}	
}
function hideOverlay() {
	var overlay = $("#overlay");
	if (overlay.css("display")!='none') {
		overlay.fadeOut();
		overlay.css({
			width: '0px',
			height: '0px'
		});
	}
}
