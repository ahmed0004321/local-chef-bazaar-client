import React, { use, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";

const MyReviewPage = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [open, setOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [comment, setComment] = useState("");

  const {
    data: review = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/dashboard/myReview", user?.data?.email],
    enabled: !!user?.data?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/myReview?email=${user?.data?.email}`
      );
      return res.data;
    },
  });

  console.log(review);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }

  const handleOpen = (rev) => {
    setCurrentReview(rev);
    setComment(rev.text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentReview(null);
  };

  const handleUpdate = async () => {
    try {
      await axiosSecure.patch(`/dashboard/review/${currentReview._id}`, {
        text: comment,
      });

      //  Added Swal for success
      Swal.fire({
        title: "Updated!",
        text: "Your comment has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#ffffff",
      });

      refetch();
      handleClose();
    } catch (err) {
      console.error(err);

      //  Added Swal for error
      Swal.fire({
        title: "Update Failed",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#ffffff",
      });
    }
  };

  const handleDelete = (rev) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/dashboard/review/${rev._id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your review has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
            background: "#1f2937",
            color: "#ffffff",
          });
          refetch();
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Delete Failed",
            text: err.message,
            icon: "error",
            confirmButtonText: "OK",
            background: "#1f2937",
            color: "#ffffff",
          });
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        My Reviews({review.length})
      </h1>

      <div className="space-y-4">
        {review.map((review) => (
          <div
            key={review._id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-5 shadow-md"
          >
            {/* Review Info */}
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold text-white">
                {review.mealName}
              </h2>

              <p className="text-sm text-gray-200">
                <span className="font-medium">Meal ID:</span> {review._id}
              </p>

              <p className="text-sm text-gray-200">
                <span className="font-medium">Rating:</span> {review.rating}
              </p>

              <p className="text-sm text-gray-200">
                <span className="font-medium">Comment:</span> {review.text}
              </p>

              <p className="text-xs text-gray-300">
                <span className="font-medium">Date:</span> {review.created_at}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(review)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
              >
                Delete
              </button>

              <button
                onClick={() => handleOpen(review)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md border border-white/20">
            <h2 className="text-white text-lg font-semibold mb-4">
              Update Comment
            </h2>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-3"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-blue-500/30 text-blue-200 hover:bg-blue-500/40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewPage;
