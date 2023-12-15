import React, { useRef, useEffect, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import { collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  NumericOne,
  NumericTwo,
  NumericThree,
  NumericFour,
  NumericFive,
} from "./Numerics";
import * as fp from "fingerpose";
import one from "../images/one.png";
import two from "../images/two.png";
import three from "../images/three.png";
import four from "../images/four.png";
import five from "../images/five.png";
import Sign from "../images/Sign.svg";

function FingerAuth(props) {
  //images
  const [number, setNumber] = useState(null);
  const images = { 1: one, 2: two, 3: three, 4: four, 5: five };
  const [StateOfProcess, setStateOfProcess] = useState("");

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // assigning data received from payment page
  const senderEmail = props.senderEmail;
  const receiverEmail = props.receiverEmail;
  const amount = props.amount;
  const senderBalance = props.senderBalance;
  const senderDocId = props.senderDocId;
  const paymentMode = props.paymentMode;
  const receiverBalance = props.receiverBalance;
  const receiverDocId = props.receiverDocId;
  const dateTime = new Date().toISOString();
  const txn_id = Math.random().toString(36).substring(2, 15);

  // detect hands pose
  const runHandpose = async () => {
    const net = await handpose.load();
    //console.log("Handpose model loaded.");

    //Generating random number for user to show using hand
    const rand_num = Math.floor(Math.random() * 5) + 1;
    // console.log(rand_num);
    setNumber(rand_num);

    //  Loop and detect hands
    var detectInterval = setInterval(() => {
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
            NumericOne,
            NumericTwo,
            NumericThree,
            NumericFour,
            NumericFive,
          ]);
          const gesture = await GE.estimate(hand[0].landmarks, 4);
          //console.log(hand[0].landmarks);
          if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
            //console.log(gesture.gestures);

            const confidence = gesture.gestures.map(
              (prediction) => prediction.score
            );

            const maxConfidenceAt = confidence.indexOf(
              Math.max.apply(null, confidence)
            );

            //Minimum confidence to recognize number from hand
            const thresoldConfidence = 8.41;
            const maxConfidence = Math.max(...confidence);
            // console.log(maxConfidence);

            if (maxConfidence > thresoldConfidence) {
              const gesture_name = parseInt(
                gesture.gestures[maxConfidenceAt].name
              );

              // console.log(gesture_name);

              //balance debit or credit for txn
              if (gesture_name === rand_num) {
                clearInterval(detectInterval);
                setStateOfProcess("Success");
                const newTransactionCredit = {
                  amount,
                  dateTime,
                  email: receiverEmail,
                  final_balance: receiverBalance + amount,
                  pay_type: paymentMode,
                  desc: paymentMode + " FROM " + senderEmail,
                  previous_balance: receiverBalance,
                  txn_id,
                  txn_type: "credit",
                };
                const newTransactionDebit = {
                  amount,
                  dateTime,
                  email: senderEmail,
                  final_balance: senderBalance - amount,
                  pay_type: paymentMode,
                  desc: paymentMode + " TO " + receiverEmail,
                  previous_balance: senderBalance,
                  txn_id,
                  txn_type: "debit",
                };

                try {
                  const senderRef = doc(db, "users", senderDocId);
                  await updateDoc(senderRef, {
                    balance: senderBalance - amount,
                  });
                  await addDoc(
                    collection(db, "transactions"),
                    newTransactionDebit
                  );

                  const receiverRef = doc(db, "users", receiverDocId);
                  await updateDoc(receiverRef, {
                    balance: receiverBalance + amount,
                  });
                  await addDoc(
                    collection(db, "transactions"),
                    newTransactionCredit
                  );

                  //console.log("Transaction Successful");

                  //Payment successful redirect to receipt page
                  navigate("/Receipt", {
                    state: {
                      txnId: txn_id,
                      txnType: paymentMode,
                      amount: amount,
                      receiverEmail: receiverEmail,
                      dateTime: dateTime,
                    },
                  });
                } catch (err) {
                  console.log({ error: true, msg: err.message });
                }
              }
            }
          }
        }
      }
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {number !== null ? (
          // <img src={Sign} alt="..." className="mx-auto d-block modal_gesture"/>
          <img
            alt=""
            src={images[number]}
            className="mx-auto d-block modal_gesture"
          />
        ) : (
          ""
        )}
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
      </header>
    </div>
  );
}

export default FingerAuth;
