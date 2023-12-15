import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Modal, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";

import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import NavLogo from "../images/microsoftLogo.svg";

const Home = () => {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  // for Log Out Process
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  // retreiving email from previous page

  const [user, loading] = useAuthState(auth);
  // console.log(user);

  // const location = useLocation();
  // const email = location.state.id;

  // retreiving data from email

  const [balance, setBalance] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState();
  const [userID, setUserID] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const [docId, setDocId] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    getData();
  }, [user, loading]);

  //Retrieving data from firebase 
  const getData = async () => {
    const imgId = user.email.substring(0, user.email.lastIndexOf("@"));
    const userFace = ref(storage, `facedata/${imgId}`);

    getDownloadURL(userFace).then((url) => {
      setImgURL(url);
    });

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", user?.email)
      );
      const txnQuery = query(
        collection(db, "transactions"),
        where("email", "==", user?.email)
      );
      const txnData = await getDocs(txnQuery);
      const data = await getDocs(q);

      txnData.forEach((doc) => {
        setTransaction(
          txnData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });

      // Setting data to states
      data.forEach((doc) => {
        setBalance(doc.data().balance);
        setFirstName(doc.data().firstName);
        setLastName(doc.data().lastName);
        setMobileNumber(doc.data().mobileNumber);
        setUserID(doc.data().id);
        setAccountNumber(doc.data().account_no);
        setDocId(doc.id);
        //console.log(doc.data());
      });
    } catch (err) {
      console.log({ error: true, msg: err.message });
    }
  };

  transaction.sort(function (a, b) {
    return new Date(a.dateTime) - new Date(b.dateTime);
  });

  // -----------Greeting----------
  const date = new Date();
  const hour = date.getHours();

  // style for buttons
  const cardStyle = {
    maxWidth: "20rem",
    minWidth: "20rem",
    minHeight: "6rem",
    maxHeight: "6rem",
  };

  //----------Profile page redirect----------

  const profile = () => {
    navigate("/Profile");
  };

  // ----------Deposit Modal states----------
  const [showReceipt, setShowReceipt] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [txnId, setTxnId] = useState(null);

  // closing txn receipt
  const handleReceiptClose = () => {
    setShowReceipt(false);
    setAmount(0);
  };

  //showing txn receipt
  const handleReceiptShow = () => {
    setShowReceipt(true);
  };

  // ----------Deposit Modal states----------
  const [show, setShow] = useState(false);

  // closing modal
  const handleClose = () => {
    setShow(false);
  };

  // opening modal
  const handleShow = () => {
    setShow(true);
  };

  //Deposit money states
  const [amount, setAmount] = useState(0);

  const dateTime = new Date().toISOString();

  // sending deposit money to firebase
  const handleDeposit = async () => {
    const txn_id = Math.random().toString(36).substring(2, 15);
    setTxnId(txn_id);
    // console.log("Transaction number: " + txn_id);
    const newTransaction = {
      amount,
      dateTime,
      email: user?.email,
      final_balance: amount + balance,
      pay_type: "load_money",
      desc: "Load Money Transaction",
      previous_balance: balance,
      txn_id: txn_id,
      txn_type: "credit",
    };
    setAmountError(false);

    if (amount === 0) {
      setAmountError(true);
      handleClose();
      handleReceiptShow();
    } else {
      try {
        const userRef = doc(db, "users", docId);
        await updateDoc(userRef, { balance: amount + balance });
        const res = await addDoc(
          collection(db, "transactions"),
          newTransaction
        );
        // console.log(res.id);
        getData();
        // add deposit money suceess message and close the modal.
        handleClose();
        handleReceiptShow();
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
          <div className="text-light ms-0 current_balance_nav">
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
            <ul className="navbar-nav d-flex flex-row">
              <div
                className="bg-dark text-light m-2"
                role="button"
                onClick={profile}
              >
                Profile
              </div>
              <div
                className="bg-dark text-light m-2"
                role="button"
                onClick={handleLogout}
              >
                Logout
              </div>
            </ul>
          </div>
        </div>
      </nav>
     

      {/* ----------Dashbord---------- */}
      <div className="d-flex align-items-center">
        <div className="m-auto mt-0 w-100">
          <div className="card mt-4 special_card ms-3 me-3 shadow-lg">
            <div className="card-body">
              <div className="d-flex mb-3 flex-column justify-content-center">
                <div className="p-2 m-auto mt-4">
                  <img src={imgURL} className="user_image" alt="..." />
                </div>
                <div className="m-auto text-dark align-middle fs-2">
                  {hour >= 12 ? (
                    hour >= 16 ? (
                      <span className="fw-nomal">Good Evening, </span>
                    ) : (
                      <span className="fw-normal">Good Afternoon, </span>
                    )
                  ) : (
                    <span className="fw-normal">Good Morning, </span>
                  )}

                  <span className="fw-bold"> {firstName} </span>
                </div>
              </div>

              <div className="row d-flex justify-content-center">
                <div className="p-0 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
                  <div className="card border border-2 border-dark w-100 m-4 shadow-lg customer_id_card">
                    <div className="card-body text-center">
                      <h5 className="card-title">Customer ID</h5>
                      <div className="fw-bold">
                        <strong> {userID}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-0 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
                  <div className="card border border-2 border-dark w-100 m-4 shadow-lg account_no_card">
                    <div className="card-body text-center">
                      <h5 className="card-title">Account Number</h5>
                      <div className="fw-bold">
                        <strong> {accountNumber} </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-0 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
                  <div className="card border border-2 border-dark w-100 m-4 shadow-lg current_balance_card">
                    <div className="card-body text-center">
                      <h5 className="card-title">Current Balance</h5>
                      <div className="fw-bold">
                        <strong>
                          {" "}
                          <NumberFormat
                            thousandSeparator={true}
                            thousandsGroupStyle="lakh"
                            prefix={" ₹ "}
                            displayType={"text"}
                            value={balance}
                          />
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

              <div className="p-0 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
                <div className="card border border-2 border-dark w-100 m-4 shadow-lg last_txn_card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Last Transaction</h5>
                    <div className="fw-bold">
                    <strong> 
                      {transaction.length > 0 ? 
                      <NumberFormat 
                      thousandSeparator={true} 
                      thousandsGroupStyle="lakh" 
                      prefix={' ₹ '} 
                      displayType={'text'}
                      value={transaction[transaction.length -1].amount} 
                    />
                     : 
                    "Not Available"
                    }
                    </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        <div className="d-flex flex-md-row mb-3 flex-column justify-content-center">
            <div className="p-2 d-flex justify-content-center">
              <div className="card text-white bg-dark m-3" style={cardStyle}>
                <button className="card-body text-center" onClick={handleShow}>
                  <h5 className="card-title">
                    <strong>Deposit</strong>
                  </h5>
                </button>
              </div>
            </div>

            <Link className="text-decoration-none" to="/Payment">
              <div className="p-2 d-flex justify-content-center">
                <div className="card text-white bg-dark m-3" style={cardStyle}>
                  <button className="card-body text-center">
                    <h5 className="card-title">
                      <strong>Send Money</strong>
                    </h5>
                  </button>
                </div>
              </div>
            </Link>
          </div>

          <div className="d-flex flex-md-row mb-3 flex-column justify-content-center">
            <Link className="text-decoration-none" to="/Profile">
              <div className="p-2 d-flex justify-content-center">
                <div className="card text-white bg-dark m-3" style={cardStyle}>
                  <button className="card-body text-center">
                    <h5 className="card-title">
                      <strong>Update Profile</strong>
                    </h5>
                  </button>
                </div>
              </div>
            </Link>

            <Link className="text-decoration-none" to="/TransactionHistory">
              <div className="p-2 d-flex justify-content-center">
                <div className="card text-white bg-dark m-3" style={cardStyle}>
                  <button className="card-body text-center">
                    <h5 className="card-title">
                      <strong>Transaction History</strong>
                    </h5>
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>

      

        {/* ----------Deposit Money Modal---------- */}
        <Modal
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
          dialogClassName="modal-60h">

          <Modal.Header closeButton>
            <Modal.Title>
              <p className="text-center">Deposit Money</p>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h5 className="">Enter Amount</h5>
            <NumberFormat
              thousandsGroupStyle="thousand"
              prefix="₹ "
              decimalSeparator="."
              displayType="input"
              type="text"
              thousandSeparator={true}
              allowNegative={false}
              allowEmptyFormatting={false}
              className="border-dark border-1 p-2 w-100"
              onChange={(e) => {
                setAmount(parseFloat(e.target.value.replace(/[,₹]/g, "")));
              }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button className="btn deposit_button" onClick={handleDeposit}>
              Deposit
            </Button>
            <Button className="btn cancel_button" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        

        {/* ----------Transaction info Modal---------- */}
        <Modal
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showReceipt}
          onHide={handleReceiptClose}
          dialogClassName="modal-60h"
        >
          <Modal.Header>
            <Modal.Title>
              <p className="text-center">Deposit Transaction</p>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {amountError ? (
              <Alert variant="danger">Amount cannot be zero</Alert>
            ) : (
              <Alert variant="success">
                <center>
                  <div>Transaction Successful!</div>
                  <br />
                  Transaction Amount:
                  <NumberFormat
                    thousandSeparator={true}
                    thousandsGroupStyle="lakh"
                    prefix={" ₹ "}
                    displayType={"text"}
                    value={amount}
                  />
                  <div>Transaction id: {txnId}</div>
                </center>
              </Alert>
            )}
          </Modal.Body>

          <Modal.Footer className="text-center">
            <Button
              className="btn btn-success w-100"
              onClick={handleReceiptClose}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
