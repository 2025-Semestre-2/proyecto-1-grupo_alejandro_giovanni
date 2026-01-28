import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./SignupUser.css";
import axios from "axios";

const MOCK_ROOM = {
  name: "Habitación Deluxe",
  description: "Habitación espaciosa con vista al jardín",
  charges: [
    { type: "Alojamiento", amount: 52000 },
    { type: "Limpieza", amount: 8000 },
  ],
  rooms: [
    { name: "101", active: true },
    { name: "102", active: false },
  ],

  beds: [
    { type: "Cama King", quantity: 1 },
    { type: "Cama Individual", quantity: 2 },
  ],
  amenities: ["Wifi", "Piscina"],
};

const CHARGE_TYPES = [
  "Alojamiento",
  "Limpieza",
  "Administrativo",
  "Servicios Básicos",
];
const BED_TYPES = ["Cama King", "Cama Queen", "Cama Individual", "Sofá Cama"];
const AMENITIES_LIST = [
  "Wifi",
  "Piscina",
  "Parqueo",
  "Aire Acondicionado",
  "Cocina",
  "Lavadora",
];

export default function EditRoomInfo() {
  const navigate = useNavigate();
  const { roomid } = useParams();
  const [form, setForm] = useState({
    ...MOCK_ROOM,
    images: [],
  });

  const addCharge = () =>
    setForm({ ...form, charges: [...form.charges, { type: "", amount: 0 }] });
  const updateCharge = (index, key, value) => {
    const updated = [...form.charges];
    if (key === "amount") value = Number(value) || 0;
    updated[index][key] = value;
    setForm({ ...form, charges: updated });
  };
  const removeCharge = (index) =>
    setForm({ ...form, charges: form.charges.filter((_, i) => i !== index) });
  const totalPrice = form.charges.reduce((sum, c) => sum + c.amount, 0);

  const addRoom = () =>
    setForm({
      ...form,
      rooms: [...form.rooms, { name: "", active: true }],
    });
  const updateRoomName = (index, value) => {
    const updated = [...form.rooms];
    updated[index].name = value;
    setForm({ ...form, rooms: updated });
  };
  const toggleRoomActive = (index) => {
    const updated = [...form.rooms];
    updated[index].active = !updated[index].active;
    setForm({ ...form, rooms: updated });
  };
  const removeRoom = (index) =>
    setForm({ ...form, rooms: form.rooms.filter((_, i) => i !== index) });

  const addBed = () =>
    setForm({ ...form, beds: [...form.beds, { type: "", quantity: 1 }] });
  const updateBed = (index, key, value) => {
    const updated = [...form.beds];
    if (key === "quantity") value = Number(value) || 0;
    updated[index][key] = value;
    setForm({ ...form, beds: updated });
  };
  const removeBed = (index) =>
    setForm({ ...form, beds: form.beds.filter((_, i) => i !== index) });
  const totalPeople = form.beds.reduce((sum, b) => sum + b.quantity, 0);

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

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Looking");

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dhs1wio5w/image/upload`,
          formData,
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }

    setForm({ ...form, images: [...form.images, ...uploadedUrls] });
  };

  return (
    <div className="signupPage">
      <h1>Editar Tipo de Cuarto</h1>

      <div className="formGroup">
        <label>Nombre</label>
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
        <label>Precio</label>
        {form.charges.map((charge, i) => (
          <div key={i} className="amenityRow">
            <select
              value={charge.type}
              onChange={(e) => updateCharge(i, "type", e.target.value)}
            >
              <option value="">Seleccione Tipo</option>
              {CHARGE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              value={charge.amount}
              onChange={(e) => updateCharge(i, "amount", e.target.value)}
              placeholder="Monto"
            />
            <button type="button" onClick={() => removeCharge(i)}>
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" className="addAmenity" onClick={addCharge}>
          <FaPlus /> Agregar Cargo
        </button>
        <p>Total: ₡{totalPrice.toLocaleString()}</p>
      </div>

      <div className="formGroup">
        <label>Cuartos</label>

        {form.rooms.map((room, i) => (
          <div key={i} className="amenityRow">
            <input
              type="text"
              value={room.name}
              onChange={(e) => updateRoomName(i, e.target.value)}
              placeholder="Identificador"
            />

            <div
              className={`roomToggle ${room.active ? "active" : ""}`}
              onClick={() => toggleRoomActive(i)}
            >
              <div className="roomToggleHandle" />
            </div>

            <button type="button" onClick={() => removeRoom(i)}>
              <FaTrash />
            </button>
          </div>
        ))}

        <button type="button" className="addAmenity" onClick={addRoom}>
          <FaPlus /> Agregar Cuarto
        </button>
      </div>

      <div className="formGroup">
        <label>Camas</label>
        {form.beds.map((b, i) => (
          <div key={i} className="amenityRow">
            <select
              value={b.type}
              onChange={(e) => updateBed(i, "type", e.target.value)}
            >
              <option value="">Seleccione Tipo de Cama</option>
              {BED_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              value={b.quantity}
              onChange={(e) => updateBed(i, "quantity", e.target.value)}
              placeholder="Cantidad"
            />
            <button type="button" onClick={() => removeBed(i)}>
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" className="addAmenity" onClick={addBed}>
          <FaPlus /> Agregar Cama
        </button>
        <p>Capacidad Total: {totalPeople} personas</p>
      </div>

      <div className="formGroup">
        <label>Amenidades</label>
        {form.amenities.map((a, i) => (
          <div key={i} className="amenityRow">
            <select
              value={a}
              onChange={(e) => updateAmenity(i, e.target.value)}
            >
              <option value="">Seleccione Amenidad</option>
              {AMENITIES_LIST.map((am) => (
                <option key={am}>{am}</option>
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
        <label>Imágenes</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="imagePreviewGrid">
          {form.images.map((url, i) => (
            <div key={i} className="imagePreview">
              <img src={url} alt={`Room ${i}`} />
              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    images: form.images.filter((_, index) => index !== i),
                  });
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="formGroup">
        <button
          className="buttonMain"
          onClick={() => navigate("/companyServices")}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
