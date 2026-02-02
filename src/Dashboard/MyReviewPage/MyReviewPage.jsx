import React, { use, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";

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
        `/dashboard/myReview?email=${user?.data?.email}`,
      );
      return res.data;
    },
  });

  console.log(review);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        My Reviews <span className="badge badge-primary badge-lg">{review.length}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {review.map((rev) => (
          <div
            key={rev._id}
            className="flex flex-col md:flex-row rounded-3xl bg-surface border border-white/5 overflow-hidden hover:border-primary/20 transition-all duration-300 shadow-xl group"
          >
            {/* Meal Image */}
            <div className="md:w-48 h-48 md:h-auto overflow-hidden">
              <img
                src={rev.mealDetails?.foodImage}
                alt={rev.mealDetails?.foodName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {rev.mealDetails?.foodName || rev.mealName || "Unknown Meal"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-500 text-xs">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar key={i} className={i < rev.rating ? "fill-current" : "opacity-20"} />
                      ))}
                    </div>
                    <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-black">
                      ID: {rev._id.slice(-6)}
                    </span>
                  </div>
                </div>
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                  {rev.rating}/5
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl flex-1 mb-4 relative">
                <p className="text-foreground/80 text-sm leading-relaxed italic line-clamp-3">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <span className="text-[10px] text-foreground/40 font-medium">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpen(rev)}
                    className="p-2 hover:bg-primary/10 rounded-lg text-foreground/60 hover:text-primary transition-all"
                    title="Edit Review"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(rev)}
                    className="p-2 hover:bg-error/10 rounded-lg text-foreground/60 hover:text-error transition-all"
                    title="Delete Review"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {review.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-50">
            <div className="text-5xl mb-3">💬</div>
            <h3 className="text-xl font-bold">No reviews yet</h3>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface p-6 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-1">Update Review</h2>
            <p className="text-sm opacity-60 mb-6">Change your opinion about <span className="text-primary">{currentReview?.mealName}</span></p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              className="w-full bg-neutral-900 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl p-4 text-foreground resize-none"
              placeholder="Write your updated review here..."
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="btn btn-primary px-8"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewPage;
