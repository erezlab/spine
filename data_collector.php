<body>
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

$anon_id = $_POST["anon_id"];
$birthday = $_POST["birthday"];
$friend_count = $_POST["friend_count"];
$spine_count = $_POST["spine_count"];
$data = $_POST["anon_data"];

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
    echo "Thanks for sharing!";
} else {
    echo "Your data has already been recorded";
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>
</body>
