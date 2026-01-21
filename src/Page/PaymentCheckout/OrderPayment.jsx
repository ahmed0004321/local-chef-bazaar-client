import React, { use } from "react";
import Loading from "../../Components/Loading/Loading";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const OrderPayment = () => {
  const { id } = useParams();
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    // Changed default to {} assuming the API returns a single object for a specific ID
    data: orderPayment = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orderPayment", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/orderPayment/${id}`);
      return res.data;
    },
  });
  const handlePayment = async () => {
    console.log("going to stripe payment getaway");
    const paymentInfo = {
      price: orderPayment.price,
      orderId: orderPayment._id,
      userEmail: orderPayment.userEmail,
      mealName: orderPayment.mealName,
    };
    const res = await axiosSecure.post("/create-checkout-session", paymentInfo);
    console.log(res.data);
    window.location.href = res.data.url;
  };
  console.log("Fetched Data:", orderPayment);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 bg-base-100">
      <div className="text-center space-y-4">
        {/* Small Label */}
        <p className="text-lg uppercase tracking-widest text-gray-500">
          Payment For
        </p>

        {/* BIG ORDER NAME */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary capitalize">
          {/* Replace 'itemName' with the actual field name from your DB */}
          {orderPayment.mealName || orderPayment.name || "Unknown Order"}
        </h1>

        {/* Price Display */}
        <p className="text-3xl font-semibold text-gray-700">
          Total: ${orderPayment.price || "0.00"}
        </p>
      </div>

      {/* PAY NOW BUTTON */}
      <button
        className="btn btn-primary btn-lg px-12 text-xl shadow-xl hover:scale-105 transition-transform rounded-full"
        onClick={handlePayment}
      >
        PAY NOW
      </button>
    </div>
  );
};

export default OrderPayment;
