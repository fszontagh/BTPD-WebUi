    /**
     * Convert number of bytes into human readable format
     *
     * @param integer bytes     Number of bytes to convert
     * @param integer precision Number of digits after the decimal separator
     * @return string
     */
    function bytesToSize(bytes, precision, speed)
    {  
		if (bytes==0) { return ""; }
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
	var el = $("#err");
	el.html(string);
	if (el.css("display")=='none') {
		el.fadeIn(1200);
	}
	if (autohide)  {
		autohideerror();
	}
}
