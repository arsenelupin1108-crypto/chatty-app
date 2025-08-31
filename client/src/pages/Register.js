import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  if (token) return <Navigate to="/chat" replace />;

  const submit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: "64px auto" }}>
      <h2>Register</h2>
      <input placeholder="Username" onChange={(e)=>setForm({...form, username: e.target.value})} />
      <input placeholder="Email" onChange={(e)=>setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form, password: e.target.value})} />
      <button disabled={loading} type="submit">{loading ? "..." : "Create Account"}</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
