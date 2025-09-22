import { useState } from "react";
import pin from "../assets/pin.png";
import bell from "../assets/bell.png";
import api from "../api/api";


function Login({ onClose, setUser }) {
    // Step management
    const [step, setStep] = useState("login");
    const [emailOrMobile, setEmailOrMobile] = useState("");

    // Register form states
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPhone, setRegisterPhone] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("api/user/login", {
      email: emailOrMobile.includes("@") ? emailOrMobile : undefined,
      phone: !emailOrMobile.includes("@") ? emailOrMobile : undefined
    });

    if (res.data.success) {
      if (res.data.isNewUser) {
        // Prefill registration form
        if (emailOrMobile.includes("@")) {
          setRegisterEmail(emailOrMobile);
          setRegisterPhone("");
        } else {
          setRegisterPhone(emailOrMobile);
          setRegisterEmail("");
        }
        setStep("register");
      } else {
        setStep("otp");
      }
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Failed to send OTP");
  }
};

const handleRegister = async (e) => {
  e.preventDefault();

  // Client-side validation
  if (!name || !registerEmail || !registerPhone || !password) {
    alert("All fields are required");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registerEmail)) {
    alert("Please enter a valid email address");
    return;
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(registerPhone)) {
    alert("Phone number must be 10 digits");
    return;
  }

  // Password validation
  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    const res = await api.post("api/user/register", {
      name,
      email: registerEmail,
      phone: registerPhone,
      dob,
      password
    });

    if (res.data.success) {
      // After registration, go to OTP step
      setStep("otp");
    }
  } catch (err) {
    console.error("Registration error:", err);
    // Show the specific error message from the server
    const errorMessage = err.response?.data?.message || "Registration failed";
    alert(errorMessage);
  }
};

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("api/user/verifyotp", {
      email: registerEmail || (emailOrMobile.includes("@") ? emailOrMobile : undefined),
      phone: registerPhone || (!emailOrMobile.includes("@") ? emailOrMobile : undefined),
      otpCode: otp
    });

    if (res.data.token) {
      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Set user for Navbar
      setUser(res.data.user.name);


      // Close modal
      onClose();

      // Reset states
      setStep("login");
      setOtp("");
      setName("");
      setDob("");
      setPassword("");
      setRegisterEmail("");
      setRegisterPhone("");
      setEmailOrMobile("");
    } else {
      alert("Invalid OTP");
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    alert("Failed to verify OTP");
  }
};




    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[700px] shadow-lg relative flex overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                >
                    <i className="fa fa-window-close" aria-hidden="true"></i>
                </button>

                {/* Left side */}
                <div className="w-1/2 bg-gray-50 p-6 flex flex-col justify-center">
                    <div className="space-y-6">
                        {/* Block 1 */}
                        <div className="flex items-start gap-2 pl-4">
                            <img src={pin} alt="location" className="h-12 w-12" />
                            <div>
                                <h4 className="text-[13px] text-gray-800 font-semibold">
                                    MANAGE YOUR ORDERS
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Track orders, manage cancellations & returns.
                                </p>
                            </div>
                        </div>

                        {/* Block 2 */}
                        <div className="flex items-start gap-2 pl-4">
                            <img src={bell} alt="offers" className="h-12 w-12" />
                            <div>
                                <h4 className="text-[13px] text-gray-800 font-semibold">
                                    AWESOME OFFERS UPDATES FOR YOU
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Be first to know about great offers and save.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="w-1/2 p-8">
                    {step === "login" && (
                        <>
                            <h2 className="text-xl font-semibold mb-4">
                                Login/Sign Up On Snapdeal
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Please provide your Mobile Number or Email
                            </p>

                            <form onSubmit={handleLoginSubmit} className="space-y-4 ">
                                <input
                                    type="text"
                                    placeholder="Mobile Number / Email"
                                    value={emailOrMobile}
                                    onChange={(e) => setEmailOrMobile(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#e40046] text-white py-2 rounded hover:bg-red-600 cursor-pointer"
                                >
                                    CONTINUE
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-500">
                                or Login Using
                            </div>

                            <button className="w-full border border-gray-300 rounded py-2 mt-3 flex items-center justify-center gap-2">
                                <img
                                    src="https://developers.google.com/identity/images/g-logo.png"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                <span>Google</span>
                            </button>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                We’ve sent an OTP to{" "}
                                <span className="font-semibold">{emailOrMobile}</span>
                            </p>
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#e40046] text-white py-2 rounded hover:bg-red-600"
                                >
                                    Verify OTP
                                </button>
                            </form>
                        </>
                    )}


                    {step === "register" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
                            <span className="block mb-4 text-sm text-gray-600">
                                Create an account on Snapdeal
                            </span>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="+91 Mobile Number"
                                    value={registerPhone}
                                    onChange={(e) => setRegisterPhone(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <input
                                    type="date"
                                    placeholder="DOB"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#e40046] text-white py-2 rounded hover:bg-red-600"
                                >
                                    Register
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
