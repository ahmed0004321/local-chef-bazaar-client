import React from 'react';
import { Link } from 'react-router';
import { Button, Card } from '../../Components/UI';
import { FaTimesCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const PaymentCancelled = () => {
    return (
        <div className="flex items-center justify-center py-10 px-4">
            <Card className="max-w-md w-full text-center p-8 glass border-white/20 shadow-2xl animate-fade-in shadow-red-500/10">
                <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTimesCircle className="text-5xl" />
                </div>
                <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                    Payment Cancelled
                </h1>
                <p className="text-foreground/60 mb-8 flex items-center justify-center gap-2">
                    <FaExclamationTriangle className="text-yellow-500" /> Your payment process was interrupted.
                </p>

                <div className="space-y-3">
                    <Button to="/dashboard/myOrders" variant="primary" className="w-full gap-2 py-6 rounded-2xl shadow-xl shadow-primary/20">
                        Try Again
                    </Button>
                    <Button to="/" variant="ghost" className="w-full gap-2">
                        <FaArrowLeft /> Back to Home
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PaymentCancelled;
