import React, { useRef, useState, useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import '@tensorflow/tfjs-backend-webgl';

import * as fp from "fingerpose";
import thumbs_up from "./thumbs_up.png";
import victory from "./victory.png";
import { useNavigate } from "react-router-dom";
import {collection,doc, updateDoc,addDoc} from "firebase/firestore";

import { db} from "../firebase";
import { max } from "@tensorflow/tfjs";


function GestureAuth(props) {

 // assigning data received from payment page 
 const senderEmail = props.senderEmail;
 const receiverEmail = props.receiverEmail;
 const amount = props.amount;
 const senderBalance = props.senderBalance;
 const senderDocId = props.senderDocId;
 const paymentMode = props.paymentMode;
 const receiverBalance = props.receiverBalance;
 const receiverDocId =  props.receiverDocId;
 const dateTime = new Date().toISOString();
 const txn_id =  Math.random().toString(36).substring(2, 15);
 const thresoldConfidence = 9.50;
 

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  //sates for process and emoji
  const [emoji, setEmoji] = useState(null);
  const images = { thumbs_up: thumbs_up, victory: victory };
  const [StateOfProcess, setStateOfProcess] = useState("");

  // detect hands pose
  const runHandpose = async () => {
    const net = await handpose.load();

    //  Loop and detect hands

    var detectInterval =  setInterval(() => {
      detect(net);
    }, 10);


    const detect = async (net) => {
      // Check data is available
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
  
        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
  
        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        // Make Detections
        const hand = await net.estimateHands(video);
        //console.log(hand);
  
        // ADDED GESTURE HANDLING
  
        if (hand.length > 0) {
          const GE = new fp.GestureEstimator([
            fp.Gestures.ThumbsUpGesture,
            fp.Gestures.VictoryGesture
            
          ]);
          
          

          const gesture = await GE.estimate(hand[0].landmarks, 4);
          //console.log(hand[0].landmarks);
          if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
             //console.log(gesture.gestures);
            
            const confidence = gesture.gestures.map(
              (prediction) => prediction.score
            );
            // console.log(confidence);
            
            const maxConfidenceAt = confidence.indexOf(
              Math.max.apply(null, confidence)
              
            );
            
            
            const maxConfidence = Math.max(...confidence);
            // console.log(maxConfidence);
            const gesture_name = gesture.gestures[maxConfidenceAt].name;

            if(maxConfidence >= thresoldConfidence)
            {   
              setEmoji(gesture.gestures[maxConfidenceAt].name);
              // console.log(gesture_name);
  
              if(gesture_name === "thumbs_up"){
                clearInterval(detectInterval);
                setStateOfProcess("Success");
                const newTransactionCredit = {
                  amount,
                  dateTime,
                  email : receiverEmail,
                  final_balance: receiverBalance + amount,
                  pay_type : paymentMode,
                  desc : paymentMode + " FROM " + senderEmail,
                  previous_balance: receiverBalance,
                  txn_id,
                  txn_type : "credit"
              }
              const newTransactionDebit = {
                amount,
                dateTime,
                email : senderEmail,
                final_balance: senderBalance - amount,
                pay_type : paymentMode,
                desc : paymentMode + " TO " + receiverEmail,
                previous_balance: senderBalance,
                txn_id,
                txn_type : "debit"
            }
  
  
              
  
     try {
      
      const senderRef = doc(db,"users",senderDocId);
      await updateDoc(senderRef,  {balance: senderBalance - amount} );
      await addDoc(collection(db, "transactions"), newTransactionDebit);
      
      const receiverRef = doc(db,"users",receiverDocId);
      await updateDoc(receiverRef,  {balance: receiverBalance + amount} );
      await addDoc(collection(db, "transactions"), newTransactionCredit);
      
      
      //Sending data to receipt page
      navigate("/Receipt", {state: 
        {txnId : txn_id,
        txnType : paymentMode,
        amount : amount,
        receiverEmail : receiverEmail,
        dateTime : dateTime 
      
        }
        });
      
      } catch (err) {
        console.log({error:true, msg : err.message});
      }
  
      
  
    }else
      { 
                  
        if(gesture_name === "victory"){
          console.log("i m here");
        props.handleCloseFirst();
        props.handleCloseSecond();}
      }
              
    }
  }
}
  
        
   
        
      }
      
    };

  };

  

  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{runHandpose()},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam 
          audio={false}
          ref={webcamRef}
          className="webcam webcam_video_size"
        />

      <div>
        <div className="form-group mt-2 mb-2">
          <h5>{StateOfProcess}</h5>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          textAlign: "center",
        }}
      />
        
      {emoji !== null ? (
      <img alt=""
        src={images[emoji]}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 400,
            bottom: 500,
            right: 0,
            textAlign: "center",
            height: 100,
          }}
      />
      ) : (
          ""
        )}

      </header>
    </div>
  );
}

export default GestureAuth;