import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import COSTA_RICA_LOCATIONS from "./data/crLocations";
import "./SignupUser.css";

const MOCK_COMPANY = {
  companyType: "Hotel",
  legalId: "3-101-123456",
  email: "hotelmock@example.com",
  phone: "88881234",
  phone2: "87771234",
  name: "Hotel Mockup",
  province: "San José",
  canton: "Central",
  district: "Carmen",
  neighborhood: "Barrio Central",
  exactAddress: "Avenida Central 123",
  website: "https://www.hotelmock.com",
  amenities: ["Wifi", "Piscina"],
  location: { lat: 9.9333, lng: -84.0833 },
};

function EditCompanyInfo() {
  const navigate = useNavigate();
  const { companyid } = useParams();

  const [form, setForm] = useState(MOCK_COMPANY);

  const amenitiesList = [
    "Wifi",
    "Piscina",
    "Parqueo",
    "Aire Acondicionado",
    "Cocina",
    "Lavadora",
  ];

  const addAmenity = () => setForm({ ...form, amenities: [...form.amenities, ""] });
  const updateAmenity = (index, value) => {
    const updated = [...form.amenities];
    updated[index] = value;
    setForm({ ...form, amenities: updated });
  };
  const removeAmenity = (index) =>
    setForm({ ...form, amenities: form.amenities.filter((_, i) => i !== index) });

  return (
    <div className="signupPage">
      <h1>Editar Información</h1>

      <div className="formGroup">
        <label>Tipo de Empresa</label>
        <select
          value={form.companyType}
          onChange={(e) => setForm({ ...form, companyType: e.target.value })}
        >
          <option value="">Seleccione</option>
          <option>Hotel</option>
          <option>Hostal</option>
          <option>Casa</option>
          <option>Departamento</option>
          <option>Cuarto Compartido</option>
          <option disabled>────────────</option>
          <option>Recreación</option>
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
            setForm({ ...form, province: e.target.value, canton: "", district: "" })
          }
        >
          <option value="">Seleccione Provincia</option>
          {Object.keys(COSTA_RICA_LOCATIONS).map((prov) => (
            <option key={prov}>{prov}</option>
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
              <option key={canton}>{canton}</option>
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
              <option key={district}>{district}</option>
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
            center={form.location || { lat: 9.7489, lng: -83.7534 }}
            zoom={7}
            onClick={(e) =>
              setForm({
                ...form,
                location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
              })
            }
          >
            {form.location && <Marker position={form.location} />}
          </GoogleMap>
        </LoadScript>
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
        {form.amenities.map((amenity, i) => (
          <div key={i} className="amenityRow">
            <select value={amenity} onChange={(e) => updateAmenity(i, e.target.value)}>
              <option value="">Seleccione Amenidad</option>
              {amenitiesList.map((a) => (
                <option key={a}>{a}</option>
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

      <button
        className="buttonMain fullWidth"
        onClick={() => navigate("/")}
      >
        Guardar Cambios
      </button>
    </div>
  );
}

export default EditCompanyInfo;
