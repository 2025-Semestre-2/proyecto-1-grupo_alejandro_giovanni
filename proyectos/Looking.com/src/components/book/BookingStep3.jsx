function BookingStep3({ navigate }) {
  return (
    <div className="bookingStep success">
      <h1>Pago Realizado con Éxito</h1>

      <img src="/check.png" className="checkImage" />

      <p>
        Por favor revisar correo electrónico para confirmar recibo
      </p>

      <button
        className="buttonMain"
        onClick={() => navigate(`/profile/${2}`)}
      >
        Ir a Mi Historial
      </button>
    </div>
  );
}

export default BookingStep3;
