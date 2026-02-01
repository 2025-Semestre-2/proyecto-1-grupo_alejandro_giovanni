import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import COSTA_RICA_LOCATIONS from "./data/crLocations";
import "./SignupUser.css";

const SOCIAL_MEDIA_PLATFORMS = [
  { id: 1, name: "Facebook" },
  { id: 2, name: "Instagram" },
  { id: 3, name: "WhatsApp" },
  { id: 4, name: "Twitter" },
];

const COMPANY_TYPE_NAME_TO_ID = {
  Recreación: 1,
  Hotel: 2,
  Hostal: 3,
  Casa: 4,
  Departamento: 5,
  "Cuarto Compartido": 6,
};

function EditCompanyInfo() {
  const navigate = useNavigate();
  const { companyid } = useParams();

  const [form, setForm] = useState(null);

  const amenitiesList = [
    { id: 1, name: "Wifi" },
    { id: 2, name: "Piscina" },
    { id: 3, name: "Parqueo" },
    { id: 4, name: "Aire Acondicionado" },
    { id: 5, name: "Cocina" },
    { id: 6, name: "Lavadora" },
  ];

  const addAmenity = () =>
    setForm({ ...form, amenities: [...form.amenities, ""] });

  const updateAmenity = (index, value) => {
    const updated = [...form.amenities];
    updated[index] = value;
    setForm({ ...form, amenities: updated });
  };

  const removeAmenity = (index) =>
    setForm({
      ...form,
      amenities: form.amenities.filter((_, i) => i !== index),
    });

  const addSocialMedia = () =>
    setForm({
      ...form,
      socialMedia: [...form.socialMedia, { platformId: "", url: "" }],
    });

  const updateSocialMedia = (index, key, value) => {
    const updated = [...form.socialMedia];
    updated[index][key] = value;
    setForm({ ...form, socialMedia: updated });
  };

  const removeSocialMedia = (index) =>
    setForm({
      ...form,
      socialMedia: form.socialMedia.filter((_, i) => i !== index),
    });

  useEffect(() => {
    if (!companyid) return;

    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/company-form-autofill/${companyid}`,
          { credentials: "include" },
        );

        if (!res.ok) throw new Error("Error loading company");

        const data = await res.json();

        const resolvedCompanyType =
          typeof data.companyType === "number"
            ? data.companyType
            : (COMPANY_TYPE_NAME_TO_ID[data.companyType] ?? "");

        setForm({
          companyType: resolvedCompanyType,
          legalId: data.cedulaJuridica || "",
          email: data.email || "",
          phone: data.phone || "",
          phone2: data.phone2 || "",
          name: data.name || "",

          province: data.province || "",
          canton: data.canton || "",
          district: data.district || "",

          neighborhood: data.neighborhood || "",
          exactAddress: data.exactAddress || "",
          website: data.website || "",
          amenities: data.amenities?.length ? data.amenities : [""],
          location: data.location,
          socialMedia: data.socialMedia?.length
            ? data.socialMedia
            : [{ platform: "", url: "" }],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompany();
  }, [companyid]);

  if (!form) return <p>Cargando información...</p>;

  return (
    <div className="signupPage">
      <h1>Editar Información</h1>

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
              setForm({ ...form, canton: e.target.value, district: "" })
            }
          >
            <option value="">Seleccione Cantón</option>

            {COSTA_RICA_LOCATIONS.find(
              (p) => p.name === form.province,
            )?.cantons.map((canton) => (
              <option key={canton.id} value={canton.name}>
                {canton.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {form.province && form.canton && (
        <div className="formGroup">
          <label>Distrito</label>
          <select
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          >
            <option value="">Seleccione Distrito</option>

            {COSTA_RICA_LOCATIONS.find((p) => p.name === form.province)
              ?.cantons.find((c) => c.name === form.canton)
              ?.districts.map((district) => (
                <option key={district.id} value={district.id}>
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
        {form.amenities.map((amenityId, i) => (
          <div key={i} className="amenityRow">
            <select
              value={amenityId}
              onChange={(e) => updateAmenity(i, Number(e.target.value))}
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
        <label>Redes Sociales</label>

        {form.socialMedia.map((s, i) => (
          <div key={i} className="amenityRow">
            <select
              value={s.platformId}
              onChange={(e) =>
                updateSocialMedia(i, "platformId", Number(e.target.value))
              }
            >
              <option value="">Seleccione Plataforma</option>
              {SOCIAL_MEDIA_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="url"
              placeholder="URL del perfil"
              value={s.url}
              onChange={(e) => updateSocialMedia(i, "url", e.target.value)}
            />

            <button type="button" onClick={() => removeSocialMedia(i)}>
              <FaTrash />
            </button>
          </div>
        ))}

        <button type="button" className="addAmenity" onClick={addSocialMedia}>
          <FaPlus /> Agregar Red Social
        </button>
      </div>

      <button
        className="buttonMain fullWidth"
        onClick={async () => {
          try {
            const res = await fetch(
              `http://localhost:3001/companies-update/${companyid}`,
              {
                method: "PUT",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
              },
            );

            if (!res.ok) throw new Error("Error saving company");

            navigate("/");
          } catch (err) {
            console.error(err);
            alert("Error al guardar los cambios");
          }
        }}
      >
        Guardar Cambios
      </button>
    </div>
  );
}

export default EditCompanyInfo;
