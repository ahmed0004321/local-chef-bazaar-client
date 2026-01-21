import React from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  RefreshCw,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Visual Header */}
        <div className="bg-amber-50 p-10 flex justify-center relative">
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <XCircle className="w-24 h-24 text-amber-500" />
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2"
              >
                <AlertCircle className="w-8 h-8 text-amber-600 fill-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            No worries! Your payment was not processed and no funds were
            deducted. You can try again whenever you're ready.
          </p>

          {/* Reasons/Help Box */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
            <MessageCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Need help?</p>
              <p className="text-xs text-blue-700">
                If you encountered a technical issue, please contact our support
                team.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Paying Again
            </button>

            <Link
              to="/"
              className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-700 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Homepage
            </Link>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest font-medium">
            Secure checkout by Stripe
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
