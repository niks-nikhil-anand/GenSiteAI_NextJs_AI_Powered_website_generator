import React from "react";
import { RingLoader } from "react-spinners";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <RingLoader color="#36D7B7" size={80} />
    </div>
  );
};

export default Loading;
