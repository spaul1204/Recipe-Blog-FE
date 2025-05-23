import React from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../utils/userSlice";
import {
  setFavoriteRecipes,
  toggleShowOnlyFavorites,
  setFavoritesLoading,
  setFavoritesError,
} from "../../utils/favoriteRecipesSlice";
import { HeartIcon, AddIcon } from "../assets/icons";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const { showOnlyFavorites, items: favoriteItems } = useSelector(
    (store) => store.favoriteRecipes
  );
  //   console.log("user in navbar ", user);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log("error in logout", error);
    }
  };

  const getFavoriteRecipesHandler = async () => {
    dispatch(toggleShowOnlyFavorites());

    if (!showOnlyFavorites && (!favoriteItems || favoriteItems.length === 0)) {
      dispatch(setFavoritesLoading());
      try {
        const response = await axios.get(BASE_URL + "/recipes/get-favorites", {
          withCredentials: true,
        });
        dispatch(setFavoriteRecipes(response.data.favorites));
      } catch (error) {
        console.log("Error fetching favorite recipes:", error);
        dispatch(
          setFavoritesError(error.message || "Failed to fetch favorites")
        );
      }
    }
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl ml-8">
          My Recipes
        </Link>
      </div>
      {user && (
        <div className="flex gap-6 mr-8 mt-6">
          <button
            onClick={getFavoriteRecipesHandler}
            className="btn btn-ghost btn-circle"
          >
            <HeartIcon />
          </button>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Img" src={user.profileImageUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Recipes</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/new-recipe")}
          >
            <AddIcon className="h-5 w-5 mr-2" />
            Add Recipe
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
