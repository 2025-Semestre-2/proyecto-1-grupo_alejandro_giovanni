import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useRef, useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";

import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const { userid } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("http://localhost:3001/whoamisession", {
          credentials: "include",
        });
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching session:", err);
        setSession({ loggedIn: false });
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/user-profile/${userid}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setUserProfile(data.userProfile);
        setBookings(data.bookings);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userid]);

  if (loading || !userProfile) {
    return <div>Cargando perfil...</div>;
  }

  const isOwnProfile = session?.usuarioId === userid;
  const canEditProfile = isOwnProfile || session?.role === "admin";

  const scroll = (direction) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction * width,
        behavior: "smooth",
      });
    }
  };

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
                onClick={async () => {
                  if (
                    !window.confirm(
                      "Esta acción no se puede deshacer. ¿Desea continuar?",
                    )
                  ) {
                    return;
                  }

                  try {
                    const response = await fetch(
                      `http://localhost:3001/api/cliente/${userid}`,
                      {
                        method: "DELETE",
                        credentials: "include",
                      },
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      alert(data.message || "Error al eliminar la cuenta");
                      return;
                    }

                    alert("Cuenta eliminada correctamente");
                    navigate("/");
                  } catch (error) {
                    console.error("Error deleting account:", error);
                    alert("No se pudo conectar con el servidor");
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
