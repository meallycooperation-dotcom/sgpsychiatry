<?php
$pdo = new PDO('mysql:host=localhost;dbname=openemr;charset=utf8mb4','openemr','openemr');
$stmt = $pdo->prepare("SELECT id, username, fname, lname, active, pwd FROM users WHERE username=? OR username=? LIMIT 10");
$stmt->execute(['BrianOchieng2','bochieng442@gmail.com']);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (!$rows) {
    echo "NO_ROWS\n";
} else {
    foreach ($rows as $row) {
        echo json_encode($row) . PHP_EOL;
    }
}
