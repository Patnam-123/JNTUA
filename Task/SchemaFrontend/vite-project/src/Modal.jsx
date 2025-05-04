// // Modal.js
// import React from 'react';
// import './Modal.css';

// const Modal = ({ children, closeModal, title }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <span className="close" onClick={closeModal}>
//           &times;
//         </span>
//         <h3>{title}</h3>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React from 'react';
import './Modal.css';

const Modal = ({ children, closeModal, title, onSubmit }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h3>{title}</h3>
        {children}
        <div className="modal-actions">
          <button onClick={onSubmit}>Submit</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
