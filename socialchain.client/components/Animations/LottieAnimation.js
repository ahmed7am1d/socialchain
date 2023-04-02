import React, { useEffect, useRef } from "react";
import Lottie from "lottie-web";
export const LottieAnimation = ({fileName, width,divId}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      return;
    }
    ref.current = document.getElementById(divId);
    Lottie.setQuality("low");
    const anim = Lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: "xMidYMid meet",
        imagePreserveAspectRatio: "xMidYMid meet",
        title: "TEST TITLE",
        description: "TEST DESCRIPTION",
      },
      path: fileName,
    });
    anim.setSubframe(false);
    anim.onError = function (errorType) {
      console.log(errorType);
    };

    anim.addEventListener("error", function (error) {
      console.log(error);
    });

    anim.addEventListener("error", function (error) {
      console.log(error);
    });

    anim.addEventListener("DOMLoaded", function () {
      console.log("DOMLoaded");
    });
  }, []);
  return (
    <div
      id={divId}
      style={{ width: width, margin: "auto", display: "block" }}
    ></div>
  );
};
