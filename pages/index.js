import { useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
// import { useLottie } from "lottie-react";
import Lottie from "lottie-react";
import warmUpGuy from "../assets/warm-up-guy.json";

const WarmUpGuy = () => {
  return <Lottie animationData={warmUpGuy} />;
};
const Home = () => {
  const textfieldRef = useRef();
  const modalityInputRef = useRef();
  // const [userInput, setUserInput] = useState("");
  // const onUserChangedText = (e) => {
  //   setUserInput(e.target.value);
  // };

  // const options = {
  //   animationData: warmUpGuy,
  //   loop: true,
  // };

  // const { View } = useLottie(options);

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scoringInput: textfieldRef.current.value,
        modalityInput: modalityInputRef.current.value,
      }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...");

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>WODEverest</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Train Smarter, Not Harder</h1>
          </div>
          <div className="header-subtitle">
            <h2>CrossFit Training with Machine Learning</h2>
          </div>
        </div>
        <div className="prompt-container">
          <input
            ref={textfieldRef}
            className="prompt-box"
            placeholder="Choose a scoring type... (AMRAP, For Time, EMOM etc.)"
          />
          <input
            ref={modalityInputRef}
            className="prompt-box"
            placeholder="Choose a modality... (Cardio, Weightlifting, Gymnastics etc.)"
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          {isGenerating && (
            <>
              <div className="header-subtitle">
                <h2>Warming up! WOD incomming</h2>
              </div>
              <WarmUpGuy />
            </>
          )}

          {apiOutput && !isGenerating && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Todays WOD is</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bmc-container grow">
        <a href="https://www.buymeacoffee.com/imdny" target="_blank">
          <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a banana&emoji=🍌&slug=imdny&button_colour=735d78&font_colour=ffffff&font_family=Comic&outline_colour=ffffff&coffee_colour=FFDD00" />
        </a>
      </div>
    </div>
  );
};

export default Home;
