<?php
require_once ("../SimpleTest/autorun.php");
class libraryTestSuite extends TestSuite {
	function __construct() {
		parent::__construct ();
		include ('../app/index.php');
		$this->addFile( "UnitTestCase1.php" );
//		$this->addFile( "UnitTestCase2.php" );
	}
}

?>
