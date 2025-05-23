import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { addSingleFavoriteRecipe } from "../../utils/favoriteRecipesSlice";
import { HeartIcon } from "../assets/icons";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    _id,
    cookingTime,
    preparationTime,
    recipeTitle,
    recipeImageUrl,
    recipeTag,
    recipeDescription,
    difficultyLevel,
  } = recipe;
  console.log("recipe tag ", recipeTag);
  // Truncate description to 10 words
  const getTruncatedDescription = (desc) => {
    if (!desc) return "";
    const words = desc.split(" ");
    if (words.length <= 10) return desc;
    return words.slice(0, 10).join(" ") + "...";
  };

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${BASE_URL}/recipes/add-to-favorites/${_id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data && response.data.success) {
        dispatch(addSingleFavoriteRecipe(recipe));
      } else {
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      className="card bg-base-300 w-70 shadow-sm h-100 mt-2 cursor-pointer"
    >
      <figure className="w-full h-45 overflow-hidden">
        <img
          src={recipeImageUrl}
          alt="recipeImage"
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <div className="flex items-start justify-between ">
          {" "}
          <h2 className="card-title">{recipeTitle}</h2>
          <div className="badge badge-secondary">{difficultyLevel}</div>
        </div>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Prep: {preparationTime} min | Cook: {cookingTime} min
        </p>
        <p>{getTruncatedDescription(recipeDescription)}</p>
        <div className="card-actions justify-end">
          {recipeTag?.map((tag, idx) => (
            <div key={idx} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
