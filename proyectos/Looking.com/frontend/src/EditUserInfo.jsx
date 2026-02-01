import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SignupUser.css";
import COSTA_RICA_LOCATIONS from "./data/crLocations";

function EditUserInfo() {
  const navigate = useNavigate();
  const { userid } = useParams();
  const [form, setForm] = useState(null);

  const handleSave = async () => {
  try {
    const payload = {
      ClienteId: Number(userid),

      Nombre: form.name,
      Apellido1: form.lastName1,
      Apellido2: form.lastName2 || null,
      FechaNacimiento: form.birthDate,

      TipoIdentificacionId: ID_TYPE_MAP[form.idType],
      NumeroIdentificacion: form.idNumber,

      PaisResidencia: form.country,
      IdDistrito: form.district ? Number(form.district) : null, // 👈 INT again

      Telefono1: form.phone,
      Telefono2: form.extraPhone || null,

      CorreoContacto: form.email,
    };

    const res = await fetch(
      `http://localhost:3001/clientes-update/${userid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    navigate("/");
  } catch (err) {
    console.error("Error updating client:", err);
    alert("Error al guardar los cambios");
  }
};

  const ID_TYPE_MAP = {
    "Cédula Nacional": 3,
    Pasaporte: 1,
    DIMEX: 2,
    Otro: 4,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/user-form-autofill/${userid}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();

        setForm({
          idType: "Cédula Nacional",
          idNumber: data.NumeroIdentificacion || "",
          email: data.CorreoCliente || data.CorreoUsuario || "",
          phone: data.Telefono1 || "",
          extraPhone: data.Telefono2 || "",
          name: data.Nombre || "",
          lastName1: data.Apellido1 || "",
          lastName2: data.Apellido2 || "",
          birthDate: data.FechaNacimiento
            ? data.FechaNacimiento.split("T")[0]
            : "",
          country: data.PaisResidencia || "",
          province: data.Provincia || "",
          canton: data.Canton || "",
          district: data.DistritoId ? String(data.DistritoId) : "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [userid]);

  useEffect(() => {
    setForm((prev) => (prev ? { ...prev, district: "" } : prev));
  }, [form?.canton]);

  if (!form) {
    return <div className="signupPage">Cargando información...</div>;
  }

  const isCostaRica = form.country === "Costa Rica";
  const showExtraPhone = form.phone.length > 0;

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
            setForm({
              ...form,
              country: e.target.value,
              province: "",
              canton: "",
              district: "",
            })
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
                onChange={(e) => {
                  const newCanton = e.target.value;

                  setForm((prev) => ({
                    ...prev,
                    canton: newCanton,
                    district: prev.canton === newCanton ? prev.district : "",
                  }));
                }}
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
                {COSTA_RICA_LOCATIONS.find(
                  (prov) => prov.name === form.province,
                )
                  ?.cantons.find((c) => c.name === form.canton)
                  ?.districts.map((district) => (
                    <option key={district.id} value={String(district.id)}>
                      {district.name}
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
