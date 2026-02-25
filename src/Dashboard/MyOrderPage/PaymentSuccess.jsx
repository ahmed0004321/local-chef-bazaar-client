import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import { Button, Container, Card } from '../../Components/UI';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Loading from '../../Components/Loading/Loading';
import { useQuery } from '@tanstack/react-query';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    console.log("PaymentSuccess component mounted");
    console.log("Session ID from URL:", sessionId);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['payment-success', sessionId],
        queryFn: async () => {
            const res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
            return res.data;
        },
        enabled: !!sessionId,
    });

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground"><Loading /></div>;

    if (isError) {
        console.error("Payment sync error:", error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
                <Card className="max-w-md w-full p-8 text-center glass border-red-500/50">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Verification Failed</h2>
                    <p className="mb-6 opacity-70">We couldn't verify your payment. Please contact support if you were charged.</p>
                    <Button to="/dashboard/myOrders" variant="primary">Back to Orders</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-10 px-4">
            <Card className="max-w-md w-full text-center p-8 glass border-white/20 shadow-2xl animate-fade-in shadow-green-500/10">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <FaCheckCircle className="text-5xl" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    Payment Successful!
                </h1>
                <p className="text-sm md:text-base text-foreground/60 mb-8">
                    Thank you for your order. Your kitchen is now prepping your delicious meal!
                </p>

                <div className="space-y-3">
                    <Button to="/dashboard/myOrders" variant="primary" className="w-full gap-2 py-6 rounded-2xl shadow-xl shadow-primary/20">
                        <FaShoppingBag /> View My Orders
                    </Button>
                    <Button to="/" variant="ghost" className="w-full gap-2">
                        <FaHome /> Back to Home
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
