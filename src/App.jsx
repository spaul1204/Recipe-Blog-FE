import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/Feed";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "../utils/appStore";
import NewRecipe from "./components/NewRecipe";
import RecipeDetailsCard from "./components/RecipeDetailsCard";
import EditRecipe from "./components/EditRecipe";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-recipe" element={<NewRecipe />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetailsCard />} />
            <Route
              path="/recipes/edit-recipe/:recipeId"
              element={<EditRecipe/>}
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
