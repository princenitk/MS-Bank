import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Alert, Modal, Button, Spinner } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import UserDataService from "../services/user.services";
import FaceRegister from "./FaceRegister";
import validator from "validator";



import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import '../App.css' 
import NavLogo from "../images/microsoftLogo.svg";

//Validate mobile number
const validatePhoneNumber = (number) => {
  const isValidPhoneNumber = validator.isMobilePhone(number,'en-IN');
  // console.log("Phone Number Valid: " + isValidPhoneNumber);
  return (isValidPhoneNumber);
 }


const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] =useState("");
  const [message, setMessage] = useState({error : false, msg : ""});
  const password = "engage@1234";
  const balance = 10000;
  const { signUp } = useUserAuth();

 const id = "MSB" + Math.floor(100000 + Math.random() * 900000);
 const account_no = parseInt(Math.floor(10e10 + Math.random() * 900000000));

const dateCreated = new Date().toISOString();
const dateUpdated = new Date().toISOString();

  // Signup form submission handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    //Form is empty or not
    if(firstName === "" || lastName === "" || email === "" || mobileNumber === ""){
    
        setMessage({error : true, msg : "All fields are mandatory"});
        return;
    }

    //Given mobile number is validation
    if(!validatePhoneNumber(mobileNumber))
    {
      setMessage({error : true, msg : "Enter valid mobile number"});
      return;
    }

    
    setLoading(true);
    setMessage({error:false, msg:"Capture image to proceed further"});
      handleShow();
  };
  
    //Spinner states
    const [loading, setLoading] = useState(false); 

    // ----------Modal states----------
    const [show, setShow] = useState(false);
    const [modalCloseButton, setModalCloseButton] = useState(false);

    //close face capture modal
    function handleClose() {
      setShow(false);
      setLoading(false);
    };

    //open face capture modal
    const handleShow = () => setShow(true);

    //disable close button of face capture modal
    function disableModalCloseButton() {
      setModalCloseButton(true);
    }
  
    //enable close button of face capture modal
    function enableModalCloseButton() {
      setModalCloseButton(false);
    }


  return (
    <div>
      {/* Navbar start*/}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <Link className="navbar-brand d-flex align-items-center ms-1" to="/signup">
          <img src={NavLogo} className="rounded nav_logo"/>
          MS Bank</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-item nav-link me-2" to="/">Login</Link>
          </div>
        </div>
      </nav>
    

      {/* ----------Signup Card----------  */}
    
 <section className="vh-100 signup_background">
        <div className="container h-100 ">
            <div className="row justify-content-end align-items-centre h-100">

                <div className="col-md-auto d-flex justify-content-center align-items-center">
                    <div className="card rounded-1 shadow">
                        <div className="card-body m-auto text-center d-flex flex-column float-left m-5">
                
                            <div>
                            <h3 className="float-left fw-bold fs-3">Sign up to MS Bank</h3>
                            </div>
                    
                          
        {message?.msg && (<Alert variant={message?.error ? "danger" : "success"}
    dismissible 
    onClose={()=> {setMessage("")}}
    >
        {message?.msg}
    </Alert>
    )}


                            <Form onSubmit={handleSubmit} className="p-5 pt-2 m-auto">
                              <div className="" >
                                <div className="d-flex float-left fw-bold">
                                  <label className="form-label pt-2 ">First Name</label>
                                </div>
                                  
                                  <Form.Group controlId="formFirstName">
                                  <Form.Control
                                    className="border-dark border-1 p-2 form-control-lg"
                                    type="text" value = {firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                  />
                                </Form.Group>
                                
                              </div>

                              <div className="">
                                <div className="d-flex float-left fw-bold">
                                  <label className="form-label pt-4">Last Name</label>
                                  </div>

                                  <Form.Group controlId="formLastName">
                                  <Form.Control
                                    className="border-dark border-1 p-2 form-control-lg"
                                    type="text"
                                    value = {lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                  />
                                </Form.Group>
                              </div>

                              <div className="">
                                <div className="d-flex float-left fw-bold">
                                  <label className="form-label pt-4">Email address</label>
                                  </div>

                                  <Form.Group controlId="formBasicEmail">
                                  <Form.Control
                                    className="border-dark border-1 p-2 form-control-lg"
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </Form.Group>
                              </div>

                              <div className="">
                                <div className="d-flex float-left fw-bold">
                                  <label className="form-label pt-4">Mobile Number</label>
                                  </div>

                                  <Form.Group controlId="formBasicMobileNumber">
                                  <Form.Control
                                    className="border-dark border-1 p-2 form-control-lg"
                                    type="number"
                                    value = {mobileNumber}
                                    onChange= { 
                                      (e) => setMobileNumber(e.target.value)
                                  
                                    }
                                  />
                                </Form.Group>
                              </div>

                           
                            
                              <div className="d-flex flex-column mt-2"> 
                                <div> 
                                  {loading ? <Spinner animation="border" className="mt-2" /> : <button className="btn btn-dark btn-lg btn-block" type="submit">
                                    Sign up </button>} 
                                </div>
                              </div>

                              <span className="d-none d-md-block d-lg-block d-xl-block">__________________________________________________</span>
                              
                              <div className="mt-2">
                                Already have an account? <Link to="/">Log In</Link>
                              </div> 
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
 {/* ----------Signup Card----------  */}

{/* ----------Modal---------- */}
<Modal
    size="lg"
    backdrop="static"
    aria-labelledby="contained-modal-title-vcenter"
    centered show={show} onHide={handleClose}
  >

    <Modal.Header>
      <Modal.Title>
        <div className="text-center">
        <p className="text-center">Capture Image</p>
        </div>
        </Modal.Title>
    </Modal.Header>

    <Modal.Body>
    <FaceRegister email = {email} firstName = {firstName} lastName = {lastName}
    mobileNumber = {mobileNumber} disableModalCloseButton = {disableModalCloseButton} enableModalCloseButton = {enableModalCloseButton}
     />
    </Modal.Body>

    <Modal.Footer>
    {modalCloseButton ? 
          <Button className="btn btn-dark" disabled>
          Close
        </Button>
      :
      <Button className="btn btn-dark" onClick={handleClose}>
        Close
      </Button>
        }

    </Modal.Footer>

   
  </Modal>

    </div>
  );
};

export default Signup;