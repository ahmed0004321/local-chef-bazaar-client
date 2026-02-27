import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Loading from "../../Components/Loading/Loading";
import { Card, Button } from "../../Components/UI";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaCheckCircle,
  FaUtensils,
  FaUserShield,
  FaCloudUploadAlt,
  FaKey,
  FaCamera,
} from "react-icons/fa";
import axios from "axios";

const MyProfile = () => {
  const { user, loading, updateUserProfile, resetPassword } =
    useContext(AuthContext);
  const [photoValue, setPhotoValue] = useState(null);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const axiosSecure = useAxiosSecure();

  const handleRequest = async (type) => {
    try {
      const requestData = {
        userName: user?.data?.displayName || user?.displayName,
        userEmail: user?.data?.email || user?.email,
        requestType: type,
      };

      const res = await axiosSecure.post("/requests", requestData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: `Request to become ${type} sent successfully.`,
          icon: "success",
          confirmButtonColor: "#f38b0c",
          background: "var(--surface)",
          color: "var(--foreground)",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          title: "Info",
          text: "Request already sent.",
          icon: "info",
          confirmButtonColor: "#f38b0c",
          background: "var(--surface)",
          color: "var(--foreground)",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to send request.",
          icon: "error",
          confirmButtonColor: "#f38b0c",
          background: "var(--surface)",
          color: "var(--foreground)",
        });
      }
    }
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    if (!photoValue) {
      Swal.fire({
        title: "Warning",
        text: "Please select an image first.",
        icon: "warning",
        confirmButtonColor: "#f38b0c",
        background: "var(--surface)",
        color: "var(--foreground)",
      });
      return;
    }
    setUpdatingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", photoValue);

      const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;
      const imgRes = await axios.post(image_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      await updateUserProfile(
        user?.data?.displayName || user?.displayName,
        photoURL
      );

      Swal.fire({
        title: "Success!",
        text: "Profile picture updated successfully.",
        icon: "success",
        confirmButtonColor: "#f38b0c",
        background: "var(--surface)",
        color: "var(--foreground)",
      });
      setPhotoValue(null);
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile picture.",
        icon: "error",
        confirmButtonColor: "#f38b0c",
        background: "var(--surface)",
        color: "var(--foreground)",
      });
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    try {
      await resetPassword(user?.email);
      Swal.fire({
        title: "Email Sent!",
        text: "A password reset link has been sent to your email.",
        icon: "success",
        confirmButtonColor: "#f38b0c",
        background: "var(--surface)",
        color: "var(--foreground)",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to send reset email.",
        icon: "error",
        confirmButtonColor: "#f38b0c",
        background: "var(--surface)",
        color: "var(--foreground)",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );

  const role = user?.data?.role || "customer";
  const status = user?.data?.status || "active";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="!p-0 overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="h-1.5 bg-primary w-full"></div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-foreground/10 shadow-md overflow-hidden bg-foreground/5">
                  <img
                    src={
                      user?.data?.photoURL ||
                      user?.photoURL ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-[3px] border-surface"></div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {user?.data?.displayName ||
                    user?.displayName ||
                    "Guest User"}
                </h1>
                <p className="text-foreground/50 flex items-center justify-center md:justify-start gap-2 text-sm mt-1">
                  <FaEnvelope className="text-foreground/30" />
                  {user?.data?.email || user?.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider capitalize">
                    {role}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 capitalize">
                    <FaCheckCircle className="text-green-500 text-[10px]" />
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Info & Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-foreground/70">
              <FaIdBadge className="text-primary" /> Key Information
            </h3>
            <div className="space-y-3">
              <div className="bg-foreground/[0.03] p-4 rounded-xl border border-foreground/5">
                <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest mb-1">
                  User ID
                </p>
                <p className="font-mono text-sm text-foreground/70 break-all">
                  {user?.data?._id || user?.uid}
                </p>
              </div>
              <div className="bg-foreground/[0.03] p-4 rounded-xl border border-foreground/5">
                <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest mb-1">
                  Account Type
                </p>
                <p className="font-medium capitalize">{role}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        {role !== "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="h-full">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-foreground/70">
                <FaUserShield className="text-primary" /> Role Requests
              </h3>
              <div className="space-y-3">
                {role !== "chef" && (
                  <button
                    onClick={() => handleRequest("chef")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-foreground/5 bg-foreground/[0.03] hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <FaUtensils size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Become a Chef</p>
                      <p className="text-xs text-foreground/40">
                        Start selling your meals
                      </p>
                    </div>
                  </button>
                )}
                <button
                  onClick={() => handleRequest("admin")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-foreground/5 bg-foreground/[0.03] hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FaUserShield size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Become an Admin</p>
                    <p className="text-xs text-foreground/40">
                      Access management tools
                    </p>
                  </div>
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Update Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-foreground/70">
            <FaUser className="text-primary" /> Update Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Photo Upload */}
            <form onSubmit={handleUpdatePhoto} className="space-y-4">
              <div>
                <label className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest mb-2 block">
                  <FaCamera className="inline mr-1.5 text-foreground/30" />
                  Profile Photo
                </label>
                <div className="relative border-2 border-dashed border-foreground/10 rounded-xl p-6 hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-center cursor-pointer group">
                  <input
                    type="file"
                    onChange={(e) => setPhotoValue(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <FaCloudUploadAlt className="text-3xl text-foreground/20 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground/50">
                      {photoValue
                        ? photoValue.name
                        : "Click or drag image to upload"}
                    </span>
                    <span className="text-[10px] text-foreground/30">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={updatingPhoto}
                className="w-full"
              >
                {updatingPhoto ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update Image"
                )}
              </Button>
            </form>

            {/* Password Reset */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest mb-2 block">
                  <FaKey className="inline mr-1.5 text-foreground/30" />
                  Security
                </label>
                <div className="bg-foreground/[0.03] p-6 rounded-xl border border-foreground/5 h-[124px] flex flex-col justify-center">
                  <p className="text-sm text-foreground/60 mb-1">
                    Update your password securely via email.
                  </p>
                  <p className="text-xs text-foreground/30">
                    We'll send a reset link to:{" "}
                    <span className="text-foreground/50">{user?.email}</span>
                  </p>
                </div>
              </div>
              <Button
                onClick={handleUpdatePassword}
                variant="ghost"
                disabled={updatingPassword}
                className="w-full border border-foreground/10"
              >
                {updatingPassword ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Send Reset Email"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MyProfile;