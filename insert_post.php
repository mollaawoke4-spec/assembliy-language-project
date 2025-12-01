<?php
include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $Username = $_POST['Username'];
    $password = $_POST['password'];

    $sql = "INSERT INTO login (Username, password) VALUES ('$Username', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Record inserted successfully using POST!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
