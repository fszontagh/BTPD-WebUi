<?php
/*
 * BTPD Webui written by gH0StArthour <ghostarthour@gmail.com> (2011. 12. 31.)
 * class.btpdControl.php written by: Volkov Sergey, for more details see the source
 * bencode.php written by: Gerard Krijgsman, for more details see the source
 * sanitize function by: http://chyrp.net/	(in this source file, from line 62.)
 * Source code is formatted by: http://beta.phpformatter.com in K&R style
 * Thx for the authors of the btpd!
 */
define("LOG_VERBOSE",3); 
define("LOG_ERRORS",2);
define("LOG_SILENT",1);
set_error_handler("errorHandler");
include_once 'config.php';
include_once 'class.btpdControl.php';
include_once 'bencode.php';

$lang = strtolower(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2));
if (file_exists("lng/".$lang.".php")) {
	$LANG = include("lng/".$lang.".php");
	if ($LOGGING_LEVEL == LOG_VERBOSE) {
		wlog("Loaded language file: lng/".$lang.".php");
	}
}elseif (file_exists("lng/".$DEFAULT_LANG.".php")){	
	$LANG = include("lng/".$DEFAULT_LANG.".php");
	if ($LOGGING_LEVEL == LOG_VERBOSE) {
		wlog("Loaded config's default language file: lng/".$DEFAULT_LANG.".php");
	}
}else{
	$LANG = include("lng/en.php");
	if ($LOGGING_LEVEL == LOG_VERBOSE) {
		wlog("Loaded default language file: lng/en.php");
	}
}

/*	nice redirect	*/
function Redirect() {
	header("Refresh: 3; url=" . $_SERVER["HTTP_REFERER"]);
	echo "Redirecting in <span style=\"color: #1E90FF\" id=\"counter\">3</span> secs to: <a href=\"".$_SERVER["HTTP_REFERER"]."\">" . $_SERVER["HTTP_REFERER"] . "</a><hr/>";
        echo "<script type=\"text/javascript\">
					var s = 3;
					var rem = function() {
						s--;
						var el = document.getElementById('counter');
						el.innerHTML = s;
					}
					setInterval(rem,1000);			
					</script>";
}
/*	set error hadler	*/
function wlog($string) {
	GLOBAL $WEBUI_ERROR_LOGS;
    if (is_array($string)) {
        $error_string = "[DEBUG]" . date("Y-m-d H:i:s") . ":" . print_r($string, true) . "\n";
    } else {
        $string       = str_replace(array(
            "\n",
            "\t",
            "  ",
            "[",
            "]"
        ), array(
            "",
            " ",
            "",
            " [",
            "] "
        ), $string);
        $error_string = "[DEBUG]" . date("Y-m-d H:i:s") . ":" . $string . "\n";
    }
    file_put_contents($WEBUI_ERROR_LOGS, $error_string, FILE_APPEND);
}
function translator($key) {
	GLOBAL $LANG;
	if (isset($LANG[$key]) AND !empty($LANG[$key])) {		
		return $LANG[$key];
	}
	return $key;
}
function languageToJS() {
	GLOBAL $LANG;	
	$return = "";
	header("Content-Type: application/x-javascript;charset=utf-8");		
	$return.= "var lng_strings = { \n"; 
		
		foreach ($LANG as $k=>$v) {				
			$return.= "'".$k."': '".$v."',";
			$return.= "\n";		
		}
		$return = substr($return,0,-2);
		$return.= "\n};";
		if ($LOGGING_LEVEL == LOG_VERBOSE) {
			wlog("Loaded ".count($LANG)." lng strings...");
		}
	
		header("Etag: ".md5($return));
		header("Last-Modified: " . gmdate("D, d M Y H:i:s",filemtime("lng/".$lang.".php")));
	echo $return;
	exit;
}
function errorHandler($errno, $errstr, $errfile, $errline) {
    $error_string = "[  PHP] " . date("Y-m-d H:i:s") . ": " . $errfile . " (" . $errline . "): " . $errstr . "\n";
    file_put_contents("/var/www/www/new/error.log", $error_string, FILE_APPEND);
    return true;
}
function convertToJson($a) {
    if (is_array($a)) {
        foreach ($a as $k => $v) {
            if (is_array($v)) {
                $a[$k] = $v = convertToJson($v);
            } else {
                if (!is_numeric($v) && !is_bool($v)) {
                    $a[$k] = utf8_encode($v);
                }
            }
        }
    } else {
        if (!is_numeric($a)) {
            $a = utf8_encode($a);
        }
    }
    return $a;
}
/**
 * Function: sanitize
 * Returns a sanitized string, typically for URLs.
 *
 * Parameters:
 *     $string - The string to sanitize.
 *     $force_lowercase - Force the string to lowercase?
 *     $anal - If set to *true*, will remove all non-alphanumeric characters.
 */
function sanitize($string, $force_lowercase = true, $anal = false) {
    $strip = array(
        "~",
        "`",
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "_",
        "=",
        "+",
        "[",
        "{",
        "]",
        "}",
        "\\",
        "|",
        ";",
        ":",
        "\"",
        "'",
        "&#8216;",
        "&#8217;",
        "&#8220;",
        "&#8221;",
        "&#8211;",
        "&#8212;",
        "â€”",
        "â€“",
        ",",
        "<",
        ".",
        ">",
        "/",
        "?"
    );
    $clean = trim(str_replace($strip, "", strip_tags($string)));
    $clean = preg_replace('/\s+/', "-", $clean);
    $clean = ($anal) ? preg_replace("/[^a-zA-Z0-9]/", "", $clean) : $clean;
    return ($force_lowercase) ? (function_exists('mb_strtolower')) ? mb_strtolower($clean, 'UTF-8') : strtolower($clean) : $clean;
}
if (isset($_GET["LANGUAGE"]) AND !empty($_GET["LANGUAGE"])) {
	languageToJS();
}
if (isset($argv)) {
    $req["cmd"] = $argv[1];
} else {
    $req = $_POST;
}
$btpd = new btpdControl($PATH);
/*		handle torrent upload	*/
if (isset($_FILES["upload"]) AND !empty($_FILES["upload"])) {
    header("Content-Type: text/html;charset=utf-8");
    $name = "tmp/" . sanitize($_FILES["upload"]["name"]);
    if (!is_dir("tmp")) {
        mkdir("tmp");
    }
    if (move_uploaded_file($_FILES["upload"]["tmp_name"], $name)) {
        $content = file_get_contents($name);
        $resp    = $btpd->btpd_add_torrent($content, $DATA_PATH); 
        echo "<html><head><title>Add torrent</title><style type=\"text/css\">body{background-color: #000;color:#fff;} a,a:visited {color:#1E90FF;}</style></head><body>";       
        if ($resp["code"] != 0) {
			Redirect();
            echo "<span style=\"color:#FF0000;\">" . $btpd->get_btpd_error($resp['code']) . "</span>";
            if ($LOGGING_LEVEL == LOG_ERRORS) {
				wlog($name." -> ".$btpd->get_btpd_error($resp['code']));
			}
            if (!unlink($name) AND $LOGGING_LEVEL == LOG_ERRORS) {
				wlog("Can not delete tmp file: ".$name);
			}
        } else {
			if ($LOGGING_LEVEL == LOG_VERBOSE) {
				wlog("Torrent added: ".$name);
			}
            if (!unlink($name) AND $LOGGING_LEVEL == LOG_ERRORS) {
				wlog("Can not delete tmp file: ".$name);
			}
            header("Location: " . (isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : "index.html"));
        }
        exit;
    } else {
        Redirect();        
        echo "<span style=\"color:#FF0000;\">ERR: can not upload file: " . $_FILES["upload"]["name"] . "</span>";
        
            if (!unlink($name) AND $LOGGING_LEVEL == LOG_ERRORS) {
				wlog($_FILES["upload"]["name"]." -> can not upload...");
			}
        exit;
    }
    header("Location: " . (isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : "index.html"));
    exit;
}
if (!isset($req["cmd"])) {
	Redirect();
    echo " Need a Request!\n";
    if ($LOGGING_LEVEL == LOG_ERRORS) {
		wlog("Got request without CMD! Referrer: ".$_SERVER["HTTP_REFERER"]);
	}
    exit;
}
header("Content-Type: application/json");
switch ($req["cmd"]) {
    case "delete":
        if (isset($req["id"]) AND is_numeric($req["id"])) {
            $res = $btpd->btpd_del_torrent($req["id"]);
            if ($res['code'] != 0) {
                echo json_encode(array(
                    "resp" => $btpd->get_btpd_error($res['code'])
                ));
                if ($LOGGING_LEVEL == LOG_ERRORS) {
					wlog($btpd->get_btpd_error($res['code']));
				}
                exit;
            }
            if ($LOGGING_LEVEL == LOG_ERRORS) {
				wlog($btpd->get_btpd_error($res['code']));
			}
            echo json_encode(array(
                "resp" => "ok"
            ));
        }
        exit;
        break;
    case "stop":
        if (isset($req["id"]) AND is_numeric($req["id"])) {
            $btpd->btpd_stop_torrent($req["id"]);
            echo json_encode(array(
                "resp" => "ok"
            ));
        }
        exit;
        break;
    case "start":
        if (isset($req["id"]) AND is_numeric($req["id"])) {
            $btpd->btpd_start_torrent($req["id"]);
            echo @json_encode(array(
                "resp" => "ok"
            ));
        }
        exit;
        break;
    case "list":
        $resp = $btpd->btpd_list_torrents();
        if ($resp["code"] == 0) {
            //$resp = array_map('utf8_encode', $resp);
            $json = json_encode(convertToJson($resp["result"]));
            header("Content-Length: " . strlen($json));
            die($json);
        }
        exit;
        break;
    case "space":
        $free  = disk_free_space($DATA_PATH);
        $total = disk_total_space($DATA_PATH);
        $used  = $total - $free;
        $usedp = ($free / $total) * 100;
        $json  = json_encode(array(
            "free" => $free,
            "total" => $total,
            "usedp" => $usedp,
            "used" => $used
        ));
        header("Content-Length: " . strlen($json));
        header("Content-Type: application/json");
        header("etag: " . md5($json));
        die($json);
        break;
    default:
        echo "Unknown cmd: " . print_r($req, true);
}
?> 
