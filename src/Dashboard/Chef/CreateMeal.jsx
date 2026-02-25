import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { use, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";
import { Input, Button, Card } from "../../Components/UI";
import { FaCloudUploadAlt, FaSave, FaArrowLeft } from "react-icons/fa";

const CreateMeal = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const photoValue = watch('foodImage');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", data.foodImage[0]);

      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;
      const res = await fetch(url, { method: "POST", body: formData });
      const imgData = await res.json();

      if (!imgData.data) throw new Error("Image upload failed");

      const mealData = {
        ...data,
        price: parseFloat(data.price),
        rating: data.rating ? parseFloat(data.rating) : 0,
        foodImage: imgData.data.display_url,
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
      };

      const response = await axiosSecure.post("/dashboard/createMeals", mealData);

      if (response.data?.insertedId) {
        Swal.fire({
          title: "Success!", text: "Meal added successfully", icon: "success",
          confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
        });
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!", text: "Failed to add meal.", icon: "error",
        confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => navigate(-1)} variant="ghost" size="sm"><FaArrowLeft /> Back</Button>
        <h1 className="text-3xl font-bold">Create New Meal</h1>
      </div>

      <Card className="glass !bg-surface">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Food Name"
              placeholder="e.g. Chicken Biriyani"
              {...register("foodName", { required: "Food name is required" })}
              error={errors.foodName}
            />
            <Input
              label="Chef Name"
              value={user?.data?.displayName}
              readOnly
              {...register("chefName")}
              className="opacity-70"
            />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium text-foreground/80">Food Image</span></label>
            <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-center cursor-pointer">
              <input
                type="file"
                {...register("foodImage", { required: "Image is required" })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 text-foreground/60">
                <FaCloudUploadAlt className="text-4xl text-primary" />
                <span className="text-sm font-medium">
                  {photoValue && photoValue[0] ? photoValue[0].name : "Upload meal photo"}
                </span>
                <span className="text-xs opacity-60">JPG, PNG up to 5MB</span>
              </div>
            </div>
            {errors.foodImage && <span className="text-error text-xs mt-1">{errors.foodImage.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              type="number"
              label="Price (৳)"
              placeholder="0"
              {...register("price", { required: "Price is required" })}
              error={errors.price}
            />
            <Input
              type="number"
              label="Initial Rating"
              placeholder="0" // Default rating of 0 is fine
              {...register("rating")}
            />
            <Input
              label="Est. Delivery Time"
              placeholder="e.g. 30-45 mins"
              {...register("estimatedDeliveryTime", { required: "Time is required" })}
              error={errors.estimatedDeliveryTime}
            />
          </div>

          <Input
            label="Ingredients (comma separated)"
            placeholder="Rice, Chicken, Spices, Oil..."
            {...register("ingredients", { required: "Ingredients are required" })}
            error={errors.ingredients}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Chef Experience"
              placeholder="e.g. 5 Years"
              {...register("chefExperience", { required: "Experience is required" })}
              error={errors.chefExperience}
            />
            <Input
              label="Delivery Area"
              placeholder="e.g. Downtown, North Side"
              {...register("deliveryArea", { required: "Area is required" })}
              error={errors.deliveryArea}
            />
          </div>

          {/* Hidden fields */}
          <input type="hidden" value={user?.data?.chefId} {...register("chefId")} />
          <input type="hidden" value={user?.data?.email} {...register("userEmail")} />

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="lg" className="min-w-[200px]" disabled={isSubmitting}>
              {isSubmitting ? <span className="loading loading-spinner"></span> : <><FaSave className="mr-2" /> Save Meal</>}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateMeal;
