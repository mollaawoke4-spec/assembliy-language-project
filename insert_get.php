<?php
include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $Username = $_GET['Username'];
    $password = $_GET['password'];

    $sql = "INSERT INTO login (Username, password) VALUES ('$Username', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Record inserted successfully using GET!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
