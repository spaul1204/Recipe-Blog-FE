import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeRecipe } from "../../utils/recipeSlice";
import { addSingleFavoriteRecipe } from "../../utils/favoriteRecipesSlice";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { EditIcon, DeleteIcon, BackArrow, HeartIcon } from "../assets/icons";

const RecipeDetailsCard = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const recipes = useSelector((store) => store.recipe);
  console.log("recipes in recipe details", recipes);
  const recipe = recipes.filter((recipe) => recipe._id === recipeId)[0];

  console.log("recipe in recipe details", recipe);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        BASE_URL + `/recipes/delete-recipe/${recipeId}`,
        {
          withCredentials: true,
        }
      );
      dispatch(removeRecipe(recipeId));
      navigate("/");
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };

  const addFavoriteHandler = async () => {
    if (!recipe) {
      console.error("Recipe data is not available to add to favorites.");
      return;
    }
    try {
      const response = await axios.get(
        BASE_URL + `/recipes/add-to-favorites/${recipe._id}`,
        {},
        { withCredentials: true }
      );
      console.log("response in add favorite", response.data);
      if (response.data && response.data.success) {
        dispatch(addSingleFavoriteRecipe(recipe));
        console.log("Recipe added to favorites and Redux store");
      } else {
        console.warn(
          "Could not add recipe to favorites:",
          response.data.message || "No success flag in response"
        );
      }
    } catch (error) {
      console.log("Error adding recipe to favorites:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 mt-6">
      {/* Back Button */}
      <div className="w-2/3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-md gap-2"
        >
          <BackArrow />
          Back to recipes
        </button>
      </div>
      {/* Image */}
      <img
        className="w-2/3 h-[60vh] object-cover rounded-lg shadow mb-6"
        src={recipe?.recipeImageUrl}
        alt="recipe"
      />
      {/* Tags */}
      {recipe?.recipeTag && (
        <div className="w-2/3 flex flex-wrap gap-2 mb-4">
          {recipe?.recipeTag.map((tag, idx) => (
            <span
              key={idx}
              className="badge badge-primary badge-outline text-base-content"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      {/* Header: Title/Author + Edit/Delete */}
      <div className="flex w-2/3 justify-between items-center mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-base-content">
            {recipe?.recipeTitle}
          </h1>
          <p className="text-sm text-gray-400">
            By {recipe?.recipeAuthorId?.userName}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => navigate(`/recipes/edit-recipe/${recipeId}`)}
          >
            <EditIcon />
            Edit
          </button>
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={addFavoriteHandler}
          >
            <HeartIcon />
            Save this recipe
          </button>
          <button
            className="btn btn-error flex items-center gap-2"
            onClick={handleDelete}
          >
            <DeleteIcon />
            Delete
          </button>
        </div>
      </div>
      {/* Meta Info Row (styled like the image) */}
      <div className="w-2/3 bg-base-300 rounded-xl flex flex-row justify-start items-center gap-16 py-6 px-8 mb-6">
        {/* Prep Time */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 flex items-center gap-2 mb-1 text-sm">
            <svg
              className="h-6 w-6 text-orange-500"
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
            <span className="text-base">Prep Time</span>
          </span>
          <span className="text-lg font-semibold text-base-content">
            {recipe?.preparationTime} min
          </span>
        </div>
        {/* Cook Time */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 flex items-center gap-2 mb-1 text-sm">
            <svg
              className="h-6 w-6 text-orange-500"
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
            <span className="text-base">Cook Time</span>
          </span>
          <span className="text-lg font-semibold text-base-content">
            {recipe?.cookingTime} min
          </span>
        </div>
        {/* Difficulty */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 flex items-center gap-2 mb-1 text-sm">
            <svg
              className="h-6 w-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <span className="text-base">Difficulty</span>
          </span>
          <span className="text-lg font-semibold text-base-content">
            {recipe?.difficultyLevel}
          </span>
        </div>
        {/* Servings */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 flex items-center gap-2 mb-1 text-sm">
            <svg
              className="h-6 w-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-base">Servings</span>
          </span>
          <span className="text-lg font-semibold text-base-content">
            {recipe?.servings}
          </span>
        </div>
      </div>
      {/* Description */}
      <div className="w-2/3 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-base-content">
          Description
        </h2>
        <p className="text-base-content whitespace-pre-line">
          {recipe?.recipeDescription}
        </p>
      </div>
      {/* Ingredients & Instructions */}
      <div className="w-2/3 flex flex-col md:flex-row gap-8 mb-24">
        {/* Ingredients */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 text-base-content flex items-center gap-2">
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l4 2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 19V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14"
              />
            </svg>
            Ingredients
          </h2>
          <ul className="list-disc list-inside text-base-content">
            {Array.isArray(recipe?.recipeIngredients) &&
              recipe.recipeIngredients.map((ing, idx) => (
                <li key={idx} className="mb-2">
                  {ing}
                </li>
              ))}
          </ul>
        </div>
        {/* Instructions */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 text-base-content flex items-center gap-2">
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l4 2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 19V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14"
              />
            </svg>
            Instructions
          </h2>
          <ul className="list-disc pl-5 text-base-content">
            {Array.isArray(recipe?.recipeInstructions) &&
              recipe.recipeInstructions.map((step, idx) => (
                <li key={idx} className="mb-2 align-top leading-tight">
                  {step}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsCard;
