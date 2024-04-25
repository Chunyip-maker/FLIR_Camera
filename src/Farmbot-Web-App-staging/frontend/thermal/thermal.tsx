import React, { useState,useEffect } from 'react';
import { t } from "../i18next_wrapper";
import { DesignerPanel, DesignerPanelContent } from '../farm_designer/designer_panel';
import { Panel } from "../farm_designer/panel_header";
import './thermal.css'; 


export function Thermal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const refreshInterval = 3000;
  const [imageUrl, setImageUrl] = useState('');
  const imageUrlBase = 'http://13.56.61.23:6001/api/image/current?imgformat=JPEG';
  const [isFetching, setIsFetching] = useState(false); 

  const openModal = (imgSrc: string) => {
    setImageSrc(imgSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

    // Fetch a single image on component mount
  useEffect(() => {
    const fetchImage = () => {
      const uniqueSuffix = new Date().getTime();
      const newUrl = `${imageUrlBase}&t=${uniqueSuffix}`;
      setImageUrl(newUrl);
    };
  
    fetchImage(); // Fetch the image only once
  }, []); 

    
  useEffect(() => {
    let intervalId = null;
    if (isFetching) {
        const fetchImage = () => {
            const uniqueSuffix = new Date().getTime(); // Using timestamps ensures that urls are unique and avoids caching issues
            const newUrl = `${imageUrlBase}&t=${uniqueSuffix}`;
            setImageUrl(newUrl);
        };

        fetchImage(); // Get the first image
        intervalId = setInterval(fetchImage, refreshInterval); // Set a timer to fetch images periodically
    }

    return () => {
        if (intervalId) {
            clearInterval(intervalId); // Clear the timer
        }
    };
}, [isFetching]); // When isFetching changes, rerun effect


  const toggleFetching = () => {
    setIsFetching(!isFetching); // switch state
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'thermal_image.jpeg';  // Define the download file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

  return (
    <DesignerPanel panelName="thermal" panel={Panel.Thermal}> 
      <DesignerPanelContent panelName="thermal">
        <label>{t("Thermal imaging")}</label>
        <div className="image-container" onClick={() => openModal(imageUrl)}>
          <img src={imageUrl} alt="Loading...." />
        </div>

        <button className={`request-button ${isFetching ? 'stop' : ''}`} onClick={toggleFetching}>
          {isFetching ? 'stop' : 'start take photo'} </button>

        <button className="download-button" onClick={handleDownload}>download</button>
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