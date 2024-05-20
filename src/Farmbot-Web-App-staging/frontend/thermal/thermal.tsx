import React, { useState, useEffect } from 'react';
import { t } from '../i18next_wrapper';
import {
  DesignerPanel,
  DesignerPanelContent,
} from '../farm_designer/designer_panel';
import { Panel } from '../farm_designer/panel_header';
import './thermal.css';
import { API } from '../api/index';
import { BotState } from "../devices/interfaces";
import { validBotLocationData } from '../util/location';
import { Everything } from '../interfaces';
import { useSelector } from 'react-redux';

interface ImageData {
  id: string;
  timestamp: string;
  imageUrl: string;
  coordinates: { x: number, y: number, z: number };
}

export function Thermal() {
  const bot = useSelector((state: Everything) => state.bot);
  const { location_data } = bot.hardware;
  const position = validBotLocationData(location_data).position;


  const [imageSrc, setImageSrc] = useState<string>('');
  const [tableData, setTableData] = useState<ImageData[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
  const [loadingRGB, setLoadingRGB] = useState<string | null>(null);
  const [loadingFrequency, setLoadingFrequency] = useState<string | null>(null);

  // indexDB
  const dbName = "ThermalImages";
  const storeName = "Images";

  function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, 1);

      request.onerror = function (event) {
        if (event.target instanceof IDBRequest) {
          console.error("Database error:", event.target.error);
          reject(event.target.error);
        }
      };

      request.onupgradeneeded = function (event) {
        if (event.target instanceof IDBRequest) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        }
      };

      request.onsuccess = function (event) {
        if (event.target instanceof IDBRequest) {
          resolve(event.target.result);
        }
      };
    });
  }

  async function storeImage(id: string, base64data: string, coordinates: { x: number, y: number, z: number }): Promise<void> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put({ id, base64data, coordinates });

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function (event) {
        if (event.target instanceof IDBRequest) {
          reject(event.target.error);
        }
      };
    });
  }


  useEffect(() => {

    fetchImageBlob(); // Fetch the image only once
  }, []);

  async function loadImagesFromDB(): Promise<ImageData[]> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function (event) {
        if (event.target instanceof IDBRequest) {
          reject(event.target.error);
        }
      };
    });
  }
  async function clearDB(): Promise<void> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function (event) {
        if (event.target instanceof IDBRequest) {
          reject(event.target.error);
        }
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



  useEffect(() => {
    loadImagesFromDB().then(images => {
      setTableData(images.map((img: any) => ({
        id: img.id,
        timestamp: new Date(parseInt(img.id.replace('image_', ''))).toLocaleString(),
        imageUrl: img.base64data,
        coordinates: img.coordinates || { x: -1, y: -1, z: 1 },
      })));
    }).catch(err => console.error("Failed to load images from DB:", err));
  }, []);

  const fetchImageBlob = async (): Promise<{ base64data: string }> => {
    return new Promise((resolve, reject) => {
      const url = API.current.getImage
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      console.log(xhr);

      xhr.onload = function () {
        if (this.status === 200) {
          const reader = new FileReader();
          reader.readAsDataURL(this.response);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setImageSrc(base64data);
            resolve({ base64data });
          };
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
      setLoading(true); // Set loading state to true
      const uniqueSuffix = new Date().getTime();
      const { base64data } = await fetchImageBlob();

      const imageId = 'image_' + uniqueSuffix;
      const coordinates = {
        x: position.x ?? -1,
        y: position.y ?? -1,
        z: position.z ?? 1,
      };
      await storeImage(imageId, base64data, coordinates);
      setTableData(prevData => [...prevData, {
        id: imageId,
        timestamp: new Date(uniqueSuffix).toLocaleString(),
        imageUrl: base64data,
        coordinates
      }]);
    } catch (error) {
      console.error('Error fetching and storing image:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleDownload = async (base64Image: string, fileName: string, coordinates: { x: number, y: number, z: number }) => {
    if (!base64Image) return;
    setLoadingDownload(fileName);
    const formattedFileName = `${fileName}_(${coordinates.x},${coordinates.y},${coordinates.z}).jpeg`;
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = formattedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoadingDownload(null);
  };

  const handleDownloadRGBMatrix = async (base64Image: string, timestamp: string, coordinates: { x: number, y: number, z: number }, id: string) => {
    try {
      setLoadingRGB(id);
      const response = await fetch("http://203.101.230.232:5000/upload_image_RGB", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const formattedFileName = `${timestamp}_rgb_matrix_(${coordinates.x},${coordinates.y},${coordinates.z}).csv`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = formattedFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setLoadingRGB(null);
    }
  };

  const handleDownloadFrequencyMatrix = async (base64Image: string, timestamp: string, coordinates: { x: number, y: number, z: number }, id: string) => {
    try {
      setLoadingFrequency(id);
      const response = await fetch("http://203.101.230.232:5000/upload_image_frequency", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const formattedFileName = `${timestamp}_frequency_matrix_(${coordinates.x},${coordinates.y},${coordinates.z}).csv`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = formattedFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setLoadingFrequency(null);
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
          <img src={imageSrc} alt="Connecting...." />
        </div>

        <button
          className={`request-button ${loading ? 'disabled' : ''}`}
          onClick={fetchAndStoreImage}
          disabled={loading} // Disable the button when loading is true
        >
          {loading ? 'Please wait...' : t('Take Photo')}
        </button>
        <button id="clear_button" onClick={handleClearDB}>Clear Images</button>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('Timestamp')}</th>
              <th>{t('Coordinates')}</th>
              <th>{t('Image')}</th>
              <th>{t('Format')}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td>{row.timestamp}</td>
                <td style={{ textAlign: 'center' }}>{`(${row.coordinates.x},${row.coordinates.y},${row.coordinates.z})`}</td>
                <td>
                  <img src={row.imageUrl} alt="Request Error" style={{ width: '100px', height: 'auto' }} />
                </td>
                <td>
                  <button
                    className={`download-format-button ${loadingDownload === row.id ? 'disabled' : ''}`}
                    onClick={() => handleDownload(row.imageUrl, `${row.timestamp}_Image_${row.id}`, row.coordinates)}
                    disabled={loadingDownload === row.id}
                  >
                    {loadingDownload === row.id ? 'Please wait...' : 'Download Image'}
                  </button>
                  <button
                    className={`download-format-button ${loadingRGB === row.id ? 'disabled' : ''}`}
                    onClick={() => handleDownloadRGBMatrix(row.imageUrl, row.timestamp, row.coordinates, row.id)}
                    disabled={loadingRGB === row.id}
                  >
                    {loadingRGB === row.id ? 'Please wait...' : 'Download RGB Matrix'}
                  </button>
                  <button
                    className={`download-format-button ${loadingFrequency === row.id ? 'disabled' : ''}`}
                    onClick={() => handleDownloadFrequencyMatrix(row.imageUrl, row.timestamp, row.coordinates, row.id)}
                    disabled={loadingFrequency === row.id}
                  >
                    {loadingFrequency === row.id ? 'Please wait...' : 'Download Frequency Matrix'}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </DesignerPanelContent>
    </DesignerPanel>
  );
}
