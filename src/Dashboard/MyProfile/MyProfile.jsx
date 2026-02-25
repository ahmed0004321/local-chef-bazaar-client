import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Loading from "../../Components/Loading/Loading";
import { Card, Button } from "../../Components/UI";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaIdBadge, FaCheckCircle, FaUtensils, FaUserShield } from "react-icons/fa";

const MyProfile = () => {
  const { user, loading } = useContext(AuthContext);

  const axiosSecure = useAxiosSecure(); // Ensure you import this hook

  const handleRequest = async (type) => {
    try {
      const requestData = {
        userName: user?.data?.displayName || user?.displayName,
        userEmail: user?.data?.email || user?.email,
        requestType: type,
      };

      const res = await axiosSecure.post('/requests', requestData);

      if (res.data.insertedId) {
        Swal.fire({
          title: 'Success!',
          text: `Request to become ${type} sent successfully.`,
          icon: 'success',
          confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          title: 'Info',
          text: 'Request already sent.',
          icon: 'info',
          confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send request.',
          icon: 'error',
          confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
        });
      }
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loading /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ... (existing header code) ... */}
      <div className="bg-gradient-to-r from-primary to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden p-1 bg-white/10 backdrop-blur-sm">
              <img
                src={user?.data?.photoURL || user?.photoURL || "https://ui-avatars.com/api/?name=User"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-neutral-800 shadow-sm"></div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-1">{user?.data?.displayName || user?.displayName || "Guest User"}</h1>
            <p className="opacity-90 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
              <FaEnvelope /> {user?.data?.email || user?.email}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-bold border border-white/20 capitalize">
                {user?.data?.role || 'User'}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur text-sm font-bold border border-green-500/30 text-green-100 flex items-center gap-1">
                <FaCheckCircle className="text-xs" /> {user?.data?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 transition-colors cursor-default">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/80">
            <FaIdBadge className="text-primary" /> Key Information
          </h3>
          <div className="space-y-4">
            <div className="bg-surface/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
              <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">User ID</p>
              <p className="font-mono text-sm break-all">{user?.data?._id || user?.uid}</p>
            </div>
            <div className="bg-surface/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
              <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">Account Type</p>
              <p className="font-medium capitalize">{user?.data?.role || 'Customer'}</p>
            </div>
          </div>
        </Card>

        {user?.data?.role !== 'admin' && (
          <Card className="hover:border-primary/50 transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/80">
              <FaUserShield className="text-primary" /> Actions
            </h3>
            <div className="space-y-3">
              {user?.data?.role !== 'chef' && (
                <Button
                  onClick={() => handleRequest('chef')}
                  className="w-full justify-start text-left bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:brightness-110"
                >
                  <div className="bg-white/20 p-2 rounded-lg mr-3"><FaUtensils /></div>
                  <div>
                    <div className="font-bold text-sm">Become a Chef</div>
                    <div className="text-xs opacity-80 font-normal">Start selling your meals</div>
                  </div>
                </Button>
              )}

              <Button
                onClick={() => handleRequest('admin')}
                className="w-full justify-start text-left bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 hover:brightness-110"
              >
                <div className="bg-white/20 p-2 rounded-lg mr-3"><FaUserShield /></div>
                <div>
                  <div className="font-bold text-sm">Become an Admin</div>
                  <div className="text-xs opacity-80 font-normal">Access management tools</div>
                </div>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyProfile;