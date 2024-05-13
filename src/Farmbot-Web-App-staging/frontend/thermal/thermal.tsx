import React, { useState, useEffect } from 'react'
import { t } from '../i18next_wrapper'
import {
  DesignerPanel,
  DesignerPanelContent,
} from '../farm_designer/designer_panel'
import { Panel } from '../farm_designer/panel_header'
import './thermal.css'
import { API } from '../api/index'

export function Thermal() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const refreshInterval = 3000
  const [imageUrl, setImageUrl] = useState('')
  const imageUrlBase =
    'http://203.101.230.232:6001/api/image/current?imgformat=JPEG'
  const [isFetching, setIsFetching] = useState(false)

  const openModal = (imgSrc: string) => {
    setImageSrc(imgSrc)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  // Fetch a single image on component mount
  useEffect(() => {
    const fetchImage = () => {
      const uniqueSuffix = new Date().getTime()
      const newUrl = `${imageUrlBase}&t=${uniqueSuffix}`
      setImageUrl(newUrl)
    }

    fetchImage() // Fetch the image only once
  }, [])

  useEffect(() => {
    let intervalId = null
    if (isFetching) {
      const fetchImage = () => {
        const uniqueSuffix = new Date().getTime() // Using timestamps ensures that urls are unique and avoids caching issues
        const newUrl = `${imageUrlBase}&t=${uniqueSuffix}`
        setImageUrl(newUrl)
      }

      fetchImage() // Get the first image
      intervalId = setInterval(fetchImage, refreshInterval) // Set a timer to fetch images periodically
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId) // Clear the timer
      }
    }
  }, [isFetching]) // When isFetching changes, rerun effect

  const toggleFetching = () => {
    setIsFetching(!isFetching) // switch state
  }

  const handleDownload = async () => {
    console.log(API.current.getImage, '99999')

    const url = API.current.getImage
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    xhr.onload = function () {
      if (this.status === 200) {
        const blob = new Blob([this.response], {
          type: 'image/jpeg',
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'thermal_image.jpeg' // Define the download file name
        link.style.display = 'none'

        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }
    }

    xhr.send()
  }

  return (
    <DesignerPanel panelName="thermal" panel={Panel.Thermal}>
      <DesignerPanelContent panelName="thermal">
        <label>{t('Thermal imaging')}</label>

        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            <img className="modal-content" src={imageSrc} alt="Expanded view" />
          </div>
        )}
        <div>
          <iframe
            src="http://203.101.230.232:6001/"
            title="Embedded Page"
            id="iframe"
          />
        </div>
        <div className="image-container" onClick={() => openModal(imageUrl)}>
          <img src={imageUrl} alt="Loading...." />
        </div>

        <button
          className={`request-button ${isFetching ? 'stop' : ''}`}
          onClick={toggleFetching}
        >
          {isFetching ? 'stop' : 'start take photo'}{' '}
        </button>

        <button onClick={handleDownload} className="download-button">
          download
        </button>
      </DesignerPanelContent>
    </DesignerPanel>
  )
}
