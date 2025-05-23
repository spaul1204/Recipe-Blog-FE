import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import { BASE_URL } from "../../constants";

const EditRecipe = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const recipe = useSelector((state) =>
    state.recipe.find((r) => r._id === recipeId)
  );

  if (!recipe) return <div>Loading...</div>;

  const initialValues = {
    recipeTitle: recipe.recipeTitle || "",
    recipeDescription: recipe.recipeDescription || "",
    recipeImageUrl: recipe.recipeImageUrl || "",
    preparationTime: recipe.preparationTime || "",
    cookingTime: recipe.cookingTime || "",
    servings: recipe.servings || "",
    difficultyLevel: recipe.difficultyLevel || "",
    recipeTag: recipe.recipeTag || "",
    recipeMealType: recipe.recipeMealType || "",
    recipeIngredients: recipe.recipeIngredients || [""],
    recipeInstructions: recipe.recipeInstructions || [""],
  };

  const handleSubmit = async (values) => {
    try {
      await axios.patch(`${BASE_URL}/recipes/edit-recipe/${recipeId}`, values, {
        withCredentials: true,
      });
      navigate(`/recipes/${recipeId}`);
    } catch (error) {
      alert("Error updating recipe");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="w-2/3 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost mt-6 btn-md gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to recipe details
        </button>
      </div>
      <div className="max-w-2xl my-6 mx-auto p-8 bg-base-200 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Recipe</h2>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form className="flex flex-col gap-4">
              <label className="font-semibold" htmlFor="recipeTitle">
                Recipe Title
              </label>
              <Field
                id="recipeTitle"
                name="recipeTitle"
                className="input input-bordered w-full"
                placeholder="Recipe Title"
              />
              <label className="font-semibold" htmlFor="recipeDescription">
                Description
              </label>
              <Field
                id="recipeDescription"
                name="recipeDescription"
                as="textarea"
                className="textarea textarea-bordered w-full"
                placeholder="Description"
              />
              <label className="font-semibold" htmlFor="recipeImageUrl">
                Image URL
              </label>
              <Field
                id="recipeImageUrl"
                name="recipeImageUrl"
                className="input input-bordered w-full"
                placeholder="Image URL"
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-semibold" htmlFor="preparationTime">
                    Prep Time (min)
                  </label>
                  <Field
                    id="preparationTime"
                    name="preparationTime"
                    className="input input-bordered w-full"
                    placeholder="Prep Time (min)"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold" htmlFor="cookingTime">
                    Cook Time (min)
                  </label>
                  <Field
                    id="cookingTime"
                    name="cookingTime"
                    className="input input-bordered w-full"
                    placeholder="Cook Time (min)"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-semibold" htmlFor="servings">
                    Servings
                  </label>
                  <Field
                    id="servings"
                    name="servings"
                    className="input input-bordered w-full"
                    placeholder="Servings"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold" htmlFor="difficultyLevel">
                    Difficulty
                  </label>
                  <Field
                    as="select"
                    id="difficultyLevel"
                    name="difficultyLevel"
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Field>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-semibold" htmlFor="recipeTag">
                    Tags
                  </label>
                  <Field
                    id="recipeTag"
                    name="recipeTag"
                    className="input input-bordered w-full"
                    placeholder="Tags (comma separated)"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold" htmlFor="recipeMealType">
                    Meal Type
                  </label>
                  <Field
                    as="select"
                    id="recipeMealType"
                    name="recipeMealType"
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Meal Type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snack">Snack</option>
                    <option value="Dinner">Dinner</option>
                  </Field>
                </div>
              </div>
              {/* Ingredients */}
              <div>
                <label className="font-semibold">Ingredients</label>
                <FieldArray name="recipeIngredients">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-2 mt-2">
                      {values.recipeIngredients.map((_, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Field
                            name={`recipeIngredients[${idx}]`}
                            className="input input-bordered w-full"
                            placeholder={`Ingredient ${idx + 1}`}
                          />
                          {values.recipeIngredients.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-error btn-xs"
                              onClick={() => remove(idx)}
                            >
                              -
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline btn-primary btn-sm mt-2"
                        onClick={() => push("")}
                      >
                        Add Ingredient
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              {/* Instructions */}
              <div>
                <label className="font-semibold">Instructions</label>
                <FieldArray name="recipeInstructions">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-2 mt-2">
                      {values.recipeInstructions.map((_, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Field
                            name={`recipeInstructions[${idx}]`}
                            className="input input-bordered w-full"
                            placeholder={`Step ${idx + 1}`}
                          />
                          {values.recipeInstructions.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-error btn-xs"
                              onClick={() => remove(idx)}
                            >
                              -
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline btn-primary btn-sm mt-2"
                        onClick={() => push("")}
                      >
                        Add Instruction
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="btn btn-primary">
                  Update Recipe
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(`/recipes/${recipeId}`)}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditRecipe;
