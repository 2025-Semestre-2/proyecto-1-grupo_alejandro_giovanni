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

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/change-password",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            id,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al cambiar la contraseña");
        return;
      }

      alert("Contraseña actualizada correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("No se pudo conectar con el servidor");
    }
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
