import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Por favor ingrese correo y contraseña");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciales inválidas");
        return;
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="loginPage">
      {/* Imagen */}
      <div className="loginImage" />

      {/* Derecha */}
      <div className="loginForm">
        <h1>Iniciar Sesión</h1>

        <p className="loginLinks">
          ¿No tienes una cuenta?{" "}
          <span onClick={() => navigate("/signupUser")}>Crear Cuenta</span>
          <br />
          ¿No has registrado tu empresa?{" "}
          <span onClick={() => navigate("/signupCompany")}>
            Registrar Empresa
          </span>
        </p>

        {error && <p className="errorMessage">{error}</p>}

        <div className="formGroup">
          <label>Correo Electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="loginInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="formGroup">
          <label>Contraseña</label>
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="loginInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="togglePassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        <button className="buttonMain fullWidth" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

export default Login;
