import { useState } from "react";

function PurchaseModal({ isOpen, onClose, onPurchase }) {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Buy Insurance</h2>

        <input
          type="number"
          placeholder="Enter amount ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => {
              onPurchase(amount);
              onClose();
            }}
            style={btnStyle}
          >
            Confirm
          </button>

          <button onClick={onClose} style={cancelStyle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseModal;

/* 🔥 Styles */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "300px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
};

const btnStyle = {
  background: "#2D6A4F",
  color: "white",
  padding: "10px",
  marginRight: "10px",
};

const cancelStyle = {
  background: "gray",
  color: "white",
  padding: "10px",
};