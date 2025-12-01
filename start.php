<?php
$servername = "localhost";
$username = "root"; // default WAMP username
$password = "";     // default WAMP password (empty)
//$dbname = "testdb";
$conn =mysqli_connect("localhost","root","","Student");
// Create connection
//$conn = new mysqli($servername, $username, $password);
//$n =mysqli_connect("localhost","root","");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo " Connected successfully"; 

/*$a = "INSERT INTO login VALUES ('B',24)";
$ins = mysqli_prepare($conn,$a );
if (mysqli_stmt_execute($ins)) {
        echo "New record created successfully!";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
/*if(!$ins)
    echo "not insertred ";
else 
    echo "Inserterd Successfully";
$sql_all = "SELECT * FROM Login";
$result_all = mysqli_query($conn, $sql_all);

if (mysqli_num_rows($result_all) > 0) {
    echo "<h2>All Users:</h2>";
    echo "<ul>";
    
    // LOOP through every row in the result set
    while($row = mysqli_fetch_assoc($result_all)) {
        echo "<li>Username: " . $row["Username"]. " - Password: " . $row["password"].  "</li>";
    }
    echo "</ul>";
} else {
    echo "0 results";
}*/
?>
