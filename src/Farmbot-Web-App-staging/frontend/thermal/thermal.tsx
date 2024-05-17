import React, { useState, useEffect } from 'react';
import { t } from '../i18next_wrapper';
import {
  DesignerPanel,
  DesignerPanelContent,
} from '../farm_designer/designer_panel';
import { Panel } from '../farm_designer/panel_header';
import './thermal.css';
import { API } from '../api/index';

export function Thermal() {
  const [imageSrc, setImageSrc] = useState('');
  const refreshInterval = 3000;
  const [imageUrl, setImageUrl] = useState('');
  const imageUrlBase = 'http://203.101.230.232:6001/api/image/current?imgformat=JPEG';
  const [isFetching, setIsFetching] = useState(false);

  //indexDB
  const dbName = "ThermalImages";
  const storeName = "Images";

  function initDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, 1);

      request.onerror = function (event) {
        console.error("Database error:", event.target.error);
        reject(event.target.error);
      };

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
    });
  }

  async function storeImage(id, base64data) {
    const db = await initDB();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put({ id, base64data });
      
  
      request.onsuccess = function () {
        resolve(request.result);
      };
  
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }
  

  async function retrieveImage(id) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = function () {
        if (request.result) {
          resolve(request.result.blob);
        } else {
          resolve(null);
        }
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  async function clearDB() {
    const db = await initDB();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();
  
      request.onsuccess = function () {
        resolve();
      };
  
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }
  const handleClearDB = async () => {
    const userConfirmed = window.confirm("Are you sure you want to clear all data?");
    if (userConfirmed) {
      await clearDB();
      setTableData([]); // Clear the table data
      alert("All data has been cleared.");
    }
  };
  //////
  const [tableData, setTableData] = useState([]);

  // Fetch a single image on component mount
  useEffect(() => {
    const fetchImage = () => {
      const uniqueSuffix = new Date().getTime();
      const newUrl = `${imageUrlBase}&t=${uniqueSuffix}`;
      setImageUrl(newUrl);
      fetchAndStoreImage();
    };

    fetchImage(); // Fetch the image only once
  }, []);

  useEffect(() => {
    let intervalId = null;
    if (isFetching) {
      fetchAndStoreImage(); // Get and store the first image
      intervalId = setInterval(fetchAndStoreImage, refreshInterval); // Set timer to periodically grab and store images
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // clear timer
      }
    };
  }, [isFetching]); // Rerun the effect when isFetching changes

  const toggleFetching = () => {
    setIsFetching(!isFetching); // Switch crawling status
  };

  const fetchImageBlob = async () => {
    return new Promise((resolve, reject) => {
      const url = API.current.getImage
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      console.log(xhr);
      
      xhr.onload = function () {
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error('Failed to fetch image'));
        }
      };

      xhr.onerror = function () {
        reject(new Error('Network error'));
      };

      xhr.send();
    });
  };

  const fetchAndStoreImage = async () => {
    try {
      const uniqueSuffix = new Date().getTime();
      const blob = await fetchImageBlob();
      
      //After requesting the image, convert it to base64 and save it in db
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;
  
        const imageId = 'image_' + uniqueSuffix;
        await storeImage(imageId, base64data);
        setImageSrc(base64data); 
        setTableData(prevData => [...prevData, {
          id: imageId,
          timestamp: new Date(uniqueSuffix).toLocaleString(),
          imageUrl: base64data
        }]);
      };
    } catch (error) {
      console.error('Error fetching and storing image:', error);
    }
  };
  
  //Create a new function to load all images from IndexedDB
  async function loadImagesFromDB() {
    const db = await initDB();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
  
      request.onsuccess = function () {
        resolve(request.result);
      };
  
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  //Initialize table data.
  useEffect(() => {
    loadImagesFromDB().then(images => {
      setTableData(images.map(img => ({
        id: img.id,
        timestamp: new Date(parseInt(img.id.replace('image_', ''))).toLocaleString(),
        imageUrl: img.base64data
      })));
    }).catch(err => console.error("Failed to load images from DB:", err));
  }, []);
  
  
  //Download source image
  const handleDownload = async (base64Image, fileName = 'thermal_image.jpeg') => {
    if (!base64Image) return;

    const link = document.createElement('a');
    link.href = base64Image;
    link.download = fileName; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// Send Base64 image to Python server and handle CSV file download
const handleDownloadRGBMatrix = async (base64Image, timestamp) => {
  try {
    const response = await fetch("http://203.101.230.232:5000/upload_image_RGB", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });
    console.log(response);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${timestamp}_rgb_matrix.csv`;  
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to download CSV');
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};

// Send Base64 image to Python server and handle CSV file download
const handleDownloadFrequencyMatrix = async (base64Image, timestamp) => {
  try {
    const response = await fetch("http://203.101.230.232:5000/upload_image_frequency", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });
    console.log(response);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${timestamp}_frequency_matrix.csv`;  
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to download CSV');
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};

  return (
    <DesignerPanel panelName="thermal" panel={Panel.Thermal}>
      <DesignerPanelContent panelName="thermal">
        <label>{t('Thermal Camera User Web')}</label>

        <div>
          <iframe
            src="http://203.101.230.232:6001/"
            title="Embedded Page"
            id="iframe"
          />
        </div>
        <label>{t('real-time capture')}</label>
        <div className="image-container">
          <img src={imageSrc} alt="Loading...." />
        </div>

        <button
          className={`request-button ${isFetching ? 'stop' : ''}`}
          onClick={toggleFetching}
        >
          {isFetching ? 'stop' : 'start take photo'}{' '}
        </button>
        <button id="clear_button" onClick={handleClearDB}>Clear Images</button>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('Timestamp')}</th>
              <th>{t('Image')}</th>
              <th>{t('Format')}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td>{row.timestamp}</td>
                <td>
                  <img src={row.imageUrl} alt="Request Error" style={{ width: '100px', height: 'auto' }} />
                </td>                <td>
                <button onClick={() => handleDownload(row.imageUrl, `${row.timestamp}_Image_${row.id}.jpeg`)}>Download Image</button>
                <button onClick={() => handleDownloadRGBMatrix(row.imageUrl, row.timestamp)}>Download RGB Matrix</button>
                <button onClick={() => handleDownloadFrequencyMatrix(row.imageUrl, row.timestamp)}>Download Frequency Matrix</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      </DesignerPanelContent>
    </DesignerPanel>
  );
}
