import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });

  if (token) return <Navigate to="/chat" replace />;

  const submit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: "64px auto" }}>
      <h2>Login</h2>
      <input placeholder="Email or Username" onChange={(e)=>setForm({...form, emailOrUsername: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form, password: e.target.value})} />
      <button disabled={loading} type="submit">{loading ? "..." : "Login"}</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <p>No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
