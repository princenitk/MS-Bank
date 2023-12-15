import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import NumberFormat from "react-number-format";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "../App.css";
import NavLogo from "../images/microsoftLogo.svg";

const TransactionHistory = () => {
  const { logOut, userLogout } = useUserAuth();
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

  // retreiving data from Firestore
  const [user, loading] = useAuthState(auth);
  const [transaction, setTransaction] = useState([]);
  const [balance, setBalance] = useState();
  const [firstName, setFirstName] = useState();
  const email = user?.email;

  //Retrieving data from firebase
  const getData = async () => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("email", "==", email)
      );
      const balance_query = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const data = await getDocs(q);
      const balance_data = await getDocs(balance_query);

      balance_data.forEach((doc) => {
        setBalance(doc.data().balance);
        setFirstName(doc.data().firstName);
      });

      data.forEach((doc) => {
        // Retrieving txn history
        setTransaction(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    } catch (err) {
      console.log({ error: true, msg: err.message });
    }
  };
  // Sorting txn history
  transaction.sort(function (a, b) {
    return new Date(a.dateTime) - new Date(b.dateTime);
  });

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  // -----------Greeting----------
  const date = new Date();
  const hour = date.getHours();
  const options = { year: "numeric", month: "long", day: "numeric" };

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

      {/* ----------Txn table---------- */}
      <h3 className="text-center mt-4">Transaction History</h3>
      <div className="row d-flex justify-content-center vh-80">
        <div className="col-md-9 mt-5">
          <table className="table table-striped table-hover text-center">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Txn ID</th>
                <th scope="col">Date & Time</th>
                <th scope="col">Description</th>
                <th scope="col">Credit</th>
                <th scope="col">Debit</th>
                <th scope="col">Remaining Balance</th>
              </tr>
            </thead>

            <tbody>
              {transaction.map((doc, index) => {
                return (
                  <tr key={doc.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{doc.txn_id}</td>
                    <td>
                      {new Date(doc.dateTime).toLocaleDateString(
                        "en-IN",
                        options
                      ) +
                        " " +
                        new Date(doc.dateTime).toLocaleTimeString("en-US")}
                    </td>
                    <td>{doc.desc}</td>
                    <td className="text-success">
                      <NumberFormat
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        prefix={" ₹ "}
                        displayType={"text"}
                        value={doc.txn_type === "credit" && doc.amount}
                      />
                    </td>
                    <td className="text-danger">
                      <NumberFormat
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        prefix={" ₹ "}
                        displayType={"text"}
                        value={doc.txn_type === "debit" && doc.amount}
                      />
                    </td>
                    <td>
                      <NumberFormat
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        prefix={" ₹ "}
                        displayType={"text"}
                        value={doc.final_balance}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
