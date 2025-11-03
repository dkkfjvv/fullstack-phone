import React from "react";

const Notification = ({ messageObject }) => {
  if (messageObject === "" || messageObject === null) {
    return "";
  } else {
    return (
      <div
        className={
          messageObject.type === "notification" ? "notification" : "fail"
        }
      >
        {messageObject.text}
      </div>
    );
  }
};

export default Notification;
