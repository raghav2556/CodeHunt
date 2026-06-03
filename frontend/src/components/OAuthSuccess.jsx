import { useEffect } from "react";

import { useNavigate } from "react-router-dom";



export default function OAuthSuccess() {



  const navigate = useNavigate();



useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const token = params.get("token");
  const username = params.get("username");

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    window.location.href = "/dashboard";
  }
}, []);


  return <p>Signing you in...</p>;

}