import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import NumberFormat from "react-number-format";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import FaceAuth from "./FaceAuth";
import GestureAuth from "./GestureAuth";
import FingerAuth from "./FingerAuth";

import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "../App.css";
import NavLogo from "../images/microsoftLogo.svg";

const Payment = () => {
  const { logOut, userLogout } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  // retreiving data from Firestore
  const [user, loading] = useAuthState(auth);

  const [balance, setBalance] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [docId, setDocId] = useState("");

  const email = user?.email;
  const getData = async () => {
    try {
      const query_sender_email = query(
        collection(db, "users"),
        where("email", "==", email)
      );

      const sender_data = await getDocs(query_sender_email);
      sender_data.forEach((doc) => {
        setBalance(doc.data().balance);
        setFirstName(doc.data().firstName);
        setDocId(doc.id);
      });
    } catch (err) {
      console.log({ error: true, msg: err.message });
    }
  };

  // call getData everytime user or loading is changed
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  // -----------Greeting----------
  const date = new Date();
  const hour = date.getHours();

  //Spinner states
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);

  //Verify states
  const [verify, setVerify] = useState(false);
  const [modalOneCloseButton, setModalOneCloseButton] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [payNow, setPayNow] = useState(true);
  const [paymentMode, setPaymentMode] = useState("");

  //Recivers data
  const [receiverFirstName, setReceiverFirstName] = useState("");
  const [receiverLastName, setReceiverLastName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverBalance, setReceiverBalance] = useState(0);
  const [receiverDocId, setReceiverDocId] = useState("");

  // ----------Modal states----------
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  // to disable modal close button in modal footer
  function disableModalCloseButton() {
    setModalOneCloseButton(true);
  }

  // to enable modal close button in modal footer
  function enableModalCloseButton() {
    setModalOneCloseButton(false);
  }
  
// to close first modal
  function handleCloseFirst() {
    setShowFirstModal(false);
    setLoadingFirst(false);
  }
// to show first modal
  function handleShowFirst() {
    setShowFirstModal(true);
    setLoadingFirst(true);
  }

// to close second modal
  function handleCloseSecond() {
    setShowSecondModal(false);
    setLoadingSecond(false);
    setLoadingFirst(false);
  }

  // to show second modal
  function handleShowSecond() {
    setShowSecondModal(true);
    setShowFirstModal(false);
    setModalOneCloseButton(false);
  }

  // function to clear all the fields on the payment page
  function clearField() {
    setReceiverEmail("");
    setPaymentMode("");
    setAmount("");
    setError("Payment Canceled");
    setShowSecondModal(false);
    setShowFirstModal(false);
    setLoadingSecond(false);
    setLoadingFirst(false);
  }

  // validation checks to ascertain Payment Type 
  function handlePayNow() {

    if (balance < parseFloat(amount.replace(/[,₹]/g, ""))) {
      setError("Insufficient Balance");
    } else if (
      parseFloat(amount.replace(/[,₹]/g, "")) >= 200000 &&
      paymentMode === "IMPS"
    ) {
      setError("Please select RTGS for payment above 200k");
    } else if (
      parseFloat(amount.replace(/[,₹]/g, "")) >= 200000 &&
      paymentMode === "NEFT"
    ) {
      setError("Please select RTGS for payment above 200k");
    } else if (parseFloat(amount.replace(/[,₹]/g, "")) === 0) {
      setError("Amount cannot be zero");
    } else if (
      parseFloat(amount.replace(/[,₹]/g, "")) < 200000 &&
      paymentMode === "RTGS"
    ) {
      setError("Please select IMPS or NEFT for payment below 200k");
    } else if (paymentMode === "") {
      setError("Please select payment mode");
    } else if (balance >= parseFloat(amount.replace(/[,₹]/g, ""))) {
      handleShowFirst();
    }
  }

  // check if user is not sending to himself only
  const handleVerify = async () => {
    if (user.email === receiverEmail) {
      setError("Transfer to Same Account not allowed.");
    } else {
      try {
        // get data of email ID entered by user to send money
        const q = query(
          collection(db, "users"),
          where("email", "==", receiverEmail)
        );

        const data = await getDocs(q);

        if (data.docs.length > 0) {
          data.forEach((doc) => {
            setVerify(true);
            setReceiverFirstName(doc.data().firstName);
            setReceiverLastName(doc.data().lastName);
            setReceiverBalance(doc.data().balance);
            setReceiverDocId(doc.id);
          });
        } else {
          setError("User Not Found");
        }
      } catch (err) {
        console.log({ error: true, msg: err.message });
      }
    }
  };

  return (
    <div>
      {/* ----------Navbar---------- */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <img src={NavLogo} className="rounded nav_logo me-1" />
            MS Bank
          </Link>
          <div className="text-light">
            Current Balance:
            <NumberFormat
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              prefix={" ₹ "}
              displayType={"text"}
              value={balance}
            />
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <span className="fw-bold text-light align-middle">
                  {hour >= 12 ? (
                    hour >= 16 ? (
                      <span className="fw-nomal">Good Evening, </span>
                    ) : (
                      <span className="fw-normal">Good Afternoon, </span>
                    )
                  ) : (
                    <span className="fw-normal">Good Morning, </span>
                  )}
                </span>

                <button
                  className="fw-bold active btn btn-light"
                  id="user_profile_logout"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {firstName}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end bg-dark"
                  aria-labelledby="user_profile_logout"
                >
                  <li>
                    <Link className="text-decoration-none" to="/Home">
                      <button className="dropdown-item bg-dark text-light">
                        Home
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link className="text-decoration-none" to="/Profile">
                      <button className="dropdown-item bg-dark text-light">
                        Profile
                      </button>
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item bg-dark text-light"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* ----------Navbar---------- */}

      {/* ----------Dashbord---------- */}

      <section className="vh-100 payment_background">
        <div className="container h-100 ">
          <div className="row justify-content-end align-items-centre h-100 bg-image">
            <div className="col-md-auto d-flex justify-content-center align-items-center">
              <div className="card rounded-1 shadow">
                <div className="card-body p-5 m-4 text-center d-flex flex-column float-left">
                  {error && <Alert variant="danger">{error}</Alert>}

                  <div>
                    <h3 className="float-left fw-bold fs-3">Make Payment</h3>
                  </div>

                  <div>
                    <div className="">
                      <div className="d-flex float-left fw-bold">
                        <label className="form-label pt-4">Email address</label>
                      </div>
                      <Form.Group controlId="formBasicEmail" className="">
                        <Form.Control
                          className="border-dark border-1 shadow-none p-2"
                          type="email"
                          placeholder="for testing use - guptahemant65@gmail.com"
                          onChange={(e) => {
                            setReceiverEmail(e.target.value);
                            setVerify(false);
                            setError("");
                          }}
                        />

                        {verify ? (
                          <button className="btn btn-success mt-2 disabled">
                            {" "}
                            Name :
                            {" " +
                              receiverFirstName +
                              " " +
                              receiverLastName}{" "}
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning mt-2"
                            onClick={handleVerify}
                          >
                            Verify{" "}
                          </button>
                        )}
                      </Form.Group>
                    </div>

                    <div className="">
                      <div className="d-flex float-left fw-bold">
                        <label className="form-label pt-4">Amount</label>
                      </div>
                      <Form.Group controlId="formBasicAmount">
                        {/* <Form.Control
                                  type="number"
                                  className="border-dark border-1 p-2 input_arrow_remove"
                                /> */}
                        <NumberFormat
                          thousandsGroupStyle="thousand"
                          prefix="₹ "
                          decimalSeparator="."
                          displayType="input"
                          type="text"
                          thousandSeparator={true}
                          allowNegative={false}
                          className=" border-1 rounded p-2 w-100 shadow-none"
                          onChange={(e) => {
                            setAmount(e.target.value);
                            setError("");
                          }}
                        />
                      </Form.Group>
                    </div>
                    
                    {/* Amount in XRP */}
                    <div className="pt-4" disabled>
                      <input className="border-1 rounded p-2 w-100 shadow-none" type="text" disabled></input>
                    </div>

                    <div className="container">
                      <div className="row mt-3">
                        <label className="form-label fw-bold">
                          Payment Method
                        </label>

                        {/* <div className="col">
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" id="inlineRadio2" name="paymentMethod" value="IMPS"
                              onChange={(e) => {setPaymentMode(e.target.value); setError("")}}
                              />
                              <label className="form-check-label" htmlFor="inlineRadio2">IMPS</label>
                            </div>
                            </div>
                              
                            <div className="col">
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" id="inlineRadio2" name="paymentMethod" value="NEFT"
                              onChange={(e) => {setPaymentMode(e.target.value); setError("")}}
                              />
                              <label className="form-check-label" htmlFor="inlineRadio2">NEFT</label>
                            </div>
                            </div>
                              
                            <div className="col">
                            <div className="form-check form-check-inline" >
                              <input className="form-check-input" type="radio" id="inlineRadio3" name="paymentMethod" value="RTGS"
                              onChange={(e) => {setPaymentMode(e.target.value); setError("")}}
                              />
                              <label className="form-check-label" htmlFor="inlineRadio3">RTGS</label>
                          </div>
                          </div> */}

                        <div
                          className="btn-group "
                          role="group"
                          aria-label="Basic radio toggle button group"
                        >
                          <input
                            type="radio"
                            className="btn-check"
                            name="paymentMethod"
                            id="btnradio1"
                            value="IMPS"
                            onChange={(e) => {
                              setPaymentMode(e.target.value);
                              setError("");
                            }}
                          />
                          <label
                            className="btn btn-outline-dark"
                            htmlFor="btnradio1"
                          >
                            IMPS
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="paymentMethod"
                            id="btnradio2"
                            value="NEFT"
                            onChange={(e) => {
                              setPaymentMode(e.target.value);
                              setError("");
                            }}
                          />
                          <label
                            className="btn btn-outline-dark"
                            htmlFor="btnradio2"
                          >
                            NEFT
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="paymentMethod"
                            id="btnradio3"
                            value="RTGS"
                            onChange={(e) => {
                              setPaymentMode(e.target.value);
                              setError("");
                            }}
                          />
                          <label
                            className="btn btn-outline-dark"
                            htmlFor="btnradio3"
                          >
                            RTGS
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* ----------First Modal trigger button---------- */}
                    <div className="d-flex flex-column mt-4">
                      <div>
                        {loadingFirst ? (
                          <Spinner animation="border" />
                        ) : verify ? (
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            onClick={handlePayNow}
                          >
                            Pay Now{" "}
                          </button>
                        ) : (
                          <button className="btn btn-dark btn-lg btn-block disabled">
                            Pay Now{" "}
                          </button>
                        )}
                      </div>
                    </div>
                    {/* ----------First Modal trigger button---------- */}

                    <span className="d-none d-md-block d-lg-block d-xl-block">
                      __________________________________________________
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------Dashbord---------- */}
      {/* ----------First Modal---------- */}
      <Modal
        size="lg"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showFirstModal}
        onHide={handleCloseFirst}
      >
        <Modal.Header>
          <Modal.Title>Scan Your Face</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FaceAuth
            disableModalCloseButton={disableModalCloseButton}
            enableModalCloseButton={enableModalCloseButton}
            amount={amount}
            email={email}
            handleCloseFirst={handleCloseFirst}
            handleShowSecond={handleShowSecond}
          />
        </Modal.Body>
        <Modal.Footer>
          {modalOneCloseButton ? (
            <Button className="btn btn-dark" disabled>
              Close
            </Button>
          ) : (
            <Button className="btn btn-dark" onClick={handleCloseFirst}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* ----------First Modal---------- */}

      {/* ----------Second Modal---------- */}
      <Modal
        size="lg"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showSecondModal}
        onHide={handleCloseSecond}
      >
        <Modal.Header>
          <Modal.Title>
            {parseFloat(amount.replace(/[,₹]/g, "")) > 10000
              ? "Finger Auth"
              : "Gesture Auth"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="m-auto">
          {" "}
          {parseFloat(amount.replace(/[,₹]/g, "")) > 10000 ? (
            <FingerAuth
              clearField={clearField}
              amount={parseInt(amount.replace(/[,₹]/g, ""))}
              senderEmail={email}
              receiverEmail={receiverEmail}
              senderBalance={balance}
              senderDocId={docId}
              paymentMode={paymentMode}
              receiverDocId={receiverDocId}
              receiverBalance={receiverBalance}
            />
          ) : (
            <GestureAuth
              handleCloseFirst={handleCloseFirst}
              handleCloseSecond={handleCloseSecond}
              clearField={clearField}
              amount={parseInt(amount.replace(/[,₹]/g, ""))}
              senderEmail={email}
              receiverEmail={receiverEmail}
              senderBalance={balance}
              senderDocId={docId}
              paymentMode={paymentMode}
              receiverDocId={receiverDocId}
              receiverBalance={receiverBalance}
            />
          )}
        </Modal.Body>

        <Modal.Footer className="row justify-content-center text-center fw-bold">
          {parseFloat(amount.replace(/[,₹]/g, "")) <= 10000 ? (
            <div>
              Thumbs Up to pay or Make Victory sign with your hands to cancel
              the transaction
            </div>
          ) : (
            <div>Create the number given above with your hand</div>
          )}
        </Modal.Footer>
      </Modal>
      {/* ----------Second Modal---------- */}
    </div>
  );
};

export default Payment;
