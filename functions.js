//colResizable - by Alvaro Prieto Lauroba - MIT & GPL
(function(a){function h(b){var c=a(this).data(q),d=m[c.t],e=d.g[c.i];e.ox=b.pageX;e.l=e[I]()[H];i[D](E+q,f)[D](F+q,g);P[z](x+"*{cursor:"+d.opt.dragCursor+K+J);e[B](d.opt.draggingClass);l=e;if(d.c[c.i].l)for(b=0;b<d.ln;b++)c=d.c[b],c.l=j,c.w=c[u]();return j}function g(b){i.unbind(E+q).unbind(F+q);a("head :last-child").remove();if(l){l[A](l.t.opt.draggingClass);var f=l.t,g=f.opt.onResize;l.x&&(e(f,l.i,1),d(f),g&&(b[G]=f[0],g(b)));f.p&&O&&c(f);l=k}}function f(a){if(l){var b=l.t,c=a.pageX-l.ox+l.l,f=b.opt.minWidth,g=l.i,h=1.5*b.cs+f+b.b,i=g==b.ln-1?b.w-h:b.g[g+1][I]()[H]-b.cs-f,f=g?b.g[g-1][I]()[H]+b.cs+f:h,c=s.max(f,s.min(i,c));l.x=c;l.css(H,c+p);if(b.opt.liveDrag&&(e(b,g),d(b),c=b.opt.onDrag))a[G]=b[0],c(a)}return j}function e(a,b,c){var d=l.x-l.l,e=a.c[b],f=a.c[b+1],g=e.w+d,d=f.w-d;e[u](g+p);f[u](d+p);a.cg.eq(b)[u](g+p);a.cg.eq(b+1)[u](d+p);if(c)e.w=g,f.w=d}function d(a){a.gc[u](a.w);for(var b=0;b<a.ln;b++){var c=a.c[b];a.g[b].css({left:c.offset().left-a.offset()[H]+c.outerWidth()+a.cs/2+p,height:a.opt.headerOnly?a.c[0].outerHeight():a.outerHeight()})}}function c(a,b){var c,d=0,e=0,f=[];if(b)if(a.cg[C](u),a.opt.flush)O[a.id]="";else{for(c=O[a.id].split(";");e<a.ln;e++)f[y](100*c[e]/c[a.ln]+"%"),b.eq(e).css(u,f[e]);for(e=0;e<a.ln;e++)a.cg.eq(e).css(u,f[e])}else{O[a.id]="";for(e in a.c)c=a.c[e][u](),O[a.id]+=c+";",d+=c;O[a.id]+=d}}function b(b){var e=">thead>tr>",f='"></div>',g=">tbody>tr:first>",i=">tr:first>",j="td",k="th",l=b.find(e+k+","+e+j);l.length||(l=b.find(g+k+","+i+k+","+g+j+","+i+j));b.cg=b.find("col");b.ln=l.length;b.p&&O&&O[b.id]&&c(b,l);l.each(function(c){var d=a(this),e=a(b.gc[z](w+"CRG"+f)[0].lastChild);e.t=b;e.i=c;e.c=d;d.w=d[u]();b.g[y](e);b.c[y](d);d[u](d.w)[C](u);if(c<b.ln-1)e.mousedown(h)[z](b.opt.gripInnerHtml)[z](w+q+'" style="cursor:'+b.opt.hoverCursor+f);else e[B]("CRL")[A]("CRG");e.data(q,{i:c,t:b[v](o)})});b.cg[C](u);d(b);b.find("td, th").not(l).not(N+"th, table td").each(function(){a(this)[C](u)})}var i=a(document),j=!1,k=null,l=k,m=[],n=0,o="id",p="px",q="CRZ",r=parseInt,s=Math,t=a.browser.msie,u="width",v="attr",w='<div class="',x="<style type='text/css'>",y="push",z="append",A="removeClass",B="addClass",C="removeAttr",D="bind",E="mousemove.",F="mouseup.",G="currentTarget",H="left",I="position",J="}</style>",K="!important;",L=":0px"+K,M="resize",N="table",O,P=a("head")[z](x+".CRZ{table-layout:fixed;}.CRZ td,.CRZ th{padding-"+H+L+"padding-right"+L+"overflow:hidden}.CRC{height:0px;"+I+":relative;}.CRG{margin-left:-5px;"+I+":absolute;z-index:5;}.CRG .CRZ{"+I+":absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;top:0px}.CRL{"+I+":absolute;width:1px}.CRD{ border-left:1px dotted black"+J);try{O=sessionStorage}catch(Q){}a(window)[D](M+"."+q,function(){for(a in m){var a=m[a],b,c=0;a[A](q);if(a.w!=a[u]()){a.w=a[u]();for(b=0;b<a.ln;b++)c+=a.c[b].w;for(b=0;b<a.ln;b++)a.c[b].css(u,s.round(1e3*a.c[b].w/c)/10+"%").l=1}d(a[B](q))}});a.fn.extend({colResizable:function(c){c=a.extend({draggingClass:"CRD",gripInnerHtml:"",liveDrag:j,minWidth:15,headerOnly:j,hoverCursor:"e-"+M,dragCursor:"e-"+M,postbackSafe:j,flush:j,marginLeft:k,marginRight:k,disable:j,onDrag:k,onResize:k},c);return this.each(function(){var d=c,e=a(this);if(d.disable){if(e=e[v](o),(d=m[e])&&d.is(N))d[A](q).gc.remove(),delete m[e]}else{var f=e.id=e[v](o)||q+n++;e.p=d.postbackSafe;if(e.is(N)&&!m[f])e[B](q)[v](o,f).before(w+'CRC"/>'),e.opt=d,e.g=[],e.c=[],e.w=e[u](),e.gc=e.prev(),d.marginLeft&&e.gc.css("marginLeft",d.marginLeft),d.marginRight&&e.gc.css("marginRight",d.marginRight),e.cs=r(t?this.cellSpacing||this.currentStyle.borderSpacing:e.css("border-spacing"))||2,e.b=r(t?this.border||this.currentStyle.borderLeftWidth:e.css("border-"+H+"-"+u))||1,m[f]=e,b(e)}})}})})(jQuery)

function Set_Cookie( name, value, expires, path, domain, secure )
{
// set time, it's in milliseconds
var today = new Date();
today.setTime( today.getTime() );

/*
if the expires variable is set, make the correct
expires time, the current script below will set
it for x number of days, to make it for hours,
delete * 24, for minutes, delete * 60 * 24
*/
if ( expires )
{
expires = expires * 1000 * 60 * 60 * 24;
}
var expires_date = new Date( today.getTime() + (expires) );

document.cookie = name + "=" +escape( value ) +
( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
( ( path ) ? ";path=" + path : "" ) +
( ( domain ) ? ";domain=" + domain : "" ) +
( ( secure ) ? ";secure" : "" );
}
function Get_Cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f

	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );


		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}
    /* Convert number of bytes into human readable format
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
