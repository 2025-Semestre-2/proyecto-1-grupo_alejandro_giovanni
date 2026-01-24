import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingStep1 from "./components/book/BookingStep1";
import BookingStep2 from "./components/book/BookingStep2";
import BookingStep3 from "./components/book/BookingStep3";
import StepIndicator from "./components/book/StepIndicator";
import "./Book.css";

function Book() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [step, setStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    people: 1,
    arrivalDate: "",
    departureDate: "",
    checkInHour: "",
    hasVehicle: false,
    nights: 1,
    roomPrice: 65000,
  });

  return (
    <div className="bookPage">
      <div className="logoCenter">
        <button className="buttonLogo smallLogo" onClick={() => navigate("/")}>
          Looking.com
        </button>
      </div>

      <StepIndicator step={step} />
        
      {step === 1 && (
        <BookingStep1
          bookingData={bookingData}
          setBookingData={setBookingData}
          next={() => setStep(2)}
          cancel={() => navigate("/")}
        />
      )}

      {step === 2 && (
        <BookingStep2
          bookingData={bookingData}
          back={() => setStep(1)}
          next={() => setStep(3)}
          cancel={() => navigate("/")}
        />
      )}

      {step === 3 && <BookingStep3 navigate={navigate} />}
    </div>
  );
}

export default Book;
