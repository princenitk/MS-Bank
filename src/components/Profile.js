import React, { useEffect, useState} from "react";
import NumberFormat from "react-number-format";
import { Link, useNavigate} from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, query, where,getDocs,deleteDoc,doc,updateDoc  } from "firebase/firestore";
import { getAuth, deleteUser} from "firebase/auth";
import { storage,auth} from "../firebase";
import {  ref, deleteObject ,getDownloadURL} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { db} from "../firebase";


import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import '../App.css'
import userImage from '../images/User.svg'
import NavLogo from "../images/microsoftLogo.svg";
import EditLogo from "../images/Edit.svg";
import { FaEdit } from "react-icons/fa";




function Profile() {

    const { logOut } = useUserAuth();
    const navigate = useNavigate();

    //Logout handler
    const handleLogout = async () => {
      try {
        await logOut();
        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    };


    const [user, loading] = useAuthState(auth);
  
    // -----------Greeting----------
    const date = new Date();
    const hour = date.getHours();

    //----------Update Mobile no----------
   
    const [editMode, setEditMode] = useState(false);
    const [updatedMobileNumber, setUpdatedMobileNumber] = useState("");
    const [newNumber, setNewNumber] = useState("");

    //Storing user data
    const [balance, setBalance] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState();
    const [userID, setUserID] = useState();
    const [accountNumber, setAccountNumber] = useState();
    const [docId,setDocId] = useState("");
    const [imgURL, setImgURL] = useState("");
    const email = user?.email;

    //Getting user data from firebase
    const getData = async () => {

      // console.log(user.email);
      const imgId = user.email.substring(0, user.email.lastIndexOf("@"));

      const userFace = ref(storage, `facedata/${imgId}`);

      getDownloadURL(userFace).then((url) => {
      setImgURL(url); 
      })
      
       try {      
   
       const q = query(collection(db, "users"), where("email", "==", email));
   
        const data =  await getDocs(q);
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
        
         console.log({error:true, msg : err.message});
       }
     };

    
    useEffect(()=> {
      if (loading) return;
      if (!user) return navigate("/");
        getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      } ,[user,loading])

    // Enabling input box for entering new mobile number
    const handleEdit = () => {
      setEditMode(true);

    }

    // Updating user mobile number
    const updateNumber = async() => {
    
      try {
        
        const userRef = doc(db,"users",docId);
        
        await updateDoc(userRef, {mobileNumber: newNumber});
        getData();
       
      } catch (err) {
        
        console.log({error:true, msg : err.message});
      }


      // console.log("Number updated: ");
      setEditMode(false);
    }   
      
     // retreiving data from Firestore
     

    

    /*function handleDelete() {

    try {
      
      const deleteUserData = async() => { 
         const userRef = doc(db,"users",docId);
      await deleteDoc(userRef);
    }

      deleteUserData();  
  
  } catch (err) {
    console.log({error:true, msg : err.message});
  }

 //  ---------------------------------------------------------
// Code For deleting User Image Data from firebase database
// -----------------------------------------------------------

  //const imgId = email.substring(0, email.lastIndexOf("@"));

  //const userFace = ref(storage,`facedata/${imgId}`);

// Delete the file
/*deleteObject(userFace).then(() => {
  // File deleted successfully
}).catch((error) => {
  console.log(error);
}); 

deleteUser(user).then(() => {
  // User deleted.
  console.log("User deleted");
}).catch((error) => {
  // An error ocurred
  console.log(error);
});


    }; */
  

  return (
    <div>
         {/* ----------Navbar---------- */}
      <nav className="navbar navbar-expand-lg mb-5 navbar-dark bg-dark shadow">
        <div className="container-fluid">

          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <img src={NavLogo} className="rounded nav_logo me-1"/>
            MS Bank</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
            <ul className="navbar-nav">

              <li className="nav-item dropdown ml-auto">
                <span className="fw-bold ml-auto text-light align-middle">
                {hour>=12 ? hour>=16? <span className="fw-nomal">Good Evening, </span>: <span className="fw-normal">Good Afternoon, </span>: <span className="fw-normal">Good Morning, </span>}
                </span>
              
                <span className="fw-bold active ml-auto btn btn-light" id="user_profile_logout" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {firstName}
                </span>
                
                <ul className="dropdown-menu dropdown-menu-end bg-dark" aria-labelledby="user_profile_logout">
                  <li><Link className="text-decoration-none" to="/Home"><button className="dropdown-item bg-dark text-light">Home</button></Link></li>

                  <li><button className="dropdown-item bg-dark text-light" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>

            </ul>
          </div>
        </div>
      </nav>
      



       {/* ----------Profile Card----------  */}
    
      <section className="profile_background">
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-md-auto vh-100 d-flex align-items-center">
              <div className="card profile_card shadow align-items-center">       
                <div className="card-body pl-4 pr-4 m-2 mt-2 pt-2 text-center d-flex flex-column float-left fs-4 gap-2 ">

                  <div className="mt-2 mb-2 pt-2 pb-2 profile_card_header">
                    <img src={imgURL} className="rounded mx-auto user_image " alt="..."/>
                    <div className="p-2 fw-bold text-center">
                      {firstName + " "+  lastName}
                    </div>
                  </div>

                  <div className="border-2 shadow p-3 profile_card_elements text-start text-wrap">
                    Email : {email}
                  </div>

                  <div className="border-2 shadow p-3 profile_card_elements text-start">
                    Account Number : {accountNumber}
                  </div>

                  <div className="border-2 shadow p-3 profile_card_elements text-start">
                    Customer ID : {userID}
                  </div>

                                
                  <div className="border-2 shadow p-3 profile_card_elements text-start align-items-center">
                    {editMode ? 
                      <>
                        <div className="input-group align-items-center">
                          Mobile: 
                          <input type="number" className="form-control ms-1" aria-describedby="edit-mobile-number" onChange={(e) => {
                            setNewNumber(e.target.value);
                          }}/>
                          <div className="input-group-append">
                            <span className="input-group-text" role="button" id="edit-mobile-number" 
                            onClick={updateNumber} >Save</span>
                          </div>
                        </div>
                      </>
                      :
                      <> 
                        Mobile : 
                        <NumberFormat format=" +91 ##########" mask="_" displayType={'text'} value={mobileNumber}
                          onChange={(e) => {setUpdatedMobileNumber((e.target.value));}} />
                          <span className="float-end align-middle"><FaEdit role="button" onClick={handleEdit}/></span>
                      </>
                    }
                                  
                  </div>

                  <div className="float-left border-2 shadow p-3 profile_card_elements text-start">
                    Current Balance :  
                    <NumberFormat 
                      thousandSeparator={true} 
                      thousandsGroupStyle="lakh" 
                      prefix={' ₹ '} 
                      displayType={'text'}
                      value={balance} 
                    />
                  </div>

                  <span className="d-none d-md-block d-lgd-xl-block">__________________________________________________</span>
                  <div className="mt-2 fw-light">
                    <button className="btn btn-warning" onClick={handleEdit}>Update Number</button>
                  </div> 

                </div>
              </div>
            </div>
          </div>
        </div>
    </section>

  </div>
  )
}

export default Profile