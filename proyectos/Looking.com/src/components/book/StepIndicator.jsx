function StepIndicator({ step }) {
  return (
    <div className="stepIndicator">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`stepCircle ${step >= n ? "active" : ""}`}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

export default StepIndicator;
