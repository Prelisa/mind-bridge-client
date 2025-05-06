import logo from "./logo.svg";
import "./App.css";
import SignUpPage from "./pages/signup/SignUpPage";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import PostEditor from "./pages/dashboard/postEditor/PostEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SearchResult from "./pages/search/SearchResult";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userDetails, setuserDetails] = useState(null);
  const processAuth = async () => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user) {
      const json = JSON.parse(user);
      let obj = jwtDecode(json);
      obj["jwt"] = json;
      console.log(obj);
      if (obj.exp <= new Date().getTime()) {
        localStorage.removeItem("user");
        setisLoggedIn(false);
      } else {
        setuserDetails(obj);
        setisLoggedIn(true);
      }
    }
  };
  useEffect(() => {
    processAuth();
    return () => {};
  }, []);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path={"/searchResult"} element={<SearchResult />} />
          {isLoggedIn ? (
            <>
              <Route element={<Navigate to='/dashboard' />} path={"/"} />
              <Route path={"/post/edit"} element={<PostEditor userDetails={userDetails} />} />
              <Route path={"/dashboard"} element={<Dashboard userDetails={userDetails} setisLoggedIn={setisLoggedIn} />} />
              <Route path={"/login"} element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route element={<Navigate to='/login' />} path={"/"} />
              <Route path={"/signUp"} element={<SignUpPage setisLoggedIn={setisLoggedIn} />} />
              <Route path={"/login"} element={<Login setisLoggedIn={setisLoggedIn} />} />
              <Route path={"/dashboard"} element={<Navigate to='/login' />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
