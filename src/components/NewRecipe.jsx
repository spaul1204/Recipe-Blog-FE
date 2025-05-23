import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialValues = {
  recipeTitle: "",
  recipeDescription: "",
  recipeImageUrl: "",
  preparationTime: "",
  cookingTime: "",
  servings: "",
  difficultyLevel: "",
  recipeTag: [],
  recipeMealType: "",
  recipeIngredients: [""],
  recipeInstructions: [""],
};

const TAG_OPTIONS = [
  "Vegan",
  "Vegetarian",
  "Non-Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Calorie",
  "High-Protein",
  "Quick Meal",
  "Healthy",
];

const NewRecipe = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [currentTagSelection, setCurrentTagSelection] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        ...values,
        recipeTag: Array.isArray(values.recipeTag) ? values.recipeTag : [],
        recipeAuthorId: user?._id,
      };
      console.log("Submitting payload:", payload);
      const response = await axios.post(
        BASE_URL + "/recipes/add-recipe",
        payload,
        {
          withCredentials: true,
        }
      );
      console.log("Recipe creation response:", response.data);
      resetForm();
      setCurrentTagSelection("");
      navigate("/");
    } catch (error) {
      console.error(
        "create recipe error ",
        error.response ? error.response.data : error.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-base-200 rounded shadow">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-md gap-2"
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
          Back to recipes
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Recipe</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, isSubmitting, setFieldValue }) => (
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
                <label
                  className="font-semibold mb-1 block"
                  htmlFor="preparationTime"
                >
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
                <label
                  className="font-semibold mb-1 block"
                  htmlFor="cookingTime"
                >
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
                <label className="font-semibold mb-1 block" htmlFor="servings">
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
                <label
                  className="font-semibold mb-1 block"
                  htmlFor="difficultyLevel"
                >
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
            <div>
              <label className="font-semibold mb-1 block">Tags</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {Array.isArray(values.recipeTag) &&
                  values.recipeTag.map((tag, index) => (
                    <div
                      key={index}
                      className="badge badge-primary badge-lg gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-circle"
                        onClick={() => {
                          const newTags = [...values.recipeTag];
                          newTags.splice(index, 1);
                          setFieldValue("recipeTag", newTags);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={currentTagSelection}
                  onChange={(e) => setCurrentTagSelection(e.target.value)}
                  className="select select-bordered flex-grow"
                >
                  <option value="">Select a tag</option>
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (
                      currentTagSelection &&
                      !values.recipeTag.includes(currentTagSelection)
                    ) {
                      setFieldValue("recipeTag", [
                        ...values.recipeTag,
                        currentTagSelection,
                      ]);
                      setCurrentTagSelection("");
                    }
                  }}
                  disabled={!currentTagSelection}
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label
                className="font-semibold mb-1 block"
                htmlFor="recipeMealType"
              >
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
            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Recipe"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewRecipe;
