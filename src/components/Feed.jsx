import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, DIFFICULTY_LEVELS, MEAL_TYPES, TAGS } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe } from "../../utils/recipeSlice";
import RecipeCard from "./RecipeCard";
import FilterCard from "./FilterCard";
import { useNavigate } from "react-router-dom";
import { SearchIcon, FilterIcon } from "../assets/icons";
import useDebounceHook from "../../utils/customHooks/useDebounceHook";

const ITEMS_PER_PAGE = 9;

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const allRecipes = useSelector((store) => store.recipe);
  const {
    items: favoriteRecipeItems,
    showOnlyFavorites,
    status: favoriteStatus,
  } = useSelector((store) => store.favoriteRecipes);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filters, setFilters] = useState({
    mealType: "",
    difficulty: "",
    tags: [],
  });

  const debouncedSearchQuery = useDebounceHook({
    searchQuery,
    delay: 500,
  });

  // Reset current page when filters, search, or favorite view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    showOnlyFavorites,
    filters,
    debouncedSearchQuery,
    allRecipes,
    favoriteRecipeItems,
  ]);

  useEffect(() => {
    if (showOnlyFavorites) {
      setFilteredRecipes([]);
      setSearchQuery("");
      return;
    }
    if (debouncedSearchQuery) {
      searchRecipeHandler();
    } else {
      setFilteredRecipes([]);
      getRecipes();
    }
  }, [debouncedSearchQuery, showOnlyFavorites]);

  useEffect(() => {
    if (showOnlyFavorites) return;
    if (filters.mealType || filters.difficulty || filters.tags.length > 0) {
      filterRecipesHandler();
    } else if (!debouncedSearchQuery) {
      getRecipes();
    }
  }, [filters, showOnlyFavorites, debouncedSearchQuery]);

  const searchRecipeHandler = async () => {
    try {
      const response = await axios.get(BASE_URL + "/recipes/search-recipes", {
        withCredentials: true,
        params: { searchQuery: debouncedSearchQuery },
      });
      setFilteredRecipes(response?.data?.data);
    } catch (error) {
      console.log("error in searchRecipeHandler ", error);
    }
  };

  const filterRecipesHandler = async () => {
    try {
      const response = await axios.get(BASE_URL + "/recipes/get-recipes", {
        withCredentials: true,
        params: {
          mealType: filters.mealType,
          difficulty: filters.difficulty,
          tags: filters.tags.join(","),
        },
      });
      setFilteredRecipes(response?.data?.recipes);
    } catch (error) {
      console.log("error in filterRecipesHandler ", error);
    }
  };

  // Get all recipes
  const getRecipes = async () => {
    if (showOnlyFavorites) return;
    try {
      const response = await axios.get(BASE_URL + "/recipes/get-recipes", {
        withCredentials: true,
      });
      dispatch(addRecipe(response?.data?.recipes));
    } catch (error) {
      console.log("error in getRecipes ", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  useEffect(() => {
    if (!user) navigate("/login");
    if (!showOnlyFavorites) {
      getRecipes();
    }
  }, [user, showOnlyFavorites]);

  let sourceRecipesList = [];
  if (showOnlyFavorites) {
    sourceRecipesList = favoriteRecipeItems || [];
  } else if (filteredRecipes?.length > 0) {
    sourceRecipesList = filteredRecipes;
  } else {
    sourceRecipesList = allRecipes || [];
  }

  // Pagination logic
  const totalPages = Math.ceil(sourceRecipesList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecipesToDisplay = sourceRecipesList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isLoading = favoriteStatus === "loading" && showOnlyFavorites;

  return (
    <>
      <div className="flex mt-6 flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          {showOnlyFavorites ? (
            <>
              Your <span className="text-primary">Favorite</span> Recipes
            </>
          ) : (
            <>
              Discover <span className="text-primary">Delicious</span> Recipes
            </>
          )}
        </h1>
        <p className="text-lg text-center max-w-2xl mt-4 whitespace-pre-line">
          {showOnlyFavorites
            ? isLoading
              ? "Loading your favorite recipes..."
              : "Here are all the recipes you've marked as favorites!"
            : "Explore a collection of mouthwatering recipes crafted with love.\nFrom quick meals to gourmet delights, find your next culinary adventure."}
        </p>
        {!showOnlyFavorites && (
          <div className="form-control mt-8 w-full max-w-xl">
            <div className="input-group flex justify-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search for recipes..."
                className="input input-bordered w-full focus:outline-none rounded-r- h-12"
              />
              <button
                onClick={() => {
                  if (searchQuery) {
                    searchRecipeHandler();
                  } else {
                    setFilteredRecipes([]);
                    getRecipes();
                  }
                }}
                className="btn btn-primary rounded-l-none h-12"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-center mt-8">
        {!showOnlyFavorites && (
          <div className="w-64 flex-shrink-0 flex flex-col gap-2 ml-6">
            <div className="flex items-center mb-4 ml-2">
              <FilterIcon className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                className="ml-auto btn btn-xs btn-outline"
                onClick={() => {
                  setFilters({ mealType: "", difficulty: "", tags: [] });
                  setFilteredRecipes([]);
                  setSearchQuery("");
                  getRecipes();
                }}
              >
                Clear All
              </button>
            </div>
            <div className="card bg-base-300 shadow-sm mb-2 p-4">
              <FilterCard
                filterHeading="Meal Type"
                filterOptions={MEAL_TYPES}
                selectedValue={filters.mealType}
                onChange={(value) => handleFilterChange("mealType", value)}
              />
            </div>
            <div className="card bg-base-300 shadow-sm mb-2 p-4">
              <FilterCard
                filterHeading="Difficulty"
                filterOptions={DIFFICULTY_LEVELS}
                selectedValue={filters.difficulty}
                onChange={(value) => handleFilterChange("difficulty", value)}
              />
            </div>
            <div className="card bg-base-300 shadow-sm mb-2 p-4">
              <FilterCard
                filterHeading="Tags"
                filterOptions={TAGS}
                selectedValue={filters.tags}
                onChange={(value) => handleFilterChange("tags", value)}
                isMultiSelect={true}
              />
            </div>
          </div>
        )}
        <div
          className={` ${
            showOnlyFavorites ? "w-full md:w-2/3" : "w-2/3"
          } grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto mb-4`}
        >
          {isLoading && showOnlyFavorites ? (
            <p className="text-center col-span-full">Loading favorites...</p>
          ) : currentRecipesToDisplay?.length > 0 ? (
            currentRecipesToDisplay.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[30vh]">
              <h1 className="text-2xl font-semibold">
                {showOnlyFavorites
                  ? "You haven't favorited any recipes yet!"
                  : "No recipes found matching your criteria."}
              </h1>
              {showOnlyFavorites && (
                <p className="mt-2">
                  Click the heart on a recipe to add it here.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION START */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center w-full mt-8 mb-4">
          <div className="btn-group">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`btn ${
                  currentPage === page + 1 ? "btn-active" : ""
                }`}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* PAGINATION END */}
    </>
  );
};

export default Feed;
