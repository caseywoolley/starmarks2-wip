import React from 'react';
import style from './Modal.css';

const Modal = (props) => (
  <div id={style.pkt_ext_save_plate} onClick={props.onCancel}>
    <div className={style.pkt_ext_component_save} id="modal-inner-old">
      <div className={style.pkt_ext_platter} id="modal-content-old" onClick={(e) => e.stopPropagation()}>
        <div className={style.pkt_ext_save_details} onClick={(e) => e.stopPropagation()}>
        { props.children }
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
