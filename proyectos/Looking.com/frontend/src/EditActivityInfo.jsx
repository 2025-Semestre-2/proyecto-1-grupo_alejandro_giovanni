import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./SignupUser.css";
import axios from "axios";

const MOCK_ACTIVITY = {
  name: "Kayak en Río Pacuare",
  description: "Actividad emocionante en el río Pacuare",
  contactPerson: "Juan Pérez",
  price: 45000,
  activityTypes: ["Kayaking"],
  image: "",
};

const ACTIVITY_TYPES = [
  "Kayaking",
  "Caminata",
  "Canopy",
  "Rafting",
  "Tour Cultural",
  "Buceo",
];

export default function EditActivityInfo() {
  const navigate = useNavigate();
  const { activityid } = useParams();
  const [form, setForm] = useState(MOCK_ACTIVITY);

  const addActivityType = () =>
    setForm({ ...form, activityTypes: [...form.activityTypes, ""] });
  const updateActivityType = (index, value) => {
    const updated = [...form.activityTypes];
    updated[index] = value;
    setForm({ ...form, activityTypes: updated });
  };
  const removeActivityType = (index) =>
    setForm({
      ...form,
      activityTypes: form.activityTypes.filter((_, i) => i !== index),
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Looking");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dhs1wio5w/image/upload`,
        formData
      );
      setForm({ ...form, image: res.data.secure_url });
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <div className="signupPage">
      <h1>Editar Actividad</h1>

      <div className="formGroup">
        <label>Nombre de la Actividad</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Descripción</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Persona de Contacto</label>
        <input
          type="text"
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
        />
      </div>

      <div className="formGroup">
        <label>Precio</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) || 0 })
          }
          placeholder="₡"
        />
      </div>

      <div className="formGroup">
        <label>Tipo de Actividad</label>
        {form.activityTypes.map((type, i) => (
          <div key={i} className="amenityRow">
            <select
              value={type}
              onChange={(e) => updateActivityType(i, e.target.value)}
            >
              <option value="">Seleccione Tipo</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button type="button" onClick={() => removeActivityType(i)}>
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" className="addAmenity" onClick={addActivityType}>
          <FaPlus /> Agregar Tipo
        </button>
      </div>

      <div className="formGroup">
        <label>Foto</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {form.image && (
          <div className="imagePreviewGrid">
            <div className="imagePreview">
              <img src={form.image} alt="Actividad" />
              <button
                type="button"
                onClick={() => setForm({ ...form, image: "" })}
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="formGroup">
        <button
          className="buttonMain"
          onClick={() => navigate("/companyActivities")}
        >
          Confirmar Cambios
        </button>
      </div>
    </div>
  );
}
