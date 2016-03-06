<body>
	HELLO PHP
<?php
$servername = "localhost";
$username = "root";
$password = "marie_napas";
$db = "spine";

// Create connection
$conn = new mysqli($servername, $username, $password,$db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

$anon_id = $_POST["anon_id"];
$birthday = $_POST["birthday"];
$friend_count = $_POST["friend_count"];
$spine_count = $_POST["spine_count"];
$data = $_POST["anon_data"];
echo $friend_count;
echo $spine_count;

$sql = "INSERT INTO people (anon_id, friend_count, spine_count, birthday, data)"
." VALUES ('"
.$anon_id
."', "
.$friend_count
.", "
.$spine_count
.", '"
.$birthday
."', '"
.$data
."')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>
</body>
