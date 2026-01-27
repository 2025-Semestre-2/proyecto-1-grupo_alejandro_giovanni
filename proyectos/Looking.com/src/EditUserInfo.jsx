import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SignupUser.css";
import COSTA_RICA_LOCATIONS from "./data/crLocations";

// Single mock user
const MOCK_USER = {
  idType: "Cédula Nacional",
  idNumber: "123456789",
  email: "giovanni@example.com",
  phone: "88881234",
  extraPhone: "",
  name: "Giovanni",
  lastName1: "Esquivel",
  lastName2: "Cortés",
  birthDate: "1990-05-06",
  country: "Costa Rica",
  province: "San José",
  canton: "Central",
  district: "Carmen",
};

function EditUserInfo() {
  const navigate = useNavigate();
  const { userid } = useParams(); // Will be used later for backend call
  const [form, setForm] = useState(MOCK_USER); // Autofilled immediately

  const isCostaRica = form.country === "Costa Rica";
  const showExtraPhone = form.phone.length > 0;

  const handleSave = () => {
    console.log("Saving user info:", form);
    // Replace with backend PUT request later
    navigate("/");
  };

  return (
    <div className="signupPage">
      <h1>Editar Información de Usuario</h1>

      <div className="formGroup">
        <label>Tipo de Identificación</label>
        <select
          value={form.idType}
          onChange={(e) => setForm({ ...form, idType: e.target.value })}
        >
          <option value="">Seleccione</option>
          <option>Pasaporte</option>
          <option>DIMEX</option>
          <option>Cédula Nacional</option>
          <option>Otro</option>
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
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          onChange={(e) =>
            setForm({ ...form, country: e.target.value, province: "", canton: "", district: "" })
          }
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
                setForm({ ...form, province: e.target.value, canton: "", district: "" })
              }
            >
              <option value="">Seleccione Provincia</option>
              {Object.keys(COSTA_RICA_LOCATIONS).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          {form.province && (
            <div className="formGroup">
              <label>Cantón</label>
              <select
                value={form.canton}
                onChange={(e) => setForm({ ...form, canton: e.target.value, district: "" })}
              >
                <option value="">Seleccione Cantón</option>
                {Object.keys(COSTA_RICA_LOCATIONS[form.province]).map((canton) => (
                  <option key={canton} value={canton}>
                    {canton}
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
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              >
                <option value="">Seleccione Distrito</option>
                {COSTA_RICA_LOCATIONS[form.province][form.canton].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      <button className="buttonMain fullWidth" onClick={handleSave}>
        Guardar Cambios
      </button>
    </div>
  );
}

export default EditUserInfo;
