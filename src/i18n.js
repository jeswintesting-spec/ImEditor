import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      "app_title": "ImEditor",
      "app_subtitle": "Pro Document Preparation",
      "upload_text": "Drag & drop photos here, or click to browse",
      "upload_subtext": "Supports JPG, PNG, WEBP (Max 5MB)",
      "apply_button": "Apply",
      "apply_all": "Apply to All Images",
      "apply_one": "Apply to Image",
      "download_button": "Download",
      "download_zip": "Download ZIP",
      "print_sheet": "Print Sheet",
      "language": "Language",
      "dimensions": "Dimensions",
      "compress": "Compress",
      "effects": "Effects",
      "stamp": "Stamp",
      "presets": "App Presets"
    }
  },
  es: {
    translation: {
      "app_title": "ImEditor",
      "app_subtitle": "Preparación Profesional de Documentos",
      "upload_text": "Arrastra y suelta fotos aquí, o haz clic para buscar",
      "upload_subtext": "Soporta JPG, PNG, WEBP (Máx 5MB)",
      "apply_button": "Aplicar",
      "apply_all": "Aplicar a todas las imágenes",
      "apply_one": "Aplicar a la imagen",
      "download_button": "Descargar",
      "download_zip": "Descargar ZIP",
      "print_sheet": "Imprimir Hoja",
      "language": "Idioma",
      "dimensions": "Dimensiones",
      "compress": "Comprimir",
      "effects": "Efectos",
      "stamp": "Sello",
      "presets": "Preajustes"
    }
  },
  hi: {
    translation: {
      "app_title": "ImEditor",
      "app_subtitle": "प्रो दस्तावेज़ तैयारी",
      "upload_text": "तस्वीरें यहाँ खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
      "upload_subtext": "समर्थन JPG, PNG, WEBP (अधिकतम 5MB)",
      "apply_button": "लागू करें",
      "apply_all": "सभी छवियों पर लागू करें",
      "apply_one": "छवि पर लागू करें",
      "download_button": "डाउनलोड",
      "download_zip": "ज़िप डाउनलोड करें",
      "print_sheet": "प्रिंट शीट",
      "language": "भाषा",
      "dimensions": "आयाम",
      "compress": "संपीड़ित करें",
      "effects": "प्रभाव",
      "stamp": "मोहर",
      "presets": "प्रीसेट"
    }
  },
  ja: {
    translation: {
      "app_title": "ImEditor",
      "app_subtitle": "プロフェッショナルなドキュメント作成",
      "upload_text": "ここに写真をドラッグ＆ドロップ、またはクリックして参照",
      "upload_subtext": "JPG、PNG、WEBPをサポート（最大5MB）",
      "apply_button": "適用",
      "apply_all": "すべての画像に適用",
      "apply_one": "画像に適用",
      "download_button": "ダウンロード",
      "download_zip": "ZIPをダウンロード",
      "print_sheet": "シートを印刷",
      "language": "言語",
      "dimensions": "寸法",
      "compress": "圧縮",
      "effects": "エフェクト",
      "stamp": "スタンプ",
      "presets": "プリセット"
    }
  },
  fr: {
    translation: {
      "app_title": "ImEditor",
      "app_subtitle": "Préparation Professionnelle de Documents",
      "upload_text": "Glissez et déposez des photos ici, ou cliquez pour parcourir",
      "upload_subtext": "Prend en charge JPG, PNG, WEBP (Max 5Mo)",
      "apply_button": "Appliquer",
      "apply_all": "Appliquer à toutes les images",
      "apply_one": "Appliquer à l'image",
      "download_button": "Télécharger",
      "download_zip": "Télécharger ZIP",
      "print_sheet": "Imprimer la Feuille",
      "language": "Langue",
      "dimensions": "Dimensions",
      "compress": "Compresser",
      "effects": "Effets",
      "stamp": "Timbre",
      "presets": "Préréglages"
    }
  },
  ml: {
    translation: {
      "app_title": "ImEditor",
      "app_subtitle": "പ്രൊഫഷണൽ ഡോക്യുമെന്റ് തയ്യാറാക്കൽ",
      "upload_text": "ഫോട്ടോകൾ ഇവിടെ ഡ്രാഗ് ചെയ്ത് ഡ്രോപ്പ് ചെയ്യുക, അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക",
      "upload_subtext": "JPG, PNG, WEBP പിന്തുണയ്ക്കുന്നു (പരമാവധി 5MB)",
      "apply_button": "പ്രയോഗിക്കുക",
      "apply_all": "എല്ലാ ചിത്രങ്ങൾക്കും പ്രയോഗിക്കുക",
      "apply_one": "ചിത്രത്തിന് പ്രയോഗിക്കുക",
      "download_button": "ഡൗൺലോഡ്",
      "download_zip": "സിപ്പ് ഡൗൺലോഡ് ചെയ്യുക",
      "print_sheet": "ഷീറ്റ് പ്രിന്റ് ചെയ്യുക",
      "language": "ഭാഷ",
      "dimensions": "അളവുകൾ",
      "compress": "ചുരുക്കുക",
      "effects": "എഫക്റ്റുകൾ",
      "stamp": "സ്റ്റാമ്പ്",
      "presets": "പ്രീസെറ്റുകൾ"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
