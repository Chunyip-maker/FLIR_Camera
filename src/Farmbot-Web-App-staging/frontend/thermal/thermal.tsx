import React, { useState } from 'react';
import { t } from "../i18next_wrapper";
import { DesignerPanel, DesignerPanelContent } from '../farm_designer/designer_panel';
import { Panel } from "../farm_designer/panel_header";
import './thermal.css'; 

export function Thermal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const openModal = (imgSrc: string) => {
    setImageSrc(imgSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const imageUrl = "http://52.62.136.16:6001/api/image/current?imgformat=JPEG";

  return (
    <DesignerPanel panelName="thermal" panel={Panel.Thermal}> 
      <DesignerPanelContent panelName="thermal">
        <label>{t("Thermal imaging")}</label>
        <div className="image-container" onClick={() => openModal(imageUrl)}>
          <img src={imageUrl} alt="Thermal" />
        </div>
        <button className="request-button">take photo</button>
        <button className="download-button">download</button>
        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            <img className="modal-content" src={imageSrc} alt="Expanded view" />
          </div>
        )}
      </DesignerPanelContent>
    </DesignerPanel>
  );
}
