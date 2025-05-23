import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../utils/userSlice";

const Login = () => {
  const [email, setEmail] = useState("sneha@gmail.com");
  const [password, setPassword] = useState("sneha@123");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  //   console.log("user in login", user);

  useEffect(() => {
    if (user && user.email) {
      // Check if user is not null and has some expected property
      console.log("User updated in Redux store:", user);
      // You can also navigate from here if login was successful and user is populated
      // navigate("/");
      // However, it might be better to navigate right after dispatch if the API call was successful,
      // and rely on a route guard or redirect logic elsewhere based on the user state.
    }
  }, [user]); // This effect runs whenever the 'user' object changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("login response", response.data.data);
      dispatch(addUser(response.data.data));
      // console.log("user in login ", user); // This will likely log the old user state
      navigate("/");
    } catch (error) {
      console.log("login error", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">
          Welcome <span className="text-primary">Back</span>
        </h1>
        <p className="text-lg text-center mt-4 mb-8">
          Sign in to access your recipes and continue your culinary journey
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 input input-bordered w-full focus:outline-none h-12"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 input input-bordered w-full focus:outline-none h-12"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full btn btn-primary h-12"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
