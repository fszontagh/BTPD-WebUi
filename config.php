<?php

$PATH      = "/var/lib/btpd"; // directory for the btpd daemon, where the 'sock' file is available
$DATA_PATH = "/data"; // the data directory, where the downloads will save
$WEBUI_ERROR_LOGS = str_replace("config.php","webui_log.log",__FILE__);
$LOGGING_LEVEL = LOG_ERRORS; // LOG_VERBOSE - for debugging, LOG_ERRORS - only log errors, LOG_SILENT - no logging
$DEFAULT_LANG = "en"; //the default language, if the borwser's language is not exists -- please see the lng folder for existen languages
$THEME  =  "white";
$CHROOT_TO_DATA_PATH = true;
?>
