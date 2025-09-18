import { React, useState } from "react";
import location from "../assets/location.jpg";

function Delivery() {
  const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!pincode) {
      setError("Please enter a pincode");
      setSubmitted(false);
    } else if (pincode.length < 6) {
      setError("Please enter a valid pincode");
      setSubmitted(false);
    } else {
      setError("");
      setSubmitted(true);
    }
  };

  const handleChangePincode = () => {
    setPincode("");
    setSubmitted(false);
    setError("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  };

  return (
    <div className="flex flex-col h-auto w-[280px] ml-[4px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm p-3">
      {/* Header */}
      <div className="flex items-center justify-center">
        <img src={location} alt="location" />
      </div>
      <div className="text-[10px] text-center mt-1">Your Delivery Pincode</div>

      {/* Subtext */}
      <div className="flex items-center justify-center mt-1 mx-2">
        <p className="text-sm text-gray-600 text-center">
          Enter your pincode to check availability and faster delivery options
        </p>
      </div>

      {/* Input or Pincode */}
      {submitted ? (
        <div className="font-semibold text-lg mx-2 mt-2">Pincode: {pincode}</div>
      ) : (
        <div className="flex flex-col w-full mt-2">
          <input
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={handleChange}
            maxLength={6}
            className={`border rounded px-3 py-2 text-black w-full
`}
          />
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col space-y-2 mt-4">
        {submitted ? (
          <div className="flex gap-2">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={handleChangePincode}
            >
              Change Pincode
            </button>
            <button className="px-4 py-2 text-[#666666] border border-gray-300 rounded hover:text-black">
              Next
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="bg-[#333333] text-white px-10 py-2 rounded hover:bg-black"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button className="px-8 py-2 text-[#666666] border border-gray-300 rounded hover:text-black">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Delivery;
