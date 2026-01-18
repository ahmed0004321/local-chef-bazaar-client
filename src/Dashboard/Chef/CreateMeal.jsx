import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { use } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";

const CreateMeal = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // get image file
      const imageFile = data.foodImage[0];

      // prepare formData
      const formData = new FormData();
      formData.append("image", imageFile);

      // upload to imgbb
      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;
      const res = await fetch(url, { method: "POST", body: formData });
      const imgData = await res.json();
      const imageUrl = imgData.data.display_url;

      // convert price and rating to float
      const price = parseFloat(data.price);
      const rating = data.rating ? parseFloat(data.rating) : 0;

      const mealData = {
        ...data,
        price,
        rating,
        foodImage: imageUrl,
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
      };

      console.log(mealData);
      const response = await axiosSecure.post(
        "/dashboard/createMeals",
        mealData,
      );

      if (response.data?.insertedId) {
        // success alert
        Swal.fire({
          title: "Success!",
          text: "Meal added successfully",
          icon: "success",
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#fff",
        });

        console.log(
          "Meal added successfully with ID:",
          response.data.insertedId,
        );
        navigate(-1); // optional: go back after adding
      }
    } catch (error) {
      console.error(error);

      // error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to add meal. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#fff",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-300"
      >
        ← Back
      </button>

      <div className="w-full max-w-2xl backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Create New Meal
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Food Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Food Name
            </label>
            <input
              type="text"
              {...register("foodName", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="Chicken Biriyani"
            />
            {errors.foodName && (
              <p className="text-red-300 text-sm mt-1">Food name is required</p>
            )}
          </div>

          {/* Chef Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Chef Name
            </label>
            <input
              type="text"
              readOnly
              defaultValue={user?.data?.displayName}
              {...register("chefName", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="Chef Rahim"
            />
          </div>

          {/* Food Image */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Food Image
            </label>
            <input
              type="file"
              {...register("foodImage", { required: true })}
              className="
                w-full
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-lg
                file:border-0
                file:text-sm
                file:font-semibold
                file:bg-white
                file:text-purple-600
                bg-white/20
                text-white
                rounded-lg
                border
                border-white/30
                cursor-pointer
                hover:bg-white/30
                transition
              "
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="250"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Rating
            </label>
            <input
              type="number"
              {...register("rating")}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="0"
            />
          </div>

          {/* Estimated Delivery Time */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Estimated Delivery Time
            </label>
            <input
              type="text"
              {...register("estimatedDeliveryTime", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="30 minutes"
            />
          </div>

          {/* Ingredients */}
          <div className="md:col-span-2">
            <label className="block text-white text-sm font-medium mb-2">
              Ingredients
            </label>
            <input
              type="text"
              {...register("ingredients", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="Chicken, Rice, Spices"
            />
          </div>

          {/* Chef Experience */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Chef’s Experience
            </label>
            <input
              type="text"
              {...register("chefExperience", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="5 years"
            />
          </div>

          {/* Chef ID */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Chef ID
            </label>
            <input
              type="text"
              defaultValue={user?.data?.chefId}
              readOnly
              {...register("chefId", { required: true })}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white/70"
            />
          </div>

          {/* User Email */}
          <div className="md:col-span-2">
            <label className="block text-white text-sm font-medium mb-2">
              User Email
            </label>
            <input
              type="email"
              {...register("userEmail", { required: true })}
              value={user?.data?.email}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white/70"
            />
          </div>
          {/* Delivery Area */}
          <div className="md:col-span-2">
            <label className="block text-white text-sm font-medium mb-2">
              Delivery Area
            </label>
            <input
              type="text"
              {...register("deliveryArea", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              placeholder="Enter delivery area"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition duration-300"
            >
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeal;
