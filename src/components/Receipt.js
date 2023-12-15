import React from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import NumberFormat from "react-number-format";
import Logo from "../images/microsoftLogo.svg";
import PaymentSuccessful from "../images/PaymentSuccessful.gif";


import "bootstrap/dist/css/bootstrap.min.css";
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js';
import '../App.css'

const Receipt = () => {
  
  const navigate = useNavigate();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const location = useLocation();
  const txnId = location.state.txnId;
  const txnType = location.state.txnType;
  const receiverEmail = location.state.receiverEmail;
  const amount = location.state.amount;
  const dateTime = location.state.dateTime;

  //Display time left for redirect in seconds
  const renderer = ({ seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return navigate("/home");
    } else {
      // Render a countdown
      return (
        <span>
          {seconds} 
        </span>
      );
    }
  };
      
  // -----------Greeting----------
  const date = new Date();
  const hour = date.getHours();


  return (
    <div>

      {/* ----------Dashbord---------- */}

      <div className="d-flex mt-5">
        <div className=" mx-auto">
          <img src={Logo} className="rounded mt-2 logo_image"/>
          <span className="fs-1 align-middle">MS BANK</span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <div className="shadow-lg mx-auto card_width card_height">
          <div className="card-body card_height">
            {/* Payment successful gif */}
            <img src={PaymentSuccessful} className="rounded mx-auto d-block user_image"/>
            <h3 className="text-center"> Payment Successful</h3>

            {/* Receipt info */}
            <table className="table mt-4 mb-4">
              <tbody className="text-center">
                
                <tr>
                  <th className="fw-bold" scope="row">Paid To</th>
                  <td>{receiverEmail}</td>
                </tr>

                <tr>
                  <th className="fw-bold" scope="row">Payment Type</th>
                  <td>{txnType}</td>
                </tr>

                <tr>
                  <th className="fw-bold" scope="row">Amount</th>
                  <td>
                  <NumberFormat 
                    thousandSeparator={true} 
                    thousandsGroupStyle="lakh" 
                    prefix={' ₹ '} 
                    displayType={'text'}
                    value={amount} 
                  />
                    </td>
                </tr>

                <tr>
                  <th className="fw-bold" scope="row">Date</th>
                  <td>{new Date(dateTime).toLocaleDateString('en-IN',options) + " " + new Date(dateTime).toLocaleTimeString('en-US')}</td>
                </tr>

                <tr>
                  <th className="fw-bold" scope="row">Transaction ID</th>
                  <td>{txnId}</td>
                </tr>

              </tbody>

            </table>

            
            <div className="text-center mt-2 fw-bold text-success">
              <span>Redirecting to home in {" "}
                <Countdown date={Date.now() + 5000} renderer={renderer} />
                  {" "}seconds
              </span>
            </div>     
          </div>
        </div>        
      </div>
    </div>
    
  );
};

export default Receipt;