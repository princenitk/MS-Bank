// import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from "fingerpose";

// define gesture desc

export const NumericOne = new GestureDescription("1");
export const NumericTwo = new GestureDescription("2");
export const NumericThree = new GestureDescription("3");
export const NumericFour = new GestureDescription("4");
export const NumericFive = new GestureDescription("5");
export const NumericZero = new GestureDescription("0");
export const thumbsDownGesture = new GestureDescription('thumbs_down');


// ************************ FOR NUMERIC ONE ****************************** //
//Index
NumericOne.addDirection(Finger.Index,FingerDirection.VerticalUp,1.0);
NumericOne.addCurl(Finger.Index,FingerCurl.NoCurl);
NumericOne.addCurl(Finger.Index,FingerCurl.HalfCurl,0.8);

NumericOne.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.9);
NumericOne.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.9);


// for rest of the fingers
for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky, Finger.Thumb]){
    NumericOne.addCurl(finger,FingerCurl.FullCurl,1.0);
    NumericOne.addCurl(finger,FingerCurl.HalfCurl,0.9);
}

// ************************ FOR NUMERIC TWO ****************************** //
//Index
for(let finger of [Finger.Index, Finger.Middle]){
    NumericTwo.addDirection(finger,FingerDirection.VerticalUp,1.0);
    NumericTwo.addCurl(finger,FingerCurl.NoCurl);
    NumericTwo.addCurl(finger,FingerCurl.HalfCurl,0.8);
    
    NumericTwo.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9);
    NumericTwo.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9);
}

// for rest of the fingers
for(let finger of [ Finger.Ring, Finger.Pinky, Finger.Thumb]){
    NumericTwo.addCurl(finger,FingerCurl.FullCurl,1.0);
    NumericTwo.addCurl(finger,FingerCurl.HalfCurl,0.9);
}
// ************************ FOR NUMERIC THREE ****************************** //

for(let finger of [Finger.Index, Finger.Middle, Finger.Ring]){
    NumericThree.addDirection(finger,FingerDirection.VerticalUp,1.0);
    NumericThree.addCurl(finger,FingerCurl.NoCurl);
    NumericThree.addCurl(finger,FingerCurl.HalfCurl,0.8);
    
    NumericThree.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9);
    NumericThree.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9);
}

// for rest of the fingers
for(let finger of [ Finger.Pinky, Finger.Thumb]){
    NumericThree.addCurl(finger,FingerCurl.FullCurl,1.0);
    NumericThree.addCurl(finger,FingerCurl.HalfCurl,0.9);
}

// ************************ FOR NUMERIC FOUR ****************************** //
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring,Finger.Pinky]){
    NumericFour.addDirection(finger,FingerDirection.VerticalUp,1.0);
    NumericFour.addCurl(finger,FingerCurl.NoCurl);
    NumericFour.addCurl(finger,FingerCurl.HalfCurl,0.8);
    
    NumericFour.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9);
    NumericFour.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9);
}

// for Thumb

    NumericFour.addCurl(Finger.Thumb,FingerCurl.FullCurl,1.0);
    NumericFour.addCurl(Finger.Thumb,FingerCurl.HalfCurl,0.9);
    //NumericFour.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);
    //NumericFour.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);


// ************************ FOR NUMERIC FIVE ****************************** //

for(let finger of [Finger.Index, Finger.Middle, Finger.Ring,Finger.Pinky,Finger.Thumb]){
    NumericFive.addDirection(finger,FingerDirection.VerticalUp,1.0);
    NumericFive.addCurl(finger,FingerCurl.NoCurl,1.0);
    //NumericFive.addCurl(finger,FingerCurl.HalfCurl,0.8);
    
    NumericFive.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9);
    NumericFive.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9);
    
}

NumericFive.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);
NumericFive.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);

// ************************ FOR NUMERIC ZERO ****************************** //

for(let finger of [Finger.Pinky, Finger.Middle, Finger.Ring]){
    NumericZero.addDirection(finger,FingerDirection.VerticalUp,1.0);
    NumericZero.addCurl(finger,FingerCurl.NoCurl);
    NumericZero.addCurl(finger,FingerCurl.HalfCurl,0.8);
    
    NumericZero.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9);
    NumericZero.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9);
}


for(let finger of [ Finger.Index, Finger.Thumb]){
    NumericZero.addCurl(finger,FingerCurl.HalfCurl,1.0);
}


// ************************ FOR THUMBS DOWN ****************************** //

thumbsDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.9);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.9);
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    thumbsDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    thumbsDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
  }