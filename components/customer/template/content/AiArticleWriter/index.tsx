import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { cancelRequest } from "../../../../../utils/authRequest";
import Progress from "./progress/index";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

const AiArticleWriter: React.FC<{
  copies: [];
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}> = ({ copies, isAdblockCheckComplete, isAdblockerDetected }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [targetTopic, setTopic] = useState("");
  const [intro, setIntro] = useState("");

  const [step, setStep] = useState<number>(0);
  const [out, fadeOut] = useState(false);

  const onChangeStep = (target: number) => {
    if (target === step) {
      return;
    }
    cancelRequest();
    fadeOut(true);
    const id = setTimeout(() => {
      setStep(target);
      fadeOut(false);
    }, 300);
  };

  useEffect(() => {
    if (copies?.length) {
      setStep(2);
    } else {
      setStep(0);
    }
  }, [copies?.length]);

  return (
    <>
      <Progress step={step} onChangeStep={onChangeStep} />
      <main
        className={classNames(
          "md:grid grid-cols-1 md:grid-cols-3 overflow-y-auto auto-cols-min flex-1",
          out
            ? "transition-all duration-300 transform -translate-x-2/3 scale-50 opacity-0"
            : "transition-opacity duration-500 opacity-100"
        )}
      >
        {step === 0 && (
          <Step1
            targetTopic={targetTopic}
            setTopic={setTopic}
            onChangeStep={onChangeStep}
            isAdblockCheckComplete={isAdblockCheckComplete}
            isAdblockerDetected={isAdblockerDetected}
          />
        )}
        {step === 1 && (
          <Step2
            intro={intro}
            setIntro={setIntro}
            onChangeStep={onChangeStep}
            isAdblockCheckComplete={isAdblockCheckComplete}
            isAdblockerDetected={isAdblockerDetected}
          />
        )}
        {step > 1 && <Step3 intro={intro} />}
      </main>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    copies: state?.template?.copies ?? [],
  };
};

export default connect(mapStateToProps)(AiArticleWriter);
