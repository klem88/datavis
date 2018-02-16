<?php
/**
 * @author Clement
 * Test case Class - Test the Create and Update functions
 */


require_once('../simpletest/autorun.php');
class  testValidationClass extends UnitTestCase {
	private $validation1;
	
	public function SetUp(){
		require_once ('../app/models/Validation.php');
		$this->validation1 = new validation();
	}
	
	/**
	 * Test to check if a valid email is returned valid.
	 * @param is a valid email
	 * @return true
	 */
	public  function  testIsEmailValid () {
		$this->assertTrue($this->validation1->isEmailValid("clem@mail.ie"));	
	}
	
	/**
	 * Test to check if a wrong email is not valid.
	 * @param is a unvalid email
	 * @return false
	 */
	public  function  testIsEmailNotValid () {
		$this->assertFalse($this->validation1->isEmailValid("clemmail.ie"));	
	}
	
	/**
	 * Test to check if the number is in a valid range.
	 * @param are three numeric and respect the rigth range
	 * @return true
	 */
	public  function  TestIsNumberInRangeValid () {
		$this->assertTrue($this->validation1->isNumberInRangeValid(12,8,20));	
	}
	
	/**
	 * Test to check if the number is in a unvalid range.
	 * @param are three numeric but do not respect the rigth range
	 * @return false
	 */
	public  function  TestIsNumberInRangeNotValid () {
		$this->assertFalse($this->validation1->isNumberInRangeValid(6,8,20));	
	}
	
	/**
	 * Test to check if the input values are not numeric.
	 * @param are two numeric and one string
	 * @return false
	 */
	public  function  TestIsNotaNumber () {
		$this->assertFalse($this->validation1->isNumberInRangeValid('a',8,20));	
	}
	
	/**
	 * Test to check if the string length is below the number.
	 */
	public  function  TestIsLengthStringValid () {
		$this->assertTrue($this->validation1->isLengthStringValid("clem", 10));
	}
	
	/**
	 * Test to check if the string length is above the number.
	 */
	public  function  TestIsLengthStringNotValid () {
		$this->assertFalse($this->validation1->isLengthStringValid("clem", 2));
	}
	
	/**
	 * Test to check if the string is not a string but a number instead.
	 */
	public  function  TestIsLengthStringNotString () {
		$this->assertFalse($this->validation1->isLengthStringValid(2, 2));
	}
	
	/**
	 * Test to check if the string is not a string but a number instead.
	 */
	public  function  TestIsLengthaString () {
		$this->assertFalse($this->validation1->isLengthStringValid("clem", "clem"));
	}
	
	public function tearDown(){
		$this->validation1 = NULL;
	}
}


