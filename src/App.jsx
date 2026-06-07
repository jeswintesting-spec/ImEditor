import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Image as ImageIcon, Download, Settings, RefreshCw, X, Crop as CropIcon, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Wand2, Layers, Printer, Globe } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

const PRESETS = [
  { id: 'custom', name: 'Custom settings', type: 'custom' },
  { id: 'indian_passport', name: 'Indian Passport (3.5x4.5cm)', width: 413, height: 531, maxSizeKB: 50, maintainRatio: false },
  { id: 'us_visa', name: 'US Visa (2x2 inch)', width: 600, height: 600, maxSizeKB: 240, maintainRatio: false },
  { id: 'pan_card_photo', name: 'PAN Card Photo (3.5x2.5cm)', width: 413, height: 295, maxSizeKB: 50, maintainRatio: false },
  { id: 'standard_signature', name: 'Standard Signature (3x1.5cm)', width: 354, height: 177, maxSizeKB: 20, maintainRatio: false },
  { id: 'gate_signature', name: 'GATE/Exam Signature (5x1.5cm)', width: 590, height: 177, maxSizeKB: 20, maintainRatio: false },
];

function App() {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const originalImage = images[activeIndex] || null;

  const [processedImages, setProcessedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Active mode
  const [mode, setMode] = useState('dimensions'); // 'dimensions', 'compress', 'presets', 'effects'

  // Presets
  const [selectedPreset, setSelectedPreset] = useState('custom');

  // Dimensions state
  const [unit, setUnit] = useState('px'); // 'px', 'cm', 'in'
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainRatio, setMaintainRatio] = useState(true);

  // Compress state
  const [targetSizeKB, setTargetSizeKB] = useState('');

  // Effects state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [saturate, setSaturate] = useState(100);
  
  // Background Remover State
  const [removeBackground, setRemoveBackground] = useState(false);
  const [bgTolerance, setBgTolerance] = useState(200);

  // Crop state
  const [crop, setCrop] = useState(undefined);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [lockCropAspect, setLockCropAspect] = useState(false);
  
  // Format state
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [printSheetSize, setPrintSheetSize] = useState('4x6');
  
  // Stamp state
  const [stampName, setStampName] = useState('');
  const [stampDate, setStampDate] = useState('');
  const [enableStamp, setEnableStamp] = useState(false);

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const toPx = (value, currentUnit) => {
    if (!value) return 0;
    const val = parseFloat(value);
    if (currentUnit === 'in') return Math.round(val * 300);
    if (currentUnit === 'cm') return Math.round(val * 118.11);
    return Math.round(val);
  };

  const fromPx = (pxValue, targetUnit) => {
    if (!pxValue) return '';
    const val = parseFloat(pxValue);
    if (targetUnit === 'in') return (val / 300).toFixed(2);
    if (targetUnit === 'cm') return (val / 118.11).toFixed(2);
    return Math.round(val).toString();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const removeImage = (indexToRemove, e) => {
    e.stopPropagation();
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updatedImages);
    
    if (updatedImages.length === 0) {
      setActiveIndex(0);
      setProcessedImages([]);
      setCrop(undefined);
      setCompletedCrop(null);
    } else if (activeIndex >= updatedImages.length) {
      setActiveIndex(updatedImages.length - 1);
      setCrop(undefined);
      setCompletedCrop(null);
    } else if (activeIndex === indexToRemove) {
      setCrop(undefined);
      setCompletedCrop(null);
    } else if (activeIndex > indexToRemove) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    let loadedCount = 0;
    const newImages = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          newImages.push({
            file,
            url: e.target.result,
            width: img.width,
            height: img.height,
            size: file.size,
            type: file.type
          });
          loadedCount++;
          if (loadedCount === validFiles.length) {
            setImages(newImages);
            setActiveIndex(0);
            setWidth(fromPx(newImages[0].width, unit));
            setHeight(fromPx(newImages[0].height, unit));
            setProcessedImages([]);
            setBrightness(100);
            setContrast(100);
            setGrayscale(0);
            setSepia(0);
            setSaturate(100);
            setRemoveBackground(false);
            setBgTolerance(200);
            setCrop(undefined);
            setCompletedCrop(null);
            setOutputFormat(newImages[0].type === 'image/png' ? 'image/png' : 'image/jpeg');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    const currentWpx = toPx(width, unit);
    const currentHpx = toPx(height, unit);
    setUnit(newUnit);
    setWidth(fromPx(currentWpx, newUnit));
    setHeight(fromPx(currentHpx, newUnit));
  };

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (maintainRatio && originalImage && newWidth) {
      const ratio = originalImage.height / originalImage.width;
      const wPx = toPx(newWidth, unit);
      const hPx = Math.round(wPx * ratio);
      setHeight(fromPx(hPx, unit));
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    if (maintainRatio && originalImage && newHeight) {
      const ratio = originalImage.width / originalImage.height;
      const hPx = toPx(newHeight, unit);
      const wPx = Math.round(hPx * ratio);
      setWidth(fromPx(wPx, unit));
    }
  };

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset && preset.type !== 'custom') {
      setUnit('px');
      setWidth(preset.width.toString());
      setHeight(preset.height.toString());
      setMaintainRatio(preset.maintainRatio);
      setTargetSizeKB(preset.maxSizeKB.toString());
      setLockCropAspect(true); 
      if (!removeBackground) {
        setOutputFormat('image/jpeg');
      }
    } else {
      setLockCropAspect(false);
    }
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const applyTransform = async (type) => {
    if (!originalImage) return;
    
    const img = new Image();
    img.src = originalImage.url;
    await new Promise(resolve => img.onload = resolve);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let newWidth = img.width;
    let newHeight = img.height;
    
    if (type === 'rotate-right' || type === 'rotate-left') {
      canvas.width = img.height;
      canvas.height = img.width;
      newWidth = img.height;
      newHeight = img.width;
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
    }
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    if (type === 'rotate-right') {
      ctx.rotate(90 * Math.PI / 180);
    } else if (type === 'rotate-left') {
      ctx.rotate(-90 * Math.PI / 180);
    } else if (type === 'flip-h') {
      ctx.scale(-1, 1);
    } else if (type === 'flip-v') {
      ctx.scale(1, -1);
    }
    
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
    const dataUrl = canvas.toDataURL(originalImage.type, 1.0);
    const blob = dataURLtoBlob(dataUrl);
    
    const updatedImages = [...images];
    updatedImages[activeIndex] = {
      ...originalImage,
      url: dataUrl,
      width: newWidth,
      height: newHeight,
      size: blob.size
    };
    
    setImages(updatedImages);
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const compressToTargetSize = async (canvas, targetBytes, format) => {
    return new Promise((resolve) => {
      let minQ = 0.0;
      let maxQ = 1.0;
      let bestQuality = 0.5;
      let bestBlob = null;
      let bestDiff = Infinity;

      for (let i = 0; i < 10; i++) {
        const quality = (minQ + maxQ) / 2;
        const dataUrl = canvas.toDataURL(format, quality);
        const blob = dataURLtoBlob(dataUrl);
        const size = blob.size;

        const diff = Math.abs(size - targetBytes);
        if (diff < bestDiff || (size <= targetBytes && !bestBlob)) {
          bestDiff = diff;
          bestQuality = quality;
          bestBlob = blob;
          bestBlob.url = dataUrl;
        }

        if (size > targetBytes) {
          maxQ = quality; // Need lower quality
        } else {
          minQ = quality; // Can afford higher quality
        }
      }
      resolve({ blob: bestBlob, url: bestBlob.url, quality: bestQuality });
    });
  };

  const handleProcess = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const results = [];
        
        for (let i = 0; i < images.length; i++) {
          const currentImg = images[i];
          const img = new Image();
          img.src = currentImg.url;
          await new Promise((resolve) => (img.onload = resolve));

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let sourceX = 0, sourceY = 0, sourceW = img.width, sourceH = img.height;
          
          // Only apply precise crop coordinates to the currently active image where they were drawn
          if (i === activeIndex && completedCrop?.width && completedCrop?.height && imgRef.current) {
            const scaleX = img.width / imgRef.current.width;
            const scaleY = img.height / imgRef.current.height;
            sourceX = completedCrop.x * scaleX;
            sourceY = completedCrop.y * scaleY;
            sourceW = completedCrop.width * scaleX;
            sourceH = completedCrop.height * scaleY;
          }

          let targetW = sourceW;
          let targetH = sourceH;

          if (mode === 'dimensions' || mode === 'presets') {
            targetW = toPx(width, unit) || sourceW;
            targetH = toPx(height, unit) || sourceH;
          }

          canvas.width = targetW;
          canvas.height = targetH;

          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) saturate(${saturate}%)`;

          if (outputFormat === 'image/jpeg' || (!removeBackground && maintainRatio)) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (removeBackground) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          if (maintainRatio && mode !== 'effects' && mode !== 'compress') {
            const scale = Math.min(targetW / sourceW, targetH / sourceH);
            const x = (targetW / 2) - (sourceW / 2) * scale;
            const y = (targetH / 2) - (sourceH / 2) * scale;
            
            ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, x, y, sourceW * scale, sourceH * scale);
          } else {
            ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, targetW, targetH);
          }

          if (enableStamp && (stampName || stampDate)) {
             const barHeight = targetH * 0.15;
             ctx.fillStyle = '#FFFFFF';
             ctx.fillRect(0, targetH - barHeight, targetW, barHeight);
             ctx.fillStyle = '#000000';
             ctx.textAlign = 'center';
             const hasBoth = stampName && stampDate;
             const fontSize = Math.max(12, barHeight * (hasBoth ? 0.35 : 0.5));
             ctx.font = `bold ${fontSize}px sans-serif`;
             if (hasBoth) {
                ctx.fillText(stampName.toUpperCase(), targetW / 2, targetH - barHeight + (barHeight * 0.45));
                ctx.fillText(stampDate, targetW / 2, targetH - barHeight + (barHeight * 0.85));
             } else {
                ctx.textBaseline = 'middle';
                ctx.fillText(stampName ? stampName.toUpperCase() : stampDate, targetW / 2, targetH - (barHeight / 2));
                ctx.textBaseline = 'alphabetic';
             }
          }

          if (removeBackground) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const tolerance = parseInt(bgTolerance);
            for (let j = 0; j < data.length; j += 4) {
              const r = data[j];
              const g = data[j + 1];
              const b = data[j + 2];
              const a = data[j + 3];
              
              if (a > 0) { 
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                if (luminance > tolerance) {
                  data[j + 3] = 0; 
                }
              }
            }
            ctx.putImageData(imageData, 0, 0);
          }

          let dataUrl, blob, finalQuality = 0.95;
          const targetBytes = (parseFloat(targetSizeKB) || 0) * 1024;
          
          if ((mode === 'compress' || mode === 'presets') && targetBytes > 0 && outputFormat !== 'image/png') {
            const result = await compressToTargetSize(canvas, targetBytes, outputFormat);
            dataUrl = result.url;
            blob = result.blob;
            finalQuality = result.quality;
          } else {
            dataUrl = canvas.toDataURL(outputFormat, 0.95);
            blob = dataURLtoBlob(dataUrl);
          }

          results.push({
            url: dataUrl,
            width: targetW,
            height: targetH,
            size: blob.size,
            type: outputFormat,
            quality: finalQuality,
            name: currentImg.file.name
          });
        }
        
        setProcessedImages(results);

      } catch (err) {
        console.error('Error processing images:', err);
        alert('Failed to process one or more images.');
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleGeneratePrintSheet = async () => {
    if (processedImages.length === 0) return;
    const pi = processedImages[activeIndex] || processedImages[0];
    
    let sheetW, sheetH;
    switch (printSheetSize) {
      case '5x7':
        sheetW = 2100; sheetH = 1500; break;
      case 'A4':
        sheetW = 3508; sheetH = 2480; break;
      case 'Letter':
        sheetW = 3300; sheetH = 2550; break;
      case '4x6':
      default:
        sheetW = 1800; sheetH = 1200; break; // 6x4 at 300 DPI
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = sheetW;
    canvas.height = sheetH;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetW, sheetH);
    
    const img = new Image();
    img.src = pi.url;
    await new Promise(r => img.onload = r);
    
    const imgW = pi.width;
    const imgH = pi.height;
    
    const gap = 30; 
    
    const cols = Math.floor((sheetW + gap) / (imgW + gap));
    const rows = Math.floor((sheetH + gap) / (imgH + gap));
    
    if (cols === 0 || rows === 0) {
       alert("The processed image is too large to fit on a standard 4x6 print sheet.");
       return;
    }
    
    const gridW = cols * imgW + (cols - 1) * gap;
    const gridH = rows * imgH + (rows - 1) * gap;
    const startX = (sheetW - gridW) / 2;
    const startY = (sheetH - gridH) / 2;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (imgW + gap);
        const y = startY + r * (imgH + gap);
        ctx.drawImage(img, x, y, imgW, imgH);
        
        ctx.strokeStyle = '#EEEEEE';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 1, y - 1, imgW + 2, imgH + 2);
      }
    }
    
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Print_Sheet_4x6_${pi.name.replace(/\.[^/.]+$/, "")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    if (processedImages.length === 0) return;
    
    if (processedImages.length === 1) {
      const pi = processedImages[0];
      const link = document.createElement('a');
      link.href = pi.url;
      const ext = pi.type.split('/')[1] || 'jpg';
      link.download = `edited_${pi.name.replace(/\.[^/.]+$/, "")}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const zip = new JSZip();
      processedImages.forEach((pi, idx) => {
        const ext = pi.type.split('/')[1] || 'jpg';
        const base64Data = pi.url.split(',')[1];
        zip.file(`edited_${idx}_${pi.name.replace(/\.[^/.]+$/, "")}.${ext}`, base64Data, {base64: true});
      });
      const content = await zip.generateAsync({type: "blob"});
      saveAs(content, "ImEditor_Batch.zip");
    }
  };

  const applyEffectPreset = (effect) => {
    if (effect === 'normal') {
      setBrightness(100); setContrast(100); setGrayscale(0); setSepia(0); setSaturate(100);
    } else if (effect === 'bw') {
      setBrightness(100); setContrast(120); setGrayscale(100); setSepia(0); setSaturate(100);
    } else if (effect === 'high_contrast') {
      setBrightness(100); setContrast(150); setGrayscale(0); setSepia(0); setSaturate(120);
    } else if (effect === 'vintage') {
      setBrightness(90); setContrast(110); setGrayscale(0); setSepia(80); setSaturate(100);
    } else if (effect === 'document') {
      setBrightness(110); setContrast(150); setGrayscale(100); setSepia(0); setSaturate(100);
    }
  };

  const getCropAspect = () => {
    if (!lockCropAspect) return undefined;
    const w = toPx(width, unit);
    const h = toPx(height, unit);
    if (w && h) return w / h;
    return undefined;
  };

  return (
    <div className="app-container animate-fade-in">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
        <Globe size={16} color="var(--text-secondary)" />
        <select 
          value={i18n.language ? i18n.language.split('-')[0] : 'en'} 
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer' }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="hi">हिन्दी</option>
          <option value="ja">日本語</option>
          <option value="fr">Français</option>
          <option value="ml">മലയാളം</option>
        </select>
      </div>

      <header className="header">
        <h1>{t('app_title')}</h1>
        <p>{t('app_subtitle')}</p>
      </header>

      {images.length === 0 ? (
        <>
          <div 
            className={`upload-area glass-panel ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleChange}
            />
            <UploadCloud size={64} className="upload-icon" />
            <h2>{t('upload_text')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {t('upload_subtext')}
            </p>
          </div>

          <div className="info-section animate-fade-in">
            <h3 className="info-title">{t('uses_title')}</h3>
            <div className="uses-grid">
              <div className="use-card">
                <div className="use-icon-wrapper">
                  <ImageIcon size={22} />
                </div>
                <h4>{t('use_passport_title')}</h4>
                <p>{t('use_passport_desc')}</p>
              </div>

              <div className="use-card">
                <div className="use-icon-wrapper">
                  <Wand2 size={22} />
                </div>
                <h4>{t('use_sig_title')}</h4>
                <p>{t('use_sig_desc')}</p>
              </div>

              <div className="use-card">
                <div className="use-icon-wrapper">
                  <Layers size={22} />
                </div>
                <h4>{t('use_enhance_title')}</h4>
                <p>{t('use_enhance_desc')}</p>
              </div>

              <div className="use-card">
                <div className="use-icon-wrapper">
                  <Printer size={22} />
                </div>
                <h4>{t('use_print_title')}</h4>
                <p>{t('use_print_desc')}</p>
              </div>
            </div>

            <div className="privacy-banner">
              <div className="privacy-icon-wrapper">
                <Settings size={22} />
              </div>
              <div className="privacy-text">
                <h4>{t('about_title')}</h4>
                <p>{t('about_description')}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="main-content">
          <div className="preview-container">
            {images.length > 1 && (
              <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  <Layers size={16} /> Batch Pipeline ({images.length} images)
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setActiveIndex(idx); setCrop(undefined); setCompletedCrop(null); }}
                      style={{ 
                        width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                        border: activeIndex === idx ? '2px solid var(--primary-color)' : '2px solid transparent',
                        opacity: activeIndex === idx ? 1 : 0.6, flexShrink: 0, position: 'relative'
                      }}
                    >
                      <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                      <button 
                        onClick={(e) => removeImage(idx, e)}
                        style={{
                          position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', 
                          border: 'none', borderRadius: '50%', width: '16px', height: '16px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff'
                        }}
                        title="Remove image"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CropIcon size={20} /> Live Preview {images.length > 1 && `(${activeIndex + 1}/${images.length})`}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => applyTransform('rotate-left')} style={{ padding: '0.5rem' }} title="Rotate Left">
                    <RotateCcw size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => applyTransform('rotate-right')} style={{ padding: '0.5rem' }} title="Rotate Right">
                    <RotateCw size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => applyTransform('flip-h')} style={{ padding: '0.5rem' }} title="Flip Horizontally">
                    <FlipHorizontal size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => applyTransform('flip-v')} style={{ padding: '0.5rem' }} title="Flip Vertically">
                    <FlipVertical size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => { setImages([]); setProcessedImages([]); }} style={{ padding: '0.5rem', marginLeft: '0.5rem' }} title="Clear All Images">
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="image-preview" style={{ background: 'transparent' }}>
                <ReactCrop 
                  crop={crop} 
                  onChange={(_, percentCrop) => setCrop(percentCrop)} 
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={getCropAspect()}
                  style={{ maxWidth: '100%' }}
                >
                  <img 
                    ref={imgRef}
                    src={originalImage.url} 
                    alt="Original" 
                    style={{ 
                      filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) saturate(${saturate}%)`,
                      maxHeight: '400px',
                      display: 'block'
                    }}
                  />
                </ReactCrop>
              </div>
              <div className="image-info" style={{ position: 'relative', marginTop: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '6px' }}>
                  <span>{originalImage.file.name}: {originalImage.width} × {originalImage.height}</span>
                  <span>{formatBytes(originalImage.size)}</span>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="lockAspect" 
                  checked={lockCropAspect} 
                  onChange={(e) => setLockCropAspect(e.target.checked)}
                  style={{ accentColor: 'var(--primary-color)' }}
                />
                <label htmlFor="lockAspect" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                  Lock crop ratio to output dimensions
                </label>
              </div>
            </div>

            {processedImages.length > 0 && (
              <div className="glass-panel animate-fade-in" style={{ padding: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success-color)' }}>
                  <ImageIcon size={20} /> Results Ready ({processedImages.length})
                </h3>
                <div className="image-preview" style={
                  (mode === 'presets' && !maintainRatio) || removeBackground 
                  ? { background: 'repeating-conic-gradient(#fff 0% 25%, #e2e8f0 0% 50%) 50% / 20px 20px' } 
                  : {}
                }>
                  <img src={processedImages[activeIndex]?.url || processedImages[0].url} alt="Processed" style={mode === 'presets' && !maintainRatio ? { objectFit: 'fill' } : {}}/>
                  <div className="image-info">
                    <span>{processedImages[activeIndex]?.width || processedImages[0].width} × {processedImages[activeIndex]?.height || processedImages[0].height}</span>
                    <span>{formatBytes(processedImages[activeIndex]?.size || processedImages[0].size)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="controls-panel glass-panel">
            <div className="control-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3><Settings size={20} /> Processing Options</h3>
              </div>
              
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Export Format</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`btn-secondary ${outputFormat === 'image/jpeg' ? 'active' : ''}`} onClick={() => setOutputFormat('image/jpeg')} style={{ flex: 1, padding: '0.5rem', background: outputFormat === 'image/jpeg' ? 'var(--primary-color)' : '', borderColor: outputFormat === 'image/jpeg' ? 'var(--primary-color)' : '' }}>JPG</button>
                  <button className={`btn-secondary ${outputFormat === 'image/png' ? 'active' : ''}`} onClick={() => setOutputFormat('image/png')} style={{ flex: 1, padding: '0.5rem', background: outputFormat === 'image/png' ? 'var(--primary-color)' : '', borderColor: outputFormat === 'image/png' ? 'var(--primary-color)' : '' }}>PNG</button>
                  <button className={`btn-secondary ${outputFormat === 'image/webp' ? 'active' : ''}`} onClick={() => setOutputFormat('image/webp')} style={{ flex: 1, padding: '0.5rem', background: outputFormat === 'image/webp' ? 'var(--primary-color)' : '', borderColor: outputFormat === 'image/webp' ? 'var(--primary-color)' : '' }}>WEBP</button>
                </div>
                {outputFormat === 'image/png' && (mode === 'compress' || mode === 'presets') && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>* PNG files are lossless. Target size (KB) cannot be reached via compression, only by resizing.</p>
                )}
              </div>

              <div className="toggle-group" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
                <button 
                  className={`toggle-btn ${mode === 'presets' ? 'active' : ''}`}
                  onClick={() => setMode('presets')}
                  style={{ minWidth: '48%' }}
                >
                  {t('presets')}
                </button>
                <button 
                  className={`toggle-btn ${mode === 'dimensions' ? 'active' : ''}`}
                  onClick={() => setMode('dimensions')}
                  style={{ minWidth: '48%' }}
                >
                  {t('dimensions')}
                </button>
                <button 
                  className={`toggle-btn ${mode === 'compress' ? 'active' : ''}`}
                  onClick={() => setMode('compress')}
                  style={{ minWidth: '30%', flex: 1 }}
                >
                  {t('compress')}
                </button>
                <button 
                  className={`toggle-btn ${mode === 'effects' ? 'active' : ''}`}
                  onClick={() => setMode('effects')}
                  style={{ minWidth: '30%', flex: 1 }}
                >
                  {t('effects')}
                </button>
                <button 
                  className={`toggle-btn ${mode === 'stamp' ? 'active' : ''}`}
                  onClick={() => setMode('stamp')}
                  style={{ minWidth: '30%', flex: 1 }}
                >
                  {t('stamp')}
                </button>
              </div>

              {mode === 'stamp' && (
                <div className="animate-fade-in">
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Print your name and the date at the bottom of the photo (required by many official applications).
                  </p>
                  
                  <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '1rem' }}>
                    <input 
                      type="checkbox" 
                      id="enableStamp" 
                      checked={enableStamp} 
                      onChange={(e) => setEnableStamp(e.target.checked)}
                      style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }}
                    />
                    <label htmlFor="enableStamp" style={{ color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold' }}>Enable Text Stamp</label>
                  </div>

                  {enableStamp && (
                    <>
                      <div className="input-group">
                        <label>Applicant Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="e.g. JOHN DOE"
                          value={stampName}
                          onChange={(e) => setStampName(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Date of Photo</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="e.g. 01/01/2026"
                          value={stampDate}
                          onChange={(e) => setStampDate(e.target.value)}
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
                        * Note: Ensure you crop your photo leaving a little extra space at the bottom so the text bar doesn't cover your shoulders!
                      </p>
                    </>
                  )}
                </div>
              )}

              {mode === 'effects' && (
                <div className="animate-fade-in">
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Adjust intensity of effects. Great for enhancing document clarity and signatures.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={() => applyEffectPreset('normal')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', flex: 1 }}>Reset</button>
                    <button className="btn-secondary" onClick={() => applyEffectPreset('bw')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', flex: 1 }}>B&W</button>
                    <button className="btn-secondary" onClick={() => applyEffectPreset('document')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', flex: 1 }}>Doc Enhance</button>
                  </div>

                  <div className="input-group">
                    <label>Contrast ({contrast}%)</label>
                    <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  <div className="input-group">
                    <label>Brightness ({brightness}%)</label>
                    <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  <div className="input-group">
                    <label>Grayscale ({grayscale}%)</label>
                    <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  <div className="input-group">
                    <label>Saturation ({saturate}%)</label>
                    <input type="range" min="0" max="200" value={saturate} onChange={(e) => setSaturate(e.target.value)} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  
                  <div className="input-group" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary-color)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        id="removeBg" 
                        checked={removeBackground} 
                        onChange={(e) => {
                          setRemoveBackground(e.target.checked);
                          if (e.target.checked && outputFormat === 'image/jpeg') {
                            setOutputFormat('image/png'); // Force PNG for transparency
                          }
                        }}
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <label htmlFor="removeBg" style={{ fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Wand2 size={16} /> Remove Background (Make Signature Transparent)
                      </label>
                    </div>
                    {removeBackground && (
                      <div className="animate-fade-in" style={{ marginTop: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tolerance: ({bgTolerance}) - Values closer to 0 remove more</label>
                        <input type="range" min="0" max="255" value={bgTolerance} onChange={(e) => setBgTolerance(e.target.value)} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Removes pixels lighter than the selected tolerance.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {mode === 'presets' && (
                <div className="animate-fade-in">
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Select a standard format for applications. This will set exact dimensions and max file size automatically.
                  </p>
                  <div className="input-group">
                    <label>Application Type</label>
                    <select 
                      className="input-field" 
                      value={selectedPreset}
                      onChange={(e) => handlePresetSelect(e.target.value)}
                      style={{ background: 'var(--surface-color)' }}
                    >
                      {PRESETS.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedPreset !== 'custom' && (
                    <div className="preset-details" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Target Size: <b>{targetSizeKB} KB</b></p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Target Dimensions: <b>{width}px × {height}px</b></p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
                        * Note: Draw a crop box on the image to select the exact region for your passport/signature. The aspect ratio is locked automatically to match the format!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === 'dimensions' && (
                <div className="animate-fade-in">
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Adjust dimensions to scale down or increase the image size.
                  </p>
                  
                  <div className="input-group">
                    <label>Unit</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {['px', 'cm', 'in'].map((u) => (
                        <button
                          key={u}
                          onClick={() => handleUnitChange({ target: { value: u } })}
                          className={`btn-secondary ${unit === u ? 'active' : ''}`}
                          style={{ flex: 1, padding: '0.5rem', background: unit === u ? 'var(--primary-color)' : '', borderColor: unit === u ? 'var(--primary-color)' : '' }}
                        >
                          {u.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label>Width ({unit})</label>
                      <input 
                        type="number" 
                        step={unit === 'px' ? '1' : '0.01'}
                        className="input-field" 
                        value={width} 
                        onChange={handleWidthChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Height ({unit})</label>
                      <input 
                        type="number" 
                        step={unit === 'px' ? '1' : '0.01'}
                        className="input-field" 
                        value={height} 
                        onChange={handleHeightChange}
                      />
                    </div>
                  </div>
                  <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', marginTop: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      id="maintain" 
                      checked={maintainRatio} 
                      onChange={(e) => setMaintainRatio(e.target.checked)}
                      style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }}
                    />
                    <label htmlFor="maintain" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>Maintain aspect ratio when resizing</label>
                  </div>
                </div>
              )}

              {mode === 'compress' && (
                <div className="animate-fade-in">
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Set a target file size. The image will be compressed to match it as closely as possible.
                  </p>
                  <div className="input-group">
                    <label>Target Size (KB)</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder={`e.g. 50 (Current: ${(originalImage.size / 1024).toFixed(0)} KB)`}
                      value={targetSizeKB}
                      onChange={(e) => setTargetSizeKB(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="action-buttons" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <button 
                    className="btn-primary" 
                    onClick={handleProcess}
                    disabled={isProcessing || 
                      (mode === 'compress' && !targetSizeKB) || 
                      (mode === 'dimensions' && (!width || !height)) ||
                      (mode === 'presets' && selectedPreset === 'custom')}
                    style={{ flex: 1 }}
                  >
                    {isProcessing ? <div className="loader" /> : <RefreshCw size={20} />}
                    {isProcessing ? `Processing...` : (images.length > 1 ? t('apply_all') : t('apply_one'))}
                  </button>
                  
                  <button 
                    className="btn-secondary" 
                    onClick={handleDownload}
                    disabled={processedImages.length === 0}
                    style={{ opacity: processedImages.length === 0 ? 0.5 : 1, flex: 1 }}
                  >
                    <Download size={20} />
                    {processedImages.length > 1 ? t('download_zip') : t('download_button')}
                  </button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Print Sheet Layout:</label>
                    <select 
                      value={printSheetSize} 
                      onChange={(e) => setPrintSheetSize(e.target.value)}
                      style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', color: '#fff', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}
                    >
                      <option value="4x6">4" x 6" Photo</option>
                      <option value="5x7">5" x 7" Photo</option>
                      <option value="A4">A4 Document</option>
                      <option value="Letter">US Letter</option>
                    </select>
                  </div>
                  <button 
                    className="btn-secondary" 
                    onClick={handleGeneratePrintSheet}
                    disabled={processedImages.length === 0}
                    style={{ opacity: processedImages.length === 0 ? 0.5 : 1, width: '100%', padding: '0.75rem 0.5rem', fontSize: '0.875rem' }}
                    title="Generate a print sheet"
                  >
                    <Printer size={18} />
                    {t('print_sheet')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
