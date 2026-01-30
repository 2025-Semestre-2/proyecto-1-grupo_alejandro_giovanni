import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Login.css";

function PasswordChange() {
  const navigate = useNavigate();
  const { role, id } = useParams(); // "user", "company"

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Role:", role, "ID:", id, "New password:", form.password);

    navigate("/");
  };

  return (
    <div className="loginPage">
      {/* Imagen */}
      <div className="loginImage" />

      {/* Derecha */}
      <div className="loginForm">
        <h1>Cambiar Contraseña</h1>

        <div className="formGroup">
          <label>Nueva Contraseña</label>
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="loginInput"
              placeholder="••••••••"
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

        <div className="formGroup">
          <label>Confirmar Contraseña</label>
          <div className="passwordField">
            <input
              type={showPassword2 ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="loginInput"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="togglePassword"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        <button className="buttonMain fullWidth" onClick={handleSubmit}>
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
}

export default PasswordChange;
