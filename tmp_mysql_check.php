<?php
$mysqli = new mysqli('localhost', 'openemr', 'openemr', 'openemr');
if ($mysqli->connect_error) {
    echo 'connect_error:' . $mysqli->connect_error . PHP_EOL;
    exit(1);
}
$res = $mysqli->query('SELECT 1');
var_dump($res->fetch_row());
$mysqli->close();
