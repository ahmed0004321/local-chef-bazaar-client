import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, Home, ArrowRight, Download } from "lucide-react";
import { Link, useSearchParams } from "react-router"; // Assuming you use React Router
import useAxiosSecure from "../../Hooks/AxiosSecure";

const PaymentSuccess = () => {
    const axiosSecure = useAxiosSecure();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    console.log(sessionId);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    if(sessionId){
        axiosSecure.patch(`/payment-success?session_id=${sessionId}`,)
        .then(res => {
            console.log(res.data);
        })
    }
  },[axiosSecure, sessionId])



  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Effect - stops recycling after a few seconds */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.15}
      />

      {/* Main Card with Motion Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        {/* Top Decorative Bar */}
        <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-600 w-full" />

        <div className="p-8 md:p-12 text-center">
          {/* Animated Check Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={3} />
          </motion.div>

          {/* Headings */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase. Your order has been confirmed and is
            being processed.
          </p>

          {/* Order Details Receipt Box */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-500">Order Number</span>
              <span className="font-mono font-semibold text-gray-800">
                #ORD-73920
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-semibold text-gray-800 text-lg">
                $149.00
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date</span>
              <span className="text-gray-800">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              className="btn w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
              onClick={() => console.log("Download Receipt")}
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <Link to="/dashboard/myOrders">
                <button className="w-full py-3 px-4 rounded-xl border-2 border-gray-100 text-gray-700 font-medium hover:border-green-100 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center justify-center gap-2">
                  View Order <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/">
                <button className="w-full py-3 px-4 rounded-xl border-2 border-gray-100 text-gray-700 font-medium hover:border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  Home <Home className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
