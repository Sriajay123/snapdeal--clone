import {React,useState} from 'react'
import location from '../assets/location.jpg'

function Delivery() {

      const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (pincode.trim() !== "") {
      setSubmitted(true);
    } else {
      alert("Please enter a pincode");
    }
  };

  const handleChangePincode = () => {
    setPincode("");
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col h-[310px] w-[280px] ml -[4px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm">
  {/* Header */}
  <div className="flex items-center mt-[1px] pt-1 justify-center ">
    <img src={location} alt="location" />
    
  </div>
  <div className="text-[10px] text-center">Your Delivery Pincode</div>

  {/* Subtext */}
  <div className="flex items-center mt-[2px] justify-center ml-2 mr-2 pt-1" > 
  <p className="text-sm text-gray-600 ">
    Enter your pincode to check availability and faster delivery options
  </p>
  </div>

  {/* Input or Pincode */}
  {submitted ? (
    <div className="font-semibold text-lg ml-2 mr-2">Pincode: {pincode}</div>
  ) : (
    <input
      type="text"
      placeholder="Enter pincode"
      value={pincode}
      onChange={(e) => setPincode(e.target.value)}
      className="border border-gray-400 rounded px-3 py-2 text-black w-full mt-2"
    />
  )}

  {/* Buttons */}
  <div className="flex flex-col space-y-2">
    {submitted ? (
        <div className='flex gap-2'>
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
      <>
       <div className='flex gap-2 mt-[15px] ml-[9px]'>
        <button
          className="bg-[#333333] text-white px-10 py-2 rounded hover:bg-black "
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button className="px-8 py-2 text-[#666666] border border-gray-300 rounded hover:text-black">
          Next
        </button>
        </div>
      </>
    )}
  </div>
</div>

  );
}

export default Delivery