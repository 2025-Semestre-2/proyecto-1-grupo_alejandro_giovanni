import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import { useAuth } from "./context/AuthContext";

import { FaUserCircle } from "react-icons/fa";

const generateFakeUserProfile = ({ userid }) => {
  return {
    id: userid,
    name: "Juan Pérez",
    birthDate: "12/03/1995",
    identification: "1-2345-6789",
    country: "Costa Rica",
    email: "juan@email.com",
    phone: "+506 8888-8888",
    address: {
      province: "San José",
      canton: "Central",
      district: "Carmen",
      details: "200m norte del parque",
    },
  };
};

function Profile() {
  const { userid } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

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
    {
      id: 2,
      roomId: 8,
      name: "Casa en Jacó",
      date: "10/2/2025",
      reservationNumber: 5678,
      nights: 3,
      people: 4,
      checkIn: "3 p.m.",
      vehicle: true,
      start: "10 Mar",
      end: "13 Mar",
      total: 300000,
      pricePerNight: 100000,
    },
    {
      id: 3,
      roomId: 21,
      name: "Apartamento en San José",
      date: "15/3/2025",
      reservationNumber: 9101,
      nights: 1,
      people: 1,
      checkIn: "2 p.m.",
      vehicle: false,
      start: "15 Apr",
      end: "16 Apr",
      total: 50000,
      pricePerNight: 50000,
    },
    {
      id: 4,
      roomId: 5,
      name: "Villa en Guanacaste",
      date: "20/4/2025",
      reservationNumber: 1121,
      nights: 5,
      people: 6,
      checkIn: "12 p.m.",
      vehicle: true,
      start: "20 May",
      end: "25 May",
      total: 600000,
      pricePerNight: 120000,
    },
    {
      id: 5,
      roomId: 17,
      name: "Apartamento frente al mar en Limón",
      date: "1/5/2025",
      reservationNumber: 3141,
      nights: 2,
      people: 3,
      checkIn: "2 p.m.",
      vehicle: false,
      start: "1 Jun",
      end: "3 Jun",
      total: 180000,
      pricePerNight: 90000,
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth; // scroll by visible width
      scrollRef.current.scrollBy({
        left: direction * width,
        behavior: "smooth",
      });
    }
  };

  const { session, isAdmin } = useAuth();

  const isOwnProfile = session?.userId === userid;
  const canEditProfile = isOwnProfile || isAdmin;

  const userProfile = useMemo(
    () => generateFakeUserProfile({ userid }),
    [userid],
  );

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
            <span className="userName">{userProfile.name}</span>
          </div>

          <div className="infoRow">
            <div>
              <small>Fecha Nacimiento</small>
              <p>{userProfile.birthDate}</p>
            </div>
            <div>
              <small>Identificación</small>
              <p>{userProfile.identification}</p>
            </div>
            <div>
              <small>País de Residencia</small>
              <p>{userProfile.country}</p>
            </div>
          </div>

          <div className="infoRow">
            <div>
              <small>Correo Electrónico</small>
              <p>{userProfile.email}</p>
            </div>

            <div>
              <small>Teléfono</small>
              <p>{userProfile.phone}</p>
            </div>

            <div>
              <small>Dirección</small>
              <div className="addressBlock">
                <p>{userProfile.address.province}</p>
                <p>{userProfile.address.canton}</p>
                <p>{userProfile.address.district}</p>
                <p>{userProfile.address.details}</p>
              </div>
            </div>
          </div>

          {canEditProfile && (
            <div className="profileButtons">
              <button
                className="buttonMain cancel"
                onClick={() => navigate(`/editUserInfo/${userid}`)}
              >
                Editar Información
              </button>

              <button
                className="buttonMain cancel"
                onClick={() => navigate(`/passwordChange/user/${userid}`)}
              >
                Cambiar Contraseña
              </button>

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
          )}
        </div>

        {/* Derecha */}
        <div className="profileRight">
          <h2>Historial de Reservas</h2>

          <div className="historyWrapper">
            <button className="arrow" onClick={() => scroll(-1)}>
              ◀
            </button>

            <div className="historyScroller" ref={scrollRef}>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="historyCard"
                  onClick={() =>
                    navigate(`/preview/${"rooms"}/${booking.roomId}`)
                  }
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
            </div>

            <button className="arrow" onClick={() => scroll(1)}>
              ▶
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
