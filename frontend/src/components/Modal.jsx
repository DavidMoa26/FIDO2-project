function Modal({ text, onClose }) {
  return (
    <div className="dialog">
      <button className="close" onClick={onClose}>
        &times;
      </button>
      <div>{text}</div>
    </div>
  );
}

export default Modal;
