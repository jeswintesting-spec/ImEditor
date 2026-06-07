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
      "presets": "App Presets",
      "about_title": "What is ImEditor?",
      "about_description": "ImEditor is a privacy-first, fully client-side image editor designed specifically for preparing official documents, passports, visas, and signatures. All image processing happens directly in your browser—your files are never uploaded to any server.",
      "uses_title": "Key Features & Uses",
      "use_passport_title": "Passport & Visa Photos",
      "use_passport_desc": "Quickly resize and crop photos to meet strict government guidelines (Indian Passport, US Visa, PAN Card) with automated target size compression.",
      "use_sig_title": "Exam Signatures & Transparency",
      "use_sig_desc": "Crop and adjust signature scans for portals like GATE or UPSC. Easily remove backgrounds to make signatures transparent.",
      "use_enhance_title": "Document & Scan Enhancing",
      "use_enhance_desc": "Improve scanned document clarity using custom brightness, contrast, grayscale, and document enhancement filters.",
      "use_print_title": "Batch Export & Print Sheets",
      "use_print_desc": "Process multiple files at once, layout photos on standard print sheet sizes (4x6, A4), and download everything as a ZIP."
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
      "presets": "Preajustes",
      "about_title": "¿Qué es ImEditor?",
      "about_description": "ImEditor es un editor de imágenes totalmente local y centrado en la privacidad, diseñado específicamente para preparar documentos oficiales, pasaportes, visados y firmas. Todo el procesamiento de imágenes ocurre directamente en tu navegador; tus archivos nunca se suben a ningún servidor.",
      "uses_title": "Funciones clave y usos",
      "use_passport_title": "Fotos de Pasaporte y Visa",
      "use_passport_desc": "Cambia el tamaño y recorta fotos rápidamente para cumplir con las estrictas pautas gubernamentales con compresión automática al tamaño objetivo.",
      "use_sig_title": "Firmas para Exámenes y Transparencia",
      "use_sig_desc": "Recorta y ajusta firmas escaneadas para portales oficiales. Elimina fácilmente el fondo para hacer las firmas transparentes.",
      "use_enhance_title": "Mejora de Documentos y Escaneos",
      "use_enhance_desc": "Mejora la claridad de los documentos escaneados utilizando filtros personalizados de brillo, contraste, escala de grises y mejora de documentos.",
      "use_print_title": "Exportación por Lotes y Hojas de Impresión",
      "use_print_desc": "Procesa múltiples archivos a la vez, organiza fotos en tamaños de hoja estándar (4x6, A4) y descarga todo en un archivo ZIP."
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
      "presets": "प्रीसेट",
      "about_title": "ImEditor क्या है?",
      "about_description": "ImEditor एक गोपनीयता-प्रथम, पूरी तरह से क्लाइंट-साइड इमेज एडिटर है जिसे विशेष रूप से आधिकारिक दस्तावेजों, पासपोर्ट, वीजा और हस्ताक्षरों को तैयार करने के लिए डिज़ाइन किया गया है। सभी इमेज प्रोसेसिंग सीधे आपके ब्राउज़र में होती है—आपकी फाइलें कभी भी किसी सर्वर पर अपलोड नहीं की जाती हैं।",
      "uses_title": "मुख्य विशेषताएं और उपयोग",
      "use_passport_title": "पासपोर्ट और वीजा तस्वीरें",
      "use_passport_desc": "स्वचालित लक्ष्य आकार संपीड़न के साथ सख्त सरकारी दिशानिर्देशों को पूरा करने के लिए फ़ोटो को तेज़ी से बदलें और क्रॉप करें।",
      "use_sig_title": "परीक्षा हस्ताक्षर और पारदर्शिता",
      "use_sig_desc": "आधिकारिक पोर्टल्स के लिए स्कैन किए गए हस्ताक्षरों को क्रॉप और समायोजित करें। हस्ताक्षरों को पारदर्शी बनाने के लिए पृष्ठभूमि को आसानी से हटाएं।",
      "use_enhance_title": "दस्तावेज़ और स्कैन बढ़ाना",
      "use_enhance_desc": "कस्टम चमक, कंट्रास्ट, ग्रेस्केल और दस्तावेज़ एन्हांसमेंट फ़िल्टर का उपयोग करके स्कैन किए गए दस्तावेज़ की स्पष्टता में सुधार करें।",
      "use_print_title": "बैच निर्यात और प्रिंट शीट",
      "use_print_desc": "एक साथ कई फ़ाइलों को प्रोसेस करें, फ़ोटो को मानक प्रिंट शीट आकारों (4x6, A4) पर रखें, और सब कुछ ज़िप के रूप में डाउनलोड करें।"
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
      "presets": "プリセット",
      "about_title": "ImEditorとは？",
      "about_description": "ImEditorは、公的書類、パスポート、ビザ、署名の作成に特化した、プライバシー優先かつ完全クライアントサイドの画像エディタです。すべての画像処理はブラウザ内で直接実行され、ファイルがサーバーにアップロードされることはありません。",
      "uses_title": "主な機能と用途",
      "use_passport_title": "パスポート・ビザ写真",
      "use_passport_desc": "自動ファイルサイズ圧縮機能により、国の厳格なガイドライン（証明写真、ビザなど）に合わせて写真を素早くリサイズ・クロップします。",
      "use_sig_title": "試験用署名と背景透過",
      "use_sig_desc": "各種申請ポータル用にスキャンした署名を切り抜き、調整します。背景を簡単に削除して署名を透過させることができます。",
      "use_enhance_title": "書類とスキャンの補正",
      "use_enhance_desc": "明るさ、コントラスト、グレースケール、書類補正フィルターを使用して、スキャンした書類の鮮明度を向上させます。",
      "use_print_title": "一括出力と印刷用シート",
      "use_print_desc": "複数のファイルを一度に処理し、標準的な印刷サイズ（L判、A4など）に写真を配置して、まとめてZIP形式でダウンロードできます。"
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
      "presets": "Préréglages",
      "about_title": "Qu'est-ce que ImEditor ?",
      "about_description": "ImEditor est un éditeur d'images respectueux de la vie privée et entièrement exécuté côté client, conçu spécifiquement pour la préparation de documents officiels, passeports, visas et signatures. Tout le traitement se fait directement dans votre navigateur ; vos fichiers ne sont jamais envoyés vers un serveur.",
      "uses_title": "Principales fonctionnalités et utilisations",
      "use_passport_title": "Photos de passeport et visa",
      "use_passport_desc": "Redimensionnez et cadrez rapidement vos photos selon les normes gouvernementales strictes avec compression automatique vers la taille cible.",
      "use_sig_title": "Signatures d'examen et transparence",
      "use_sig_desc": "Cadrez et ajustez les signatures numérisées pour les portails officiels. Supprimez facilement le fond pour rendre les signatures transparentes.",
      "use_enhance_title": "Amélioration de documents et scans",
      "use_enhance_desc": "Améliorez la clarté des documents numérisés grâce à des filtres de luminosité, contraste, niveaux de gris et amélioration de documents.",
      "use_print_title": "Exportation par lot et planches d'impression",
      "use_print_desc": "Traitez plusieurs fichiers à la fois, organisez les photos sur des formats de planche standard (4x6, A4) et téléchargez le tout au format ZIP."
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
      "presets": "പ്രീസെറ്റുകൾ",
      "about_title": "എന്താണ് ImEditor?",
      "about_description": "ഔദ്യോഗിക രേഖകൾ, പാസ്‌പോർട്ട്, വിസ, ഒപ്പുകൾ എന്നിവ തയ്യാറാക്കുന്നതിനായി പ്രത്യേകം രൂപകൽപ്പന ചെയ്ത പൂർണ്ണമായും ക്ലയന്റ് സൈഡിൽ പ്രവർത്തിക്കുന്ന ചിത്ര എഡിറ്ററാണ് ImEditor. എല്ലാ പ്രോസസ്സിംഗും നിങ്ങളുടെ ബ്രൗസറിൽ നേരിട്ട് നടക്കുന്നു—നിങ്ങളുടെ ഫയലുകൾ ഒരു സെർവറിലേക്കും അപ്‌ലോഡ് ചെയ്യപ്പെടുന്നില്ല.",
      "uses_title": "പ്രധാന സവിശേഷതകളും ഉപയോഗങ്ങളും",
      "use_passport_title": "പാസ്‌പോർട്ട്, വിസ ഫോട്ടോകൾ",
      "use_passport_desc": "കൃത്യമായ ഫയൽ വലുപ്പത്തിലേക്ക് കംപ്രസ് ചെയ്തുകൊണ്ട്, സർക്കാർ നിർദ്ദേശങ്ങൾക്ക് അനുസൃതമായി ഫോട്ടോകൾ വേഗത്തിൽ റീസൈസ് ചെയ്യാനും ക്രോപ്പ് ചെയ്യാനും സാധിക്കുന്നു.",
      "use_sig_title": "ഒപ്പുകളും പശ്ചാത്തലം ഒഴിവാക്കലും",
      "use_sig_desc": "പരീക്ഷാ പോർട്ടലുകൾക്കായി ഒപ്പുകൾ ക്രോപ്പ് ചെയ്യാനും ക്രമീകരിക്കാനും പശ്ചാത്തലം സുതാര്യമാക്കാനും (transparent) എളുപ്പത്തിൽ സാധിക്കുന്നു.",
      "use_enhance_title": "രേഖകളുടെയും സ്കാനുകളുടെയും വ്യക്തത കൂട്ടൽ",
      "use_enhance_desc": "ബ്രൈറ്റ്‌നസ്, കോൺട്രാസ്റ്റ്, ഗ്രേസ്കെയിൽ, ഡോക്യുമെന്റ് ഫിൽട്ടറുകൾ എന്നിവ ഉപയോഗിച്ച് സ്കാൻ ചെയ്ത രേഖകളുടെ വ്യക്തത വർദ്ധിപ്പിക്കുക.",
      "use_print_title": "ബാച്ച് എക്സ്പോർട്ടും പ്രിന്റ് ഷീറ്റുകളും",
      "use_print_desc": "ഒനൈമ സമയം ഒന്നിലധികം ഫയലുകൾ പ്രോസസ്സ് ചെയ്യുക, സാധാരണ പ്രിന്റ് ഷീറ്റ് അളവുകളിൽ (4x6, A4) ഫോട്ടോകൾ ക്രമീകരിക്കുക, കൂടാതെ സിപ്പ് (ZIP) ആയി ഡൗൺലോഡ് ചെയ്യുക."
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
