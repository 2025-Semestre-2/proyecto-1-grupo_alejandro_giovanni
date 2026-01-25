import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const bookings = [
    {
      id: 1,
      roomId: 12,
      name: "Apartamento en Pococí",
      date: "7/1/2025",
      reservationNumber: 1234,
      nights: 2,
      people: 2,
      checkIn: "1 p.m.",
      vehicle: false,
      start: "7 Feb",
      end: "9 Feb",
      total: 140000,
      pricePerNight: 70000,
    },
  ];

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <section className="profilePage">
        {/* Izquierda */}
        <div className="profileLeft">
          <h2>Información</h2>

          <div className="userHeader">
            <FaUserCircle className="userIcon" />
            <span className="userName">Juan Pérez</span>
          </div>

          <div className="infoRow">
            <div>
              <small>Fecha Nacimiento</small>
              <p>12/03/1995</p>
            </div>
            <div>
              <small>Identificación</small>
              <p>1-2345-6789</p>
            </div>
            <div>
              <small>País de Residencia</small>
              <p>Costa Rica</p>
            </div>
          </div>

          <div className="infoRow">
            <div>
              <small>Correo Electrónico</small>
              <p>juan@email.com</p>
            </div>

            <div>
              <small>Teléfono</small>
              <p>+506 8888-8888</p>
            </div>

            <div>
              <small>Dirección</small>
              <div className="addressBlock">
                <p>San José</p>
                <p>Central</p>
                <p>Carmen</p>
                <p>200m norte del parque</p>
              </div>
            </div>
          </div>

          <div className="profileButtons">
            <button className="buttonMain cancel">Editar Información</button>
            <button className="buttonMain cancel">Cambiar Contraseña</button>
            <button
              className="buttonMain delete"
              onClick={() => {
                if (
                  window.confirm(
                    "Esta acción no se puede deshacer. ¿Desea continuar?",
                  )
                ) {
                  navigate("/");
                }
              }}
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>

        {/* Derecha */}
        <div className="profileRight">
          <h2>Historial de Reservas</h2>

          <div className="historyWrapper">
            <button className="arrow">◀</button>

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="historyCard"
                onClick={() => navigate(`/preview/${booking.roomId}`)}
              >
                <div className="historyImage" />

                <div className="historyInfo">
                  <h4>{booking.name}</h4>

                  <p className="muted">
                    Realizada {booking.date}
                    <br />
                    Número de Reserva: {booking.reservationNumber}
                  </p>

                  <p className="muted">
                    {booking.nights} Noches / {booking.people} Personas /
                    Llegada {booking.checkIn} /{" "}
                    {booking.vehicle ? "Con carro" : "Sin carro"}
                    <br />
                    {booking.start} - {booking.end}
                  </p>

                  <div className="priceBlock">
                    <strong>₡{booking.total.toLocaleString()}</strong>
                    <p>
                      {booking.nights} noches * ₡
                      {booking.pricePerNight.toLocaleString()}
                    </p>

                    <ul>
                      <li>- Alojamiento: ₡52,000</li>
                      <li>- Cargo de Limpieza: ₡8,000</li>
                      <li>- Servicios Básicos: ₡7,000</li>
                      <li>- Cargo Administrativo: ₡3,000</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <button className="arrow">▶</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
