import React, { useEffect, useRef } from "react";
import Lottie from "lottie-web";
export const LottieAnimation = ({fileName, width,divId,animationTitle, animationDescription}) => {
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
        title: animationTitle,
        description: animationDescription,
      },
      path: fileName,
    });
    anim.setSubframe(false);
    anim.onError = function (errorType) {
      console.log(errorType);
    };

  }, []);
  return (
    <div
      id={divId}
      style={{ width: width, margin: "auto", display: "block" }}
    ></div>
  );
};
