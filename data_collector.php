<body>
	HELLO PHP
<?php
echo "ECHO HELLO";
echo $_POST["anon_id"];
echo $_POST["birthday"];
echo $_POST["friend_count"];
echo $_POST["anon_data"];

$servername = "localhost";
$username = "root";
$password = "marie_napas";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

?>
</body>
