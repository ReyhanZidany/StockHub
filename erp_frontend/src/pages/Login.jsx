import { useState, useContext } from "react";
import { login as loginApi } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await loginApi(email, password);
    login(res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={submit}>
      <h2>ERP Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
