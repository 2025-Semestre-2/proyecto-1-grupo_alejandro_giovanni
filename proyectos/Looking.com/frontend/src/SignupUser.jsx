import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupUser.css";

import COSTA_RICA_LOCATIONS from "./data/crLocations";

function SignupUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    idType: "",
    idNumber: "",
    email: "",
    phone: "",
    extraPhone: "",
    name: "",
    lastName1: "",
    lastName2: "",
    birthDate: "",
    country: "",
    province: "",
    canton: "",
    district: "",
    password: "",
  });

  const ID_TYPES = [
    { id: 1, name: "Pasaporte" },
    { id: 2, name: "DIMEX" },
    { id: 3, name: "Cédula Nacional" },
    { id: 4, name: "Otro" },
  ];

  const isCostaRica = form.country === "Costa Rica";
  const showExtraPhone = form.phone.length > 0;

  return (
    <div className="signupPage">
      <h1>Crear una Cuenta</h1>

      <p className="signupLinks">
        ¿Ya tienes una cuenta?{" "}
        <span onClick={() => navigate("/login")}>Iniciar Sesión</span>
      </p>

      {/* Tipo Identificación */}
      <div className="formGroup">
        <label>Tipo de Identificación</label>
        <select
          value={form.idType}
          onChange={(e) => setForm({ ...form, idType: Number(e.target.value) })}
        >
          <option value="">Seleccione</option>
          {ID_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label>Identificación</label>
        <input
          type="text"
          value={form.idNumber}
          onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Correo Electrónico</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Número Telefónico</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => {
            let phone = e.target.value;

            phone = phone.replace(/[^0-9+]/g, "");

            if (phone.indexOf("+") > 0) {
              phone = phone.replace(/\+/g, "");
              phone = "+" + phone;
            }

            setForm({ ...form, phone });
          }}
          placeholder="+50612345678"
        />
      </div>

      {showExtraPhone && (
        <div className="formGroup">
          <label>Número Telefónico Adicional (Opcional)</label>
          <input
            type="tel"
            value={form.extraPhone}
            onChange={(e) => setForm({ ...form, extraPhone: e.target.value })}
          />
        </div>
      )}

      <div className="twoCol">
        <div className="formGroup">
          <label>Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="formGroup">
          <label>Primer Apellido</label>
          <input
            type="text"
            value={form.lastName1}
            onChange={(e) => setForm({ ...form, lastName1: e.target.value })}
          />
        </div>

        <div className="formGroup">
          <label>Segundo Apellido (Opcional)</label>
          <input
            type="text"
            value={form.lastName2}
            onChange={(e) => setForm({ ...form, lastName2: e.target.value })}
          />
        </div>
      </div>

      <div className="formGroup">
        <label>Fecha de Nacimiento</label>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>País de Residencia</label>
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        >
          <option value="">Seleccione</option>
          <option>Costa Rica</option>
          <option>Estados Unidos</option>
          <option>México</option>
          <option>España</option>
        </select>
      </div>

      {isCostaRica && (
        <>
          <div className="formGroup">
            <label>Provincia</label>
            <select
              value={form.province}
              onChange={(e) =>
                setForm({
                  ...form,
                  province: e.target.value,
                  canton: "",
                  district: "",
                })
              }
            >
              <option value="">Seleccione Provincia</option>
              {COSTA_RICA_LOCATIONS.map((prov) => (
                <option key={prov.id} value={prov.name}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>

          {form.province && (
            <div className="formGroup">
              <label>Cantón</label>
              <select
                value={form.canton}
                onChange={(e) =>
                  setForm({
                    ...form,
                    canton: e.target.value,
                    district: "",
                  })
                }
              >
                <option value="">Seleccione Cantón</option>
                {COSTA_RICA_LOCATIONS.find(
                  (prov) => prov.name === form.province,
                ).cantons.map((canton) => (
                  <option key={canton.id} value={canton.name}>
                    {canton.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.canton && (
            <div className="formGroup">
              <label>Distrito</label>
              <select
                value={form.district}
                onChange={(e) =>
                  setForm({ ...form, district: Number(e.target.value) })
                }
              >
                <option value="">Seleccione Distrito</option>
                {COSTA_RICA_LOCATIONS.find(
                  (prov) => prov.name === form.province,
                )
                  .cantons.find((c) => c.name === form.canton)
                  .districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </>
      )}

      <div className="formGroup">
        <label>Contraseña</label>
        <small>8 o más caracteres con letras, números y símbolos</small>

        <div className="passwordField">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

      <button
        className="buttonMain fullWidth"
        onClick={async () => {
          if (!/^\+[0-9]{8,16}$/.test(form.phone)) {
            alert(
              "Número inválido. Debe empezar con + y tener entre 8 y 16 dígitos.",
            );
            return;
          }
          try {
            const response = await fetch(
              "http://localhost:3001/crear-usuario",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: form.email,
                  password: form.password,
                  name: form.name,
                  lastName1: form.lastName1,
                  lastName2: form.lastName2,
                  birthDate: form.birthDate,
                  idType: form.idType,
                  idNumber: form.idNumber,
                  country: form.country,
                  district: form.district,
                  phone: form.phone,
                  extraPhone: form.extraPhone,
                }),
              },
            );

            const data = await response.json();

            if (data.success) {
              alert("Usuario creado correctamente");
              navigate("/login"); // redirect to login
            } else {
              alert("Error: " + data.error);
            }
          } catch (err) {
            console.error(err);
            alert("Error al crear el usuario");
          }
        }}
      >
        Crear Cuenta
      </button>
    </div>
  );
}

export default SignupUser;
