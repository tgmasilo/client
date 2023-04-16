import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import adapter from "webrtc-adapter";

import "./AppointmentPage.css";

const socket = io("http://localhost:5000");

const AppointmentPage = () => {
  const [stream, setStream] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [calling, setCalling] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [error, setError] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  const { id } = useParams();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const diagnosisRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.log(`Error accessing media devices, ${err}`);
        setError(
          `Error accessing media devices.Please check your camera and microphone`
        );
      });

    socket.emit("joinAppointment", id);

    socket.on("otherUser", (user) => {
      setOtherUser(user);
      setCalling(true);
    });

    socket.on("callAccepted", () => {
      setCallAccepted(true);
      peerRef.current.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(localStorage.getItem("offer")))
      );
      peerRef.current
        .createAnswer()
        .then((answer) => {
          peerRef.current.setLocalDescription(
            new RTCSessionDescription(answer)
          );
          socket.emit("answerCall", { answerData: answer, to: otherUser });
        })
        .catch((err) => {
          console.log(`Error creating answer, ${err}`);
          setError(`Error creating answer. Please try again later.`);
        });
    });

    socket.on("answerAccepted", (answer) => {
      peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("callRejected", () => {
      setCallRejected(true);
    });

    socket.on("sessionEnded", () => {
      endSession();
    });

    return () => {
      socket.off();
    };
  }, [id]);

  const callUser = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peerRef.current = peer;
    stream.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, stream);
    });
    peerRef.current
      .createOffer()
      .then((offer) => {
        peerRef.current.setLocalDescription(new RTCSessionDescription(offer));
        localStorage.setItem("offer", JSON.stringify(offer));
        socket.emit("callUser", { offerData: offer, to: otherUser });
      })
      .catch((err) => {
        console.error("Error creating offer.", err);
        setError("Error creating offer. Please try again later.");
      });
    peerRef.current.ontrack = (event) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = event.streams[0];
      }
    };
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidateData: event.candidate,
          to: otherUser,
        });
      }
    };
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const offer = JSON.parse(localStorage.getItem("offer"));
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peerRef.current = peer;
    stream.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, stream);
    });
    peerRef.current.ontrack = (event) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = event.streams[0];
      }
    };
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidateData: event.candidate,
          to: otherUser,
        });
      }
    };
    peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    peerRef.current
      .createAnswer()
      .then((answer) => {
        peerRef.current.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit("answerCall", { answerData: answer, to: otherUser });
      })
      .catch((err) => {
        console.error("Error creating answer.", err);
        setError("Error creating answer. Please try again later.");
      });
  };

  const rejectCall = () => {
    setCallRejected(true);
    socket.emit("rejectCall", otherUser);
  };

  const endSession = () => {
    if (peerRef.current) {
      peerRef.current.close();
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    localStorage.removeItem("offer");
    setOtherUser(null);
    setCalling(false);
    setCallAccepted(false);
    setCallRejected(false);
    setDiagnosis("");
    setRating(0);
    setIsRated(false);
  };

  const handleDiagnosisChange = (event) => {
    setDiagnosis(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleSubmit = () => {
    const encryptedDiagnosis =
      ""; /* encrypt diagnosis using a secure encryption algorithm */
    const appointmentData = {
      appointmentId: id,
      diagnosis: encryptedDiagnosis,
      rating: rating,
    };
    axios
      .post("http://localhost:5000/appointments/submit", appointmentData)
      .then(() => {
        setIsRated(true);
      })
      .catch((err) => {
        console.error("Error submitting appointment data.", err);
        setError("Error submitting appointment data. Please try again later.");
      });
  };

  return (
    <div className="appointment-page">
      {calling && (
        <div className="call-container">
          <video className="local-video" ref={userVideo} autoPlay muted></video>
          {callAccepted ? (
            <video
              className="partner-video"
              ref={partnerVideo}
              autoPlay
            ></video>
          ) : (
            <>
              {callRejected ? (
                <div className="call-message">Call rejected.</div>
              ) : (
                <div className="call-message">
                  Incoming call from {otherUser}.
                </div>
              )}
              <div className="call-buttons">
                <button
                  className="call-button accept-button"
                  onClick={acceptCall}
                >
                  Accept
                </button>
                <button
                  className="call-button reject-button"
                  onClick={rejectCall}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {!calling && (
        <div className="appointment-container">
          {error && <div className="error-message">{error}</div>}
          {isRated ? (
            <div className="rated-message">
              Thank you for rating this appointment.
            </div>
          ) : (
            <>
              <div className="diagnosis-container">
                <label htmlFor="diagnosis" className="diagnosis-label">
                  Diagnosis:
                </label>
                <textarea
                  id="diagnosis"
                  className="diagnosis-textarea"
                  value={diagnosis}
                  onChange={handleDiagnosisChange}
                ></textarea>
              </div>
              <div className="rating-container">
                <label htmlFor="rating" className="rating-label">
                  Rating:
                </label>
                <select
                  id="rating"
                  className="rating-select"
                  value={rating}
                  onChange={handleRatingChange}
                >
                  <option value={0}>Select a rating</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </>
          )}
          <button className="end-session-button" onClick={endSession}>
            End session
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
