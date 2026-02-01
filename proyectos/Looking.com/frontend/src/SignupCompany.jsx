import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import COSTA_RICA_LOCATIONS from "./data/crLocations";
import "./SignupUser.css";

function SignupCompany() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    companyType: "",
    legalId: "",
    email: "",
    phone: "",
    phone2: "",
    name: "",
    province: "",
    canton: "",
    district: "",
    neighborhood: "",
    exactAddress: "",
    website: "",
    password: "",
    amenities: [],
    location: null,
  });

  const amenitiesList = [
    { id: 1, name: "Wifi" },
    { id: 2, name: "Piscina" },
    { id: 3, name: "Parqueo" },
    { id: 4, name: "Aire Acondicionado" },
    { id: 5, name: "Cocina" },
    { id: 6, name: "Lavadora" },
  ];

  const addAmenity = () => {
    setForm((prev) => ({
      ...prev,
      amenities: [...prev.amenities, ""],
    }));
  };

  const updateAmenity = (index, value) => {
    setForm((prev) => {
      const newAmenities = [...prev.amenities];
      newAmenities[index] = value;
      return { ...prev, amenities: newAmenities };
    });
  };

  const removeAmenity = (index) => {
    setForm((prev) => {
      const newAmenities = [...prev.amenities];
      newAmenities.splice(index, 1);
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3001/registrar-empresa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");

      alert("Empresa registrada exitosamente!");
      navigate("/");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="signupPage">
      <h1>Registrar Empresa</h1>

      <div className="signupLinks">
        ¿Ya registraste tu empresa?{" "}
        <span onClick={() => navigate("/login")}>Iniciar Sesión</span>
      </div>

      <div className="formGroup">
        <label>Tipo de Empresa</label>

        <select
          value={form.companyType}
          onChange={(e) =>
            setForm({ ...form, companyType: parseInt(e.target.value) })
          }
        >
          <option value="">Seleccione</option>

          <option value={1}>Recreación</option>
          <option disabled>────────────</option>
          <option value={2}>Hotel</option>
          <option value={3}>Hostal</option>
          <option value={4}>Casa</option>
          <option value={5}>Departamento</option>
          <option value={6}>Cuarto Compartido</option>
        </select>
      </div>

      <div className="formGroup">
        <label>Cédula Jurídica</label>
        <input
          type="text"
          value={form.legalId}
          onChange={(e) => setForm({ ...form, legalId: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Correo</label>
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

      {form.phone && (
        <div className="formGroup">
          <label>Número Telefónico Adicional</label>
          <input
            type="tel"
            value={form.phone2}
            onChange={(e) => setForm({ ...form, phone2: e.target.value })}
          />
        </div>
      )}

      <div className="formGroup">
        <label>Nombre de la Empresa</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

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
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          >
            <option value="">Seleccione Distrito</option>
            {COSTA_RICA_LOCATIONS.find((prov) => prov.name === form.province)
              .cantons.find((c) => c.name === form.canton)
              .districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className="formGroup">
        <label>Barrio</label>
        <input
          type="text"
          value={form.neighborhood}
          onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Dirección Exacta</label>
        <input
          type="text"
          value={form.exactAddress}
          onChange={(e) => setForm({ ...form, exactAddress: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Ubicación Geográfica</label>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "250px" }}
            center={{ lat: 9.7489, lng: -83.7534 }}
            zoom={7}
            onClick={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();

              setForm((prevForm) => ({
                ...prevForm,
                location: { lat, lng },
              }));
            }}
          >
            {form.location && <Marker position={form.location} />}
          </GoogleMap>
        </LoadScript>

        {form.location && (
          <div className="coordinates" style={{ marginTop: "8px" }}>
            <strong>Latitud:</strong> {form.location.lat.toFixed(6)} |{" "}
            <strong>Longitud:</strong> {form.location.lng.toFixed(6)}
          </div>
        )}
      </div>

      <div className="formGroup">
        <label>Enlace Sitio Web (Opcional)</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Amenidades</label>

        {form.amenities.map((amenityId, i) => (
          <div key={i} className="amenityRow">
            <select
              value={amenityId}
              onChange={(e) => updateAmenity(i, e.target.value)}
            >
              <option value="">Seleccione Amenidad</option>
              {amenitiesList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => removeAmenity(i)}>
              <FaTrash />
            </button>
          </div>
        ))}

        <button type="button" className="addAmenity" onClick={addAmenity}>
          <FaPlus /> Agregar Amenidad
        </button>
      </div>

      <div className="formGroup">
        <label>Contraseña</label>
        <small>8 o más caracteres con letras, números y símbolos</small>

        <div className="passwordField">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

      <button className="buttonMain fullWidth" onClick={handleRegister}>
        Registrar
      </button>
    </div>
  );
}

export default SignupCompany;
