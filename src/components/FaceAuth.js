import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { storage } from "../firebase";

import { ref, getDownloadURL, uploadString } from "firebase/storage";

function FaceAuth(props) {
  //states for webcam
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState("");

  const navigate = useNavigate();
  //states for send image to firebase
  const [imageURL, setImageURL] = useState("");

  const [retake, setRetake] = useState(false);

  //states for send backend data
  const [userId, setuserId] = useState("");
  const [StateOfProcess, setStateOfProcess] = useState("");

  //Spinner states
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Login

  const handleAuth = async (e) => {
    try {
      props.handleShowSecond();
      props.handleCloseFirst();
    } catch (err) {
      setLoading(false);
    }
  };

  //Method to capture an image Destop
  const captureImage = React.useCallback(async () => {
    props.disableModalCloseButton();
    const imageSrc = await webcamRef.current.getScreenshot();
    // setRetake(true);
    setShow(false);
    setLoading(true);
    setImgSrc(imageSrc);
    uploadImage(imageSrc);
  }, [webcamRef, setImgSrc]);

  // function to upload Image on Firebase and get URL
  async function uploadImage(imgSrc) {
    if (imgSrc !== null) {
      setStateOfProcess("Uploading...");

      const fileName = Math.floor(Math.random() * 100000 + 1) + ".jpg";
      const base64String = imgSrc.split(",")[1];
      const imageRef = ref(storage, `facelogin/${fileName}`);
      const imgId = props.email.substring(0, props.email.lastIndexOf("@"));

      const userFace = ref(storage, `facedata/${imgId}`);

      uploadString(imageRef, base64String, "base64", {
        contentType: "image/jpeg",
      }).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((urlFirebase) => {
          setImageURL(urlFirebase);

          const config = {
            headers: {
              "Content-Type": "application/json",
              "app_id": process.env.REACT_APP_KAIROS_APP_ID,
              "app_key": process.env.REACT_APP_KAIROS_APP_KEY
            },
          };

          const newImage1Details = {
            image: urlFirebase,
          };

          getDownloadURL(userFace).then((url) => {
            const newImage2Details = {
              image: url,
            };

            
            // calling azure API to detect a FACE in image sent
            axios
              .post(
                "https://api.kairos.com/detect",
                newImage2Details,
                config
              )
              .then(async (res) => {
                setuserId(res.data.images.length);
                setStateOfProcess("Processing...");

           
                // calling azure API to detect a FACE in image sent
                axios
                  .post(
                    "https://api.kairos.com/detect",
                    newImage1Details,
                    config
                  )
                  .then(async (response) => {
                    setuserId(response.data.images.length);
                    setStateOfProcess("Processing...");

                    const newUserLogin = {
                      source_image: urlFirebase,
                      target_image: url,
                    };

                    // calling azure API to compare two images and see if there are identical faces in there
                    await axios
                      .post(
                        "https://api.kairos.com/compare",
                        newUserLogin,
                        config
                      )
                      .then(async (result) => {
                        setStateOfProcess("Please Wait...");

                        const loginObj = {
                          confidence: result.data.MatchedFaces[0].confidence,
                        };

                        if (loginObj.confidence > 0.8) {
                          handleAuth();
                        } else {
                          setRetake(true);
                          setLoading(false);
                          setStateOfProcess("Face Match Failed. Try again.");
                          props.enableModalCloseButton();
                        }
                      })
                      .catch(() => {
                        setRetake(true);
                        setLoading(false);
                        setStateOfProcess("Authentication Failed");
                      });
                  })
                  .catch((err) => {
                    setStateOfProcess("Face not found. Try again.");
                    setRetake(true);
                    setLoading(false);
                    setShow(true);
                    // alert(err.message);
                  });
              })
              .catch((err) => {
                setStateOfProcess("");
                setRetake(true);
                setLoading(false);
                setShow(true);
                // alert(err.message);
              });
          });
        });
      });
    } else {
      setStateOfProcess("Camera not found");
      setLoading(false);
    }
  }

  return (
    <div>
      {show ? (
        <Alert className="text-center bg-white text-danger border-0">
          Face Not Detected
        </Alert>
      ) : null}
      <div className="row text-center">
        <div className="col-md-12">
          {loading ? (
            <img src={imgSrc} className="webcam" />
          ) : (
            <Webcam
              audio={false}
              mirrored={true}
              ref={webcamRef}
              className="webcam webcam_video_size"
              screenshotFormat="image/jpeg"
            />
          )}
        </div>
        <div className="col-md-12">
          {retake ? (
            <button
              className="btn btn-dark text-light"
              onClick={() => {
                setRetake(false);
                captureImage();
              }}
            >
              Retake
            </button>
          ) : (
            <div>
              <br />
              {loading ? (
                <Spinner animation="border" className="mt-2" />
              ) : (
                <button
                  className="btn btn-dark text-light"
                  onClick={captureImage}
                >
                  Capture & Verify{" "}
                </button>
              )}
            </div>
          )}

          <div>
            <div className="form-group mt-2 mb-2">
              <h5>{StateOfProcess}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceAuth;
