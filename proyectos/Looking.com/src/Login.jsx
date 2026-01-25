import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="loginPage">
      {/* Imagen */}
      <div className="loginImage" />

      {/* Derecha */}
      <div className="loginForm">
        <h1>Iniciar Sesión</h1>

        <p className="loginLinks">
          ¿No tienes una cuenta?{" "}
          <span onClick={() => navigate("/signup-user")}>Crear Cuenta</span>
          <br />
          ¿No has registrado tu empresa?{" "}
          <span onClick={() => navigate("/register-business")}>
            Registrar Empresa
          </span>
        </p>

        <div className="formGroup">
          <label>Correo Electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="loginInput"
          />
        </div>

        <div className="formGroup">
          <label>Contraseña</label>
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="loginInput"
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

        <button className="buttonMain fullWidth" onClick={() => navigate("/")}>Iniciar Sesión</button>
      </div>
    </div>
  );
}

export default Login;
