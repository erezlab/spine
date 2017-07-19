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
    $sucess = "Thanks for sharing!";
} else {
    $sucess = "Thanks for sharing!";
}

$conn->close();

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <link href="favicon.ico" rel="icon" type="image/x-icon" />

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>SPINE - An Aiden Lab Project</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/grayscale.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="http://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet"
          type="text/css">
    <link href="http://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>

    <![endif]-->

    <!-- Custom CSS -->
    <style>
        body {
            padding-top: 70px;
            /* Required padding for .navbar-fixed-top. Remove if using .navbar-static-top. Change if height of navigation changes. */
        }

        .background {
            fill: #eee;
        }

        line {
            stroke: #fff;
        }
    </style>

</head>

<body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">

<!-- Navigation -->
<nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse">
                <i class="fa fa-bars"></i>
            </button>
            <a class="navbar-brand page-scroll" href="#page-top">
                <i class="fa fa-play-circle"></i> <span class="light">Aiden</span> Lab
            </a>
        </div>


        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container -->
</nav>

<!-- Intro Header -->
<header class="intro">
    <div class="intro-body">
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <h1 class="brand-heading">SPINE</h1>
                    <p class="intro-text"><?php echo $sucess ?></p>
                </div>
            </div>
        </div>
    </div>
</header>


<!-- Footer -->
<footer>
    <div class="container text-center">
        <p>Copyright &copy; 2016 | SPINE | An Aiden Lab Project</p>
    </div>
</footer>

<!-- jQuery -->
<script src="js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/bootstrap.min.js"></script>

<!-- Plugin JavaScript -->
<script src="js/jquery.easing.min.js"></script>

<!--&lt;!&ndash; Google Maps API Key - Use your own API key to enable the map feature. More information on the Google Maps API can be found at https://developers.google.com/maps/ &ndash;&gt;-->
<!--<script type="text/javascript"-->
<!--src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCRngKslUGJTlibkQ3FkfTxj3Xss1UlZDA&sensor=false"></script>-->

<!-- Custom Theme JavaScript -->
<script src="js/grayscale.js"></script>

</body>

</html>

