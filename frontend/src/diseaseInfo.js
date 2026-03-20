// Frontend disease knowledge base.
// Keyed by model class name (English) -> language code -> structured advisory text.
// If a language entry is missing, UI falls back to English.

export const DISEASE_INFO = {
  Healthy_Leaves: {
    en: {
      label: 'Healthy Leaves',
      status: 'Healthy',
      symptoms: ['No disease detected.'],
      cause: ['No visible disease symptoms in the image.'],
      remedy: ['No treatment required. Maintain regular care and monitoring.'],
      prevention: [
        'Maintain balanced nutrition and irrigation.',
        'Continue routine field scouting for early pest/disease signs.'
      ],
      fertilizers: [
        'Apply NPK 14:14:14 @ 1.5 kg per palm twice a year (June-July and November-December).',
        'Supplement with organic manure (FYM/compost) @ 25-50 kg per palm annually.',
        'Micronutrient spray: Mix Borax (0.2%), Zinc sulfate (0.5%), Magnesium sulfate (1%) - spray every 3-4 months.',
        'For coastal areas, consider salt-tolerant varieties and additional potassium (25-50% more).'
      ]
    },
    hi: {
      label: 'स्वस्थ पत्तियाँ',
      status: 'स्वस्थ',
      symptoms: ['कोई रोग नहीं पाया गया।'],
      cause: ['तस्वीर में रोग के स्पष्ट लक्षण नहीं दिखे।'],
      remedy: ['किसी उपचार की आवश्यकता नहीं। नियमित देखभाल और निगरानी रखें।'],
      prevention: ['संतुलित पोषण और सिंचाई बनाए रखें।', 'नियमित निरीक्षण जारी रखें।'],
      fertilizers: [
        'NPK 14:14:14 @ 1.5 किग्रा प्रति पेड़ वर्ष में दो बार (जून-जुलाई और नवंबर-दिसंबर) लगाएं।',
        'गोबर की खाद/कम्पोस्ट @ 25-50 किग्रा प्रति पेड़ सालाना मिलाएं।',
        'सूक्ष्म पोषक स्प्रे: बोरेक्स (0.2%), जिंक सल्फेट (0.5%), मैग्नीशियम सल्फेट (1%) मिश्रण - हर 3-4 महीने स्प्रे करें।',
        'तटीय क्षेत्रों के लिए अतिरिक्त पोटैशियम (25-50% अधिक) दें।'
      ]
    },
    mr: {
      label: 'निरोगी पाने',
      status: 'निरोगी',
      symptoms: ['रोग आढळला नाही.'],
      cause: ['प्रतिमेत रोगाची स्पष्ट लक्षणे दिसत नाहीत.'],
      remedy: ['उपचार आवश्यक नाही. नियमित देखभाल व निरीक्षण ठेवा.'],
      prevention: ['संतुलित पोषण व सिंचन ठेवा.', 'नियमित निरीक्षण करा.']
    },
    kn: {
      label: 'ಆರೋಗ್ಯಕರ ಎಲೆಗಳು',
      status: 'ಆರೋಗ್ಯಕರ',
      symptoms: ['ರೋಗ ಕಂಡುಬಂದಿಲ್ಲ.'],
      cause: ['ಚಿತ್ರದಲ್ಲಿ ರೋಗ ಲಕ್ಷಣಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲ.'],
      remedy: ['ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿಲ್ಲ. ನಿಯಮಿತ ಆರೈಕೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.'],
      prevention: ['ಸಮತೋಲ ಪೋಷಣೆ ಮತ್ತು ನೀರಾವರಿ.', 'ನಿಯಮಿತ ತೋಟ ಪರಿಶೀಲನೆ.']
    },
    te: {
      label: 'ఆరోగ్యమైన ఆకులు',
      status: 'ఆరోగ్యకరం',
      symptoms: ['వ్యాధి కనిపించలేదు.'],
      cause: ['చిత్రంలో వ్యాధి లక్షణాలు స్పష్టంగా లేవు.'],
      remedy: ['చికిత్స అవసరం లేదు. సాధారణ సంరక్షణ కొనసాగించండి.'],
      prevention: ['సమతుల్య పోషణ మరియు నీటిపారుదల.', 'నియమిత పరిశీలన.']
    },
    ml: {
      label: 'ആരോഗ്യകരമായ ഇലകൾ',
      status: 'ആരോഗ്യം',
      symptoms: ['രോഗം കണ്ടെത്തിയില്ല.'],
      cause: ['ചിത്രത്തിൽ രോഗ ലക്ഷണങ്ങൾ വ്യക്തമായി കാണുന്നില്ല.'],
      remedy: ['ചികിത്സ ആവശ്യമില്ല. സ്ഥിരമായ പരിചരണം തുടരുക.'],
      prevention: ['സമതുലിത വളവും ജലസേചനവും.', 'നിയമിത നിരീക്ഷണം.']
    },
    bn: {
      label: 'সুস্থ পাতা',
      status: 'সুস্থ',
      symptoms: ['কোনো রোগ শনাক্ত হয়নি।'],
      cause: ['ছবিতে রোগের স্পষ্ট লক্ষণ নেই।'],
      remedy: ['চিকিৎসা প্রয়োজন নেই। নিয়মিত পরিচর্যা বজায় রাখুন।'],
      prevention: ['সুষম সার ও সেচ বজায় রাখুন।', 'নিয়মিত পর্যবেক্ষণ করুন।']
    },
    gu: {
      label: 'સ્વસ્થ પાંદડા',
      status: 'સ્વસ્થ',
      symptoms: ['કોઈ રોગ મળી આવ્યો નથી.'],
      cause: ['છબીમાં રોગના સ્પષ્ટ લક્ષણો નથી.'],
      remedy: ['ઉપચાર જરૂરી નથી. નિયમિત સંભાળ રાખો.'],
      prevention: ['સંતુલિત ખાતર અને સિંચાઈ.', 'નિયમિત નિરીક્ષણ.']
    },
    pa: {
      label: 'ਸਿਹਤਮੰਦ ਪੱਤੇ',
      status: 'ਸਿਹਤਮੰਦ',
      symptoms: ['ਕੋਈ ਰੋਗ ਨਹੀਂ ਮਿਲਿਆ।'],
      cause: ['ਤਸਵੀਰ ਵਿੱਚ ਰੋਗ ਦੇ ਸਪੱਸ਼ਟ ਲੱਛਣ ਨਹੀਂ ਹਨ।'],
      remedy: ['ਇਲਾਜ ਦੀ ਲੋੜ ਨਹੀਂ। ਨਿਯਮਿਤ ਦੇਖਭਾਲ ਜਾਰੀ ਰੱਖੋ।'],
      prevention: ['ਸੰਤੁਲਿਤ ਖਾਦ ਅਤੇ ਸਿੰਚਾਈ।', 'ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ।']
    },
    or: {
      label: 'ସ୍ୱସ୍ଥ ପତ୍ର',
      status: 'ସ୍ୱସ୍ଥ',
      symptoms: ['କୌଣସି ରୋଗ ମିଳିଲା ନାହିଁ।'],
      cause: ['ଛବିରେ ରୋଗର ସ୍ପଷ୍ଟ ଲକ୍ଷଣ ନାହିଁ।'],
      remedy: ['ଚିକିତ୍ସା ଆବଶ୍ୟକ ନୁହେଁ। ନିୟମିତ ଯତ୍ନ ରଖନ୍ତୁ।'],
      prevention: ['ସମତୁଳିତ ସାର ଏବଂ ସିଞ୍ଚନ।', 'ନିୟମିତ ପର୍ଯ୍ୟବେକ୍ଷଣ।']
    },
    ur: {
      label: 'صحت مند پتے',
      status: 'صحت مند',
      symptoms: ['کوئی بیماری ظاہر نہیں ہوئی۔'],
      cause: ['تصویر میں بیماری کی واضح علامات نہیں ہیں۔'],
      remedy: ['علاج کی ضرورت نہیں۔ معمول کی دیکھ بھال جاری رکھیں۔'],
      prevention: ['متوازن کھاد اور آبپاشی۔', 'باقاعدہ نگرانی۔']
    }
  },

  Caterpillars: {
    en: {
      label: 'Caterpillars',
      status: 'Diseased',
      symptoms: [
        'Irregular holes or chewed edges on leaflets.',
        'Skeletonization (leaf tissue eaten leaving veins).',
        'Presence of larvae, frass (droppings), or webbing.'
      ],
      cause: ['Caterpillar infestation feeding on leaf tissue.'],
      remedy: [
        'Remove visible larvae for small infestations.',
        'Encourage biological control (natural predators).',
        'If severe, follow local agriculture guidelines for approved control measures.'
      ],
      prevention: [
        'Regular monitoring, especially on new leaves.',
        'Avoid excessive nitrogen.',
        'Maintain field sanitation.'
      ],
      fertilizers: [
        'Use Bacillus thuringiensis (Bt) spray @ 1-2 g/liter water, apply every 7-10 days until infestation clears.',
        'Apply Neem oil solution @ 3-5 ml/liter water as organic pest control and foliar spray.',
        'Reduce nitrogen fertilizer temporarily; use balanced NPK 10:10:20 instead of high-N formulas.',
        'Support plant recovery with potassium-rich fertilizer (Muriate of Potash @ 0.5 kg/palm) after pest control.'
      ]
    },
    hi: {
      label: 'इल्ली / सूंडी',
      status: 'प्रभावित',
      symptoms: ['पत्तियों में अनियमित छेद या कटी किनारियाँ।', 'नसें बचकर ऊतक खा जाना।', 'इल्ली/मल/जाला दिखना।'],
      cause: ['इल्ली द्वारा पत्ती के ऊतक को खाना।'],
      remedy: ['कम संक्रमण में इल्ली हटाएँ।', 'प्राकृतिक शत्रुओं को बढ़ावा दें।', 'अधिक संक्रमण में स्थानीय कृषि सलाह अनुसार नियंत्रण करें।'],
      prevention: ['नियमित निगरानी करें।', 'अधिक नाइट्रोजन से बचें।', 'खेत की सफाई रखें।'],
      fertilizers: [
        'Bacillus thuringiensis (Bt) स्प्रे @ 1-2 ग्राम/लीटर पानी, संक्रमण खत्म होने तक हर 7-10 दिन लगाएं।',
        'नीम तेल घोल @ 3-5 मिली/लीटर पानी कीट नियंत्रण और पत्ते स्प्रे के लिए।',
        'नाइट्रोजन खाद अस्थायी रूप से कम करें; NPK 10:10:20 का उपयोग करें।',
        'कीट नियंत्रण के बाद पोटैशियम युक्त खाद (म्यूरेट ऑफ पोटाश @ 0.5 किग्रा/पेड़) दें।'
      ]
    },
    mr: {
      label: 'अळ्या',
      status: 'प्रभावित',
      symptoms: ['पानांवर छिद्रे/कापलेले कडे.', 'पानाचा भाग खाल्लेला दिसणे.', 'अळी/मल/जाळे दिसणे.'],
      cause: ['अळींचा प्रादुर्भाव व पानाचे ऊतक खाणे.'],
      remedy: ['दिसणाऱ्या अळ्या काढून नष्ट करा.', 'नैसर्गिक शत्रूंना प्रोत्साहन द्या.', 'तीव्र असल्यास स्थानिक कृषी मार्गदर्शनानुसार उपाय करा.'],
      prevention: ['नियमित पाहणी.', 'अतिरिक्त नायट्रोजन टाळा.', 'शेत स्वच्छता ठेवा.']
    },
    kn: {
      label: 'ಇಲಿ/ಕೀಟ (Caterpillars)',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಎಲೆಗಳಲ್ಲಿ ಅಸಮಾನ ರಂಧ್ರಗಳು/ಕಡಿ.', 'ಎಲುಬಿನಂತೆ ನರಗಳು ಮಾತ್ರ ಉಳಿಯುವುದು.', 'ಲಾರ್ವಾ/ಮಲ/ಜಾಲ ಕಾಣುವುದು.'],
      cause: ['ಇಲಿಗಳು ಎಲೆ ткissue ತಿನ್ನುವುದು.'],
      remedy: ['ಕಡಿಮೆ ಹಂತದಲ್ಲಿ ಕೈಯಿಂದ ತೆಗೆದುಹಾಕಿ.', 'ಜೈವ ನಿಯಂತ್ರಣಕ್ಕೆ ಉತ್ತೇಜನ.', 'ತೀವ್ರವಾಗಿದ್ದರೆ ಸ್ಥಳೀಯ ಮಾರ್ಗಸೂಚಿಯಂತೆ ಕ್ರಮ.'],
      prevention: ['ನಿಯಮಿತ ಪರಿಶೀಲನೆ.', 'ಅತಿಯಾದ ನೈಟ್ರೋಜನ್ ಬೇಡ.', 'ತೋಟ ಸುವ್ಯವಸ್ಥೆ.']
    },
    te: {
      label: 'పురుగులు (Caterpillars)',
      status: 'ప్రభావితం',
      symptoms: ['ఆకులపై రంధ్రాలు/కొరికిన అంచులు.', 'నరాలు మాత్రమే మిగలడం.', 'లార్వా/మలం/జాలాలు కనిపించడం.'],
      cause: ['పురుగులు ఆకు కణజాలాన్ని తినడం.'],
      remedy: ['తక్కువ దశలో చేతితో తొలగించండి.', 'జీవ నియంత్రణకు ప్రోత్సహించండి.', 'తీవ్రంగా ఉంటే స్థానిక సిఫార్సులు అనుసరించండి.'],
      prevention: ['నియమిత పరిశీలన.', 'అధిక నైట్రజన్ నివారించండి.', 'తోట శుభ్రత.']
    },
    ml: {
      label: 'ഇലപ്പുഴു',
      status: 'ബാധിതം',
      symptoms: ['ഇലയിൽ അക്രമമായ തുളകൾ/കടിച്ച അറ്റങ്ങൾ.', 'നരമ്പുകൾ മാത്രം ശേഷിക്കൽ.', 'പുഴു/മലം/വലകൾ കാണുക.'],
      cause: ['ഇലപ്പുഴു ഇലത്തിസ്സു തിന്നുക.'],
      remedy: ['ചെറു ബാധയിൽ കൈകൊണ്ട് നീക്കുക.', 'ജൈവ നിയന്ത്രണം പ്രോത്സാഹിപ്പിക്കുക.', 'കഠിനമായാൽ പ്രാദേശിക മാർഗനിർദ്ദേശം അനുസരിക്കുക.'],
      prevention: ['നിയമിത നിരീക്ഷണം.', 'അധിക നൈട്രജൻ ഒഴിവാക്കുക.', 'തോട്ട ശുചിത്വം.']
    },
    bn: {
      label: 'শুঁয়োপোকা',
      status: 'আক্রান্ত',
      symptoms: ['পাতায় অনিয়মিত ছিদ্র/কাটা কিনারা.', 'শিরা ছাড়া টিস্যু খেয়ে ফেলা.', 'লার্ভা/মল/জাল দেখা।'],
      cause: ['শুঁয়োপোকা পাতার টিস্যু খায়।'],
      remedy: ['কম হলে হাতে সরান।', 'জৈব নিয়ন্ত্রণ উৎসাহিত করুন।', 'বেশি হলে স্থানীয় নির্দেশিকা অনুসরণ করুন।'],
      prevention: ['নিয়মিত পর্যবেক্ষণ।', 'অতিরিক্ত নাইট্রোজেন এড়ান।', 'ক্ষেত পরিষ্কার রাখুন।']
    },
    gu: {
      label: 'ઇયળ (Caterpillars)',
      status: 'અસરગ્રસ્ત',
      symptoms: ['પાંદડામાં છિદ્ર/કટાયેલા કિનારા.', 'નસો જ બાકી રહેવી.', 'ઇયળ/મલ/જાળ દેખાવું.'],
      cause: ['ઇયળ દ્વારા પાનનું તંતુ ખાવું.'],
      remedy: ['ઓછા પ્રકોપે હાથથી દૂર કરો.', 'જૈવિક નિયંત્રણ પ્રોત્સાહિત કરો.', 'વધારે હોય તો સ્થાનિક માર્ગદર્શન અનુસાર પગલાં લો.'],
      prevention: ['નિયમિત નિરીક્ષણ.', 'અતિ નાઈટ્રોજન ટાળો.', 'ખેતર સ્વચ્છતા.']
    },
    pa: {
      label: 'ਸੂੰਡੀ (Caterpillars)',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਪੱਤਿਆਂ ਵਿੱਚ ਛੇਦ/ਕੱਟੇ ਕਿਨਾਰੇ.', 'ਨਸਾਂ ਤੋਂ ਇਲਾਵਾ ਟਿਸ਼ੂ ਖਾ ਲੈਣਾ.', 'ਲਾਰਵਾ/ਮਲ/ਜਾਲ.'],
      cause: ['ਸੂੰਡੀ ਪੱਤੇ ਦਾ ਟਿਸ਼ੂ ਖਾਂਦੀ ਹੈ।'],
      remedy: ['ਘੱਟ ਹੋਵੇ ਤਾਂ ਹੱਥ ਨਾਲ ਹਟਾਓ।', 'ਜੈਵਿਕ ਨਿਯੰਤਰਣ ਨੂੰ ਪ੍ਰੋਤਸਾਹਿਤ ਕਰੋ।', 'ਵੱਧ ਹੋਵੇ ਤਾਂ ਸਥਾਨਕ ਸਲਾਹ ਅਨੁਸਾਰ ਕਰੋ।'],
      prevention: ['ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ.', 'ਅਧਿਕ ਨਾਈਟ੍ਰੋਜਨ ਤੋਂ ਬਚੋ.', 'ਸਫਾਈ.']
    },
    or: {
      label: 'ଇଲି/ଶୁଣ୍ଡି',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ପତ୍ରରେ ଅସମ ଛିଦ୍ର.', 'ନସ ଛାଡ଼ି ଅଂଶ ଖାଇଦେବା.', 'ଲାର୍ଭା/ମଲ/ଜାଲ.'],
      cause: ['ଇଲି ଦ୍ୱାରା ପତ୍ର ତନ୍ତୁ ଖାଇବା.'],
      remedy: ['କମ୍ ଥିଲେ ହାତେ ହଟାନ୍ତୁ.', 'ଜୈବିକ ନିୟନ୍ତ୍ରଣ ପ୍ରୋତ୍ସାହନ.', 'ବେଶି ହେଲେ ସ୍ଥାନୀୟ ପରାମର୍ଶ ଅନୁସରଣ.'],
      prevention: ['ନିୟମିତ ପର୍ଯ୍ୟବେକ୍ଷଣ.', 'ଅତି ନାଇଟ୍ରୋଜେନ ଟାଳନ୍ତୁ.', 'ସଫାସୁଥା.']
    },
    ur: {
      label: 'سنڈیاں',
      status: 'متاثرہ',
      symptoms: ['پتے میں سوراخ/کٹے کنارے۔', 'ٹشو کھا کر رگیں باقی رہنا۔', 'لاروا/فضلہ/جالا۔'],
      cause: ['سنڈیاں پتے کا ٹشو کھاتی ہیں۔'],
      remedy: ['کم حملہ ہو تو ہاتھ سے ہٹائیں۔', 'حیاتیاتی کنٹرول کی حوصلہ افزائی کریں۔', 'زیادہ ہو تو مقامی رہنمائی کے مطابق کریں۔'],
      prevention: ['باقاعدہ نگرانی۔', 'زیادہ نائٹروجن سے پرہیز۔', 'کھیت کی صفائی۔']
    }
  },

  CCI_Leaflets: {
    en: {
      label: 'CCI Leaflets',
      status: 'Diseased',
      symptoms: [
        'Patchy discoloration on leaflets.',
        'Mild spots or uneven chlorosis.',
        'Localized damage that may not uniformly spread.'
      ],
      cause: [
        'Leaflet stress/injury category in the dataset; can be linked to nutrient stress, environmental stress, or early-stage infection.'
      ],
      remedy: [
        'Improve field nutrition (balanced NPK; consider micronutrients based on soil test).',
        'Remove heavily damaged leaflets if needed.',
        'If symptoms increase, consult local agricultural experts for targeted guidance.'
      ],
      prevention: [
        'Maintain consistent irrigation and avoid drought stress.',
        'Periodic soil/leaf nutrient analysis.',
        'Avoid mechanical damage during farm operations.'
      ],
      fertilizers: [
        'Apply Magnesium sulfate (Epsom salt) @ 200-300 g per palm as soil application or foliar spray (2%).',
        'Borax @ 50-100 g per palm mixed with sand for even soil distribution (apply once a year).',
        'Zinc sulfate @ 0.5% foliar spray (400-500 g in 100 liters water for 100 palms).',
        'Balanced NPK 15:15:15 @ 1.5 kg per palm to correct overall nutrient balance.',
        'Organic option: Apply neem cake @ 5 kg per palm to improve soil health and micronutrient availability.'
      ]
    },
    hi: {
      label: 'CCI पत्तियाँ',
      status: 'प्रभावित',
      symptoms: ['धब्बेदार रंग-परिवर्तन।', 'हल्के धब्बे/असमान पीलापन।', 'क्षति स्थानीय हो सकती है।'],
      cause: ['यह श्रेणी अक्सर तनाव/पोषक असंतुलन/शुरुआती संक्रमण से जुड़ी होती है।'],
      remedy: ['संतुलित पोषण दें।', 'बहुत क्षतिग्रस्त भाग हटाएँ।', 'लक्षण बढ़ें तो विशेषज्ञ से सलाह लें।'],
      prevention: ['सिंचाई नियमित रखें।', 'मिट्टी/पत्ती परीक्षण करें।', 'यांत्रिक चोट से बचें।'],
      fertilizers: [
        'मैग्नीशियम सल्फेट @ 200-300 ग्राम प्रति पेड़ मिट्टी में या 2% पत्ते स्प्रे।',
        'बोरेक्स @ 50-100 ग्राम प्रति पेड़ रेत के साथ मिलाकर (साल में एक बार)।',
        'जिंक सल्फेट @ 0.5% पत्ते स्प्रे (100 पेड़ों के लिए 100 लीटर पानी में 400-500 ग्राम)।',
        'संतुलित NPK 15:15:15 @ 1.5 किग्रा प्रति पेड़।',
        'नीम की खली @ 5 किग्रा प्रति पेड़ मिट्टी की सेहत सुधारने के लिए।'
      ]
    },
    mr: {
      label: 'CCI पान',
      status: 'प्रभावित',
      symptoms: ['ठिपके/डाग दिसणे.', 'हलका डाग किंवा असमान पिवळेपणा.', 'स्थानिक नुकसान.'],
      cause: ['पोषक/पर्यावरणीय ताण किंवा सुरुवातीचा संसर्ग असू शकतो.'],
      remedy: ['संतुलित खत द्या.', 'जास्त खराब पाने काढा.', 'लक्षणे वाढल्यास तज्ज्ञांचा सल्ला घ्या.'],
      prevention: ['नियमित सिंचन.', 'माती/पान चाचणी.', 'यांत्रिक इजा टाळा.']
    },
    kn: {
      label: 'CCI ಎಲೆಗಳು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಚುಕ್ಕೆ ಚುಕ್ಕೆ ಬಣ್ಣ ಬದಲಾವಣೆ.', 'ಸ್ವಲ್ಪ ಕಲೆ/ಅಸಮಾನ ಹಳದಿಮು.', 'ಸ್ಥಳೀಯ ಹಾನಿ.'],
      cause: ['ಪೋಷಕ/ಪರಿಸರ ಒತ್ತಡ ಅಥವಾ ಪ್ರಾರಂಭಿಕ ಸೋಂಕು ಸಾಧ್ಯ.'],
      remedy: ['ಸಮತೋಲ ಗೊಬ್ಬರ.', 'ಹೆಚ್ಚಾಗಿ ಹಾನಿಯಾದ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.', 'ಹೆಚ್ಚಾದರೆ ತಜ್ಞರ ಸಲಹೆ.'],
      prevention: ['ನಿಯಮಿತ ನೀರಾವರಿ.', 'ಮಣ್ಣು/ಎಲೆ ಪೋಷಕ ಪರೀಕ್ಷೆ.', 'ಯಾಂತ್ರಿಕ ಹಾನಿ ತಪ್ಪಿಸಿ.']
    },
    te: {
      label: 'CCI ఆకులు',
      status: 'ప్రభావితం',
      symptoms: ['చెల్లాచెదురు రంగు మార్పు.', 'తేలికపాటి మచ్చలు/అసమాన పసుపు.', 'స్థానిక నష్టం.'],
      cause: ['పోషక/పర్యావరణ ఒత్తిడి లేదా ప్రారంభ సంక్రమణ కావచ్చు.'],
      remedy: ['సమతుల్య ఎరువు.', 'తీవ్రంగా దెబ్బతిన్న భాగాలు తొలగించండి.', 'పెరిగితే నిపుణుల సలహా.'],
      prevention: ['నియమిత నీటిపారుదల.', 'మట్టి/ఆకు పరీక్షలు.', 'యాంత్రిక నష్టం నివారించండి.']
    },
    ml: {
      label: 'CCI ഇലകൾ',
      status: 'ബാധിതം',
      symptoms: ['പാച്ചി നിറമാറ്റം.', 'ലഘു പാടുകൾ/അസമമായ മഞ്ഞപ്പ്.', 'പ്രാദേശിക നാശം.'],
      cause: ['പോഷക/പരിസ്ഥിതി സമ്മർദ്ദം അല്ലെങ്കിൽ ആരംഭ ബാധ സാധ്യത.'],
      remedy: ['സമതുലിത വളം.', 'കൂടുതൽ കേടായ ഭാഗങ്ങൾ നീക്കുക.', 'കൂടിയാൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['സ്ഥിരമായ ജലസേചനം.', 'മണ്ണ്/ഇല പോഷക പരിശോധന.', 'യാന്ത്രിക ക്ഷതി ഒഴിവാക്കുക.']
    },
    bn: {
      label: 'CCI পাতা',
      status: 'আক্রান্ত',
      symptoms: ['ছোপ ছোপ রঙ পরিবর্তন।', 'হালকা দাগ/অসম ম্লানতা।', 'স্থানীয় ক্ষতি।'],
      cause: ['পুষ্টি/পরিবেশগত চাপ বা প্রাথমিক সংক্রমণ হতে পারে।'],
      remedy: ['সুষম সার দিন।', 'খুব ক্ষতিগ্রস্ত অংশ সরান।', 'বাড়লে বিশেষজ্ঞের পরামর্শ নিন।'],
      prevention: ['নিয়মিত সেচ।', 'মাটি/পাতা পরীক্ষা।', 'যান্ত্রিক ক্ষতি এড়ান।']
    },
    gu: {
      label: 'CCI પાંદડા',
      status: 'અસરગ્રસ્ત',
      symptoms: ['છિટછાટ રંગ બદલાવ.', 'હલકા ડાઘ/અસમાન પીળાશ.', 'સ્થાનિક નુકસાન.'],
      cause: ['પોષક/પર્યાવરણ તાણ અથવા શરૂઆતનો ચેપ હોઈ શકે.'],
      remedy: ['સંતુલિત ખાતર આપો.', 'ઘણું નુકસાન થયેલ ભાગ દૂર કરો.', 'વધે તો નિષ્ણાત સલાહ લો.'],
      prevention: ['નિયમિત સિંચાઈ.', 'માટી/પાન પરીક્ષણ.', 'યાંત્રિક નુકસાન ટાળો.']
    },
    pa: {
      label: 'CCI ਪੱਤੇ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਛਿੱਟੇ ਰੰਗ ਬਦਲਾਅ।', 'ਹਲਕੇ ਦਾਗ/ਅਸਮਾਨ ਪੀਲਾਪਣ।', 'ਸਥਾਨਕ ਨੁਕਸਾਨ।'],
      cause: ['ਪੋਸ਼ਕ/ਵਾਤਾਵਰਣੀ ਤਣਾਅ ਜਾਂ ਸ਼ੁਰੂਆਤੀ ਸੰਕਰਮਣ।'],
      remedy: ['ਸੰਤੁਲਿਤ ਖਾਦ ਦਿਓ।', 'ਜ਼ਿਆਦਾ ਖਰਾਬ ਹਿੱਸਾ ਹਟਾਓ।', 'ਵਧੇ ਤਾਂ ਮਾਹਿਰ ਦੀ ਸਲਾਹ।'],
      prevention: ['ਨਿਯਮਿਤ ਸਿੰਚਾਈ।', 'ਮਿੱਟੀ/ਪੱਤਾ ਟੈਸਟ।', 'ਯਾਂਤ੍ਰਿਕ ਨੁਕਸਾਨ ਤੋਂ ਬਚੋ।']
    },
    or: {
      label: 'CCI ପତ୍ର',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ଛିଟିଛିଟି ରଙ୍ଗ ପରିବର୍ତ୍ତନ।', 'ହାଲୁକା ଦାଗ/ଅସମ ହଳଦିଆ।', 'ସ୍ଥାନୀୟ କ୍ଷତି।'],
      cause: ['ପୋଷକ/ପରିବେଶ ଚାପ କିମ୍ବା ଆରମ୍ଭିକ ସଂକ୍ରମଣ।'],
      remedy: ['ସମତୁଳିତ ସାର ଦିଅନ୍ତୁ।', 'ଅଧିକ କ୍ଷତି ଅଂଶ ହଟାନ୍ତୁ।', 'ବଢିଲେ ତଜ୍ଞ ସହ ପରାମର୍ଶ।'],
      prevention: ['ନିୟମିତ ସିଞ୍ଚନ।', 'ମାଟି/ପତ୍ର ପରୀକ୍ଷା।', 'ଯାନ୍ତ୍ରିକ କ୍ଷତି ଟାଳନ୍ତୁ।']
    },
    ur: {
      label: 'CCI پتے',
      status: 'متاثرہ',
      symptoms: ['دھبے دار رنگت۔', 'ہلکے دھبے/غیر ہموار پیلاہٹ۔', 'مقامی نقصان۔'],
      cause: ['غذائی/ماحولیاتی دباؤ یا ابتدائی انفیکشن ممکن۔'],
      remedy: ['متوازن کھاد دیں۔', 'زیادہ متاثرہ حصہ ہٹائیں۔', 'بڑھے تو ماہر سے مشورہ کریں۔'],
      prevention: ['باقاعدہ آبپاشی۔', 'مٹی/پتے کی جانچ۔', 'میکینیکل نقصان سے بچیں۔']
    }
  },

  WCLWD_DryingofLeaflets: {
    en: {
      label: 'WCLWD: Drying of Leaflets',
      status: 'Diseased',
      symptoms: ['Leaflet tips/edges dry out and turn brown.', 'Brittle texture and progressive drying.'],
      cause: ['Drying symptom consistent with WCLWD category; may worsen with drought/salt stress.'],
      remedy: ['Improve irrigation scheduling.', 'Maintain sanitation; remove severely dried fronds.', 'Follow local guidance for WCLWD management if widespread.'],
      prevention: ['Mulching to conserve moisture.', 'Avoid saline irrigation water; ensure good drainage.', 'Act early on initial symptoms.'],
      fertilizers: [
        'Sulphate of Potash (SOP) @ 1.5-2 kg per palm (preferred over MOP in saline conditions).',
        'Apply NPK 8:8:16 @ 2 kg per palm with double potassium ratio for drought tolerance.',
        'Gypsum @ 500 g per palm if soil salinity is an issue (helps leach excess salts).',
        'Foliar spray of potassium nitrate @ 1% (10 g/liter) for quick recovery.',
        'Organic mulch (coconut husk, straw) @ 50-75 kg around the palm basin to reduce evaporation.'
      ]
    },
    hi: {
      label: 'WCLWD: पत्तियों का सूखना',
      status: 'रोग प्रभावित',
      symptoms: ['किनारे/सिरे भूरे होकर सूखना।', 'भंगुर बनावट और धीरे-धीरे सूखना।'],
      cause: ['WCLWD श्रेणी के अनुरूप सूखना; सूखा/लवणता से बढ़ सकता है।'],
      remedy: ['सिंचाई सुधारें।', 'बहुत सूखी पत्तियाँ हटाएँ।', 'यदि बढ़े तो स्थानीय विशेषज्ञ से सलाह लें।'],
      prevention: ['मल्चिंग करें।', 'खारे पानी से बचें और निकास अच्छा रखें।', 'शुरुआती लक्षणों पर जल्दी कार्रवाई करें।'],
      fertilizers: [
        'सल्फेट ऑफ पोटाश (SOP) @ 1.5-2 किग्रा प्रति पेड़ (नमकीन मिट्टी में MOP से बेहतर)।',
        'NPK 8:8:16 @ 2 किग्रा प्रति पेड़ दोगुनी पोटैशियम के साथ।',
        'जिप्सम @ 500 ग्राम प्रति पेड़ यदि नमक तनाव हो।',
        'पोटैशियम नाइट्रेट @ 1% स्प्रे (10 ग्राम/लीटर) जल्दी रिकवरी के लिए।',
        'जैविक मल्च (नारियल भूसी, पुआल) @ 50-75 किग्रा।'
      ]
    },
    mr: {
      label: 'WCLWD: पान सुकणे',
      status: 'प्रभावित',
      symptoms: ['कडा/तपकिरी सुकलेले टोक/कडे.', 'हळूहळू सुकणे.'],
      cause: ['WCLWD प्रकारातील सुकणे; दुष्काळ/खारटपणा वाढवू शकतो.'],
      remedy: ['सिंचन वेळापत्रक सुधारा.', 'अतिसुकलेली पाने काढा.', 'वाढल्यास स्थानिक तज्ज्ञ सल्ला.'],
      prevention: ['मल्चिंग.', 'खारट पाणी टाळा; निचरा चांगला ठेवा.', 'लवकर उपाय करा.']
    },
    kn: {
      label: 'WCLWD: ಎಲೆ ಒಣಗುವುದು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಅಂಚು/ತುದಿಗಳು ಒಣಗಿ ಕಂದು ಆಗುವುದು.', 'ಕಠಿಣ/ಭಂಗುರ texture.'],
      cause: ['WCLWD ವರ್ಗದ ಒಣಗುವಿಕೆ; ಬರ/ಉಪ್ಪು ಒತ್ತಡದಿಂದ ಹೆಚ್ಚಾಗಬಹುದು.'],
      remedy: ['ನೀರಾವರಿ ಸರಿಪಡಿಸಿ.', 'ಬಹಳ ಒಣಗಿದ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.', 'ವಿಸ್ತೃತವಾಗಿದ್ದರೆ ತಜ್ಞ ಸಲಹೆ.'],
      prevention: ['ಮಲ್ಚಿಂಗ್.', 'ಉಪ್ಪು ನೀರು ತಪ್ಪಿಸಿ; ಡ್ರೈನೇಜ್ ಉತ್ತಮ.', 'ಆರಂಭಿಕ ಲಕ್ಷಣದಲ್ಲೇ ಕ್ರಮ.']
    },
    te: {
      label: 'WCLWD: ఆకులు ఎండిపోవడం',
      status: 'ప్రభావితం',
      symptoms: ['అంచులు/చివరలు ఎండిపోయి గోధుమ రంగు.', 'క్రమంగా ఎండిపోవడం.'],
      cause: ['WCLWD తరహా ఎండుదల; కరువు/ఉప్పుతనం పెంచవచ్చు.'],
      remedy: ['నీటిపారుదల మెరుగుపరచండి.', 'చాలా ఎండిన ఆకులు తొలగించండి.', 'విస్తరిస్తే నిపుణుల సలహా.'],
      prevention: ['మల్చింగ్.', 'ఉప్పు నీరు నివారించండి; మంచి డ్రైనేజ్.', 'ప్రారంభంలోనే చర్య.']
    },
    ml: {
      label: 'WCLWD: ഇലത്തണ്ട് ഉണക്കൽ',
      status: 'ബാധിതം',
      symptoms: ['അറ്റങ്ങൾ/തുമ്പുകൾ ഉണങ്ങി തവിട്ട് നിറമാകുക.', 'ക്രമാതീതമായ ഉണക്കൽ.'],
      cause: ['WCLWD വിഭാഗത്തിലെ ഉണക്കൽ; വരൾച്ച/ഉപ്പുസമ്മർദ്ദം വർദ്ധിപ്പിക്കാം.'],
      remedy: ['ജലസേചനം മെച്ചപ്പെടുത്തുക.', 'വളരെ ഉണങ്ങിയ ഇലകൾ നീക്കുക.', 'വ്യാപകമെങ്കിൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['മൾച്ചിങ്.', 'ഉപ്പുജലം ഒഴിവാക്കുക; നല്ല ഡ്രൈനേജ്.', 'ആദ്യ ലക്ഷണത്തിൽ തന്നെ നടപടി.']
    },
    bn: {
      label: 'WCLWD: পাতার শুকিয়ে যাওয়া',
      status: 'আক্রান্ত',
      symptoms: ['পাতার কিনারা/ডগা শুকিয়ে বাদামি হওয়া।', 'ধীরে ধীরে শুকানো।'],
      cause: ['WCLWD ধরণের শুকানো; খরা/লবণাক্ততা বাড়াতে পারে।'],
      remedy: ['সেচ ব্যবস্থাপনা উন্নত করুন।', 'অতিরিক্ত শুকনো পাতা সরান।', 'বেশি হলে বিশেষজ্ঞের পরামর্শ।'],
      prevention: ['মালচিং।', 'লবণাক্ত জল এড়ান; ভালো নিকাশ।', 'শুরুতে ব্যবস্থা নিন।']
    },
    gu: {
      label: 'WCLWD: પાંદડાં સૂકાવું',
      status: 'અસરગ્રસ્ત',
      symptoms: ['કિનારા/ટિપ સૂકાઈને ભૂરો.', 'ધીમે ધીમે સૂકાવું.'],
      cause: ['WCLWD પ્રકારનું સૂકાવું; દુષ્કાળ/ખારાશ વધારી શકે.'],
      remedy: ['સિંચાઈ સુધારો.', 'ઘણાં સૂકા પાંદડા દૂર કરો.', 'વધે તો નિષ્ણાત સલાહ.'],
      prevention: ['મલ્ચિંગ.', 'ખારું પાણી ટાળો; સારો ડ્રેનેજ.', 'શરૂઆતમાં જ પગલાં.']
    },
    pa: {
      label: 'WCLWD: ਪੱਤਿਆਂ ਦਾ ਸੁੱਕਣਾ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਕਿਨਾਰੇ/ਸਿਰੇ ਸੁੱਕ ਕੇ ਭੂਰੇ ਹੋ ਜਾਣਾ।', 'ਹੌਲੀ-ਹੌਲੀ ਸੁੱਕਣਾ।'],
      cause: ['WCLWD ਕਿਸਮ ਦਾ ਸੁੱਕਣਾ; ਸੁੱਕਾ/ਖਾਰਾਪਣ ਵਧਾ ਸਕਦਾ ਹੈ।'],
      remedy: ['ਸਿੰਚਾਈ ਸੁਧਾਰੋ।', 'ਬਹੁਤ ਸੁੱਕੇ ਪੱਤੇ ਹਟਾਓ।', 'ਵੱਧੇ ਤਾਂ ਮਾਹਿਰ ਸਲਾਹ।'],
      prevention: ['ਮਲਚਿੰਗ।', 'ਖਾਰਾ ਪਾਣੀ ਨਾ ਵਰਤੋ; ਡਰੇਨੇਜ ਚੰਗਾ।', 'ਸ਼ੁਰੂ ਵਿੱਚ ਹੀ ਕਾਰਵਾਈ।']
    },
    or: {
      label: 'WCLWD: ପତ୍ର ଶୁଖିବା',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['କିନାରା/ଟିପ୍ ଶୁଖି କଳା/ଭୁରା ହେବା।', 'ଧୀରେ ଧୀରେ ଶୁଖିବା।'],
      cause: ['WCLWD ପ୍ରକାର ଶୁଖିବା; ଖରା/ଲବଣତା ବଢ଼ାଇପାରେ।'],
      remedy: ['ସିଞ୍ଚନ ସୁଧାରନ୍ତୁ।', 'ଅଧିକ ଶୁଖା ପତ୍ର ହଟାନ୍ତୁ।', 'ବଢିଲେ ତଜ୍ଞ ସଲାହ।'],
      prevention: ['ମଲ୍ଚିଂ।', 'ଖାରା ପାଣି ଟାଳନ୍ତୁ; ଡ୍ରେନେଜ୍ ଭଲ।', 'ଆରମ୍ଭରେ କାର୍ଯ୍ୟ।']
    },
    ur: {
      label: 'WCLWD: پتوں کا سوکھنا',
      status: 'متاثرہ',
      symptoms: ['کنارے/سِرے خشک ہو کر بھورے۔', 'آہستہ آہستہ سوکھنا۔'],
      cause: ['WCLWD جیسی خشکی؛ خشک سالی/نمکیات بڑھا سکتے ہیں۔'],
      remedy: ['آبپاشی بہتر کریں۔', 'زیادہ خشک پتے ہٹائیں۔', 'بڑھے تو ماہر سے مشورہ۔'],
      prevention: ['ملچنگ۔', 'نمکی پانی سے پرہیز؛ نکاسی اچھی رکھیں۔', 'شروع میں ہی اقدام۔']
    }
  },

  WCLWD_Flaccidity: {
    en: {
      label: 'WCLWD: Flaccidity',
      status: 'Diseased',
      symptoms: ['Leaflets appear limp/drooping and lose firmness.'],
      cause: ['Flaccidity symptom consistent with WCLWD category; often linked to water stress or physiological disruption.'],
      remedy: ['Ensure adequate irrigation and correct root-zone issues.', 'Provide balanced nutrition.', 'Consult experts if symptoms persist or spread.'],
      prevention: ['Maintain stable soil moisture and mulching.', 'Avoid root damage.', 'Regular scouting.'],
      fertilizers: [
        'Potassium-rich fertilizer: Muriate of Potash (MOP) @ 1-1.5 kg per palm to improve water regulation.',
        'Apply NPK 10:10:25 @ 2 kg per palm emphasizing potassium (K) for turgor maintenance.',
        'Calcium nitrate @ 200-300 g per palm to strengthen cell walls and improve water uptake.',
        'Root drench with seaweed extract or humic acid @ 50-100 ml per palm to stimulate root recovery.',
        'Adequate mulching with coconut husk/coir pith to conserve soil moisture.'
      ]
    },
    hi: {
      label: 'WCLWD: ढीलापन',
      status: 'रोग प्रभावित',
      symptoms: ['पत्तियाँ ढीली/लटकती हुई दिखती हैं।'],
      cause: ['WCLWD श्रेणी के अनुरूप ढीलापन; जल तनाव/शारीरिक बाधा से जुड़ा हो सकता है।'],
      remedy: ['पर्याप्त सिंचाई करें।', 'संतुलित पोषण दें।', 'लक्षण बने रहें तो विशेषज्ञ से सलाह लें।'],
      prevention: ['मिट्टी की नमी स्थिर रखें।', 'जड़ों को नुकसान से बचाएँ।', 'नियमित निरीक्षण करें।'],
      fertilizers: [
        'म्यूरेट ऑफ पोटाश (MOP) @ 1-1.5 किग्रा प्रति पेड़ जल नियंत्रण के लिए।',
        'NPK 10:10:25 @ 2 किग्रा प्रति पेड़ पोटैशियम पर जोर।',
        'कैल्शियम नाइट्रेट @ 200-300 ग्राम प्रति पेड़।',
        'समुद्री शैवाल/ह्यूमिक अम्ल @ 50-100 ml प्रति पेड़ जड़ ड्रेंच।',
        'नारियल की भूसी से मल्चिंग।'
      ]
    },
    mr: {
      label: 'WCLWD: शिथिलता',
      status: 'प्रभावित',
      symptoms: ['पाने ढिली/लटकलेली दिसतात.'],
      cause: ['पाण्याचा ताण किंवा शारीरिक अडथळा.'],
      remedy: ['पुरेसे सिंचन करा.', 'संतुलित पोषण द्या.', 'पसरल्यास तज्ज्ञ सल्ला.'],
      prevention: ['मातीतील ओलावा स्थिर ठेवा.', 'मुळांना इजा टाळा.', 'नियमित पाहणी.']
    },
    kn: {
      label: 'WCLWD: ತೂಗುವುದು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಎಲೆಗಳು ತೂಗುತ್ತವೆ/ದೃಢತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.'],
      cause: ['ನೀರಿನ ಒತ್ತಡ ಅಥವಾ ದೈಹಿಕ ಸಮಸ್ಯೆ.'],
      remedy: ['ಪರ್ಯಾಯ ನೀರಾವರಿ.', 'ಸಮತೋಲ ಪೋಷಣೆ.', 'ಮುಂದುವರಿದರೆ ತಜ್ಞ ಸಲಹೆ.'],
      prevention: ['ಮಣ್ಣಿನ ತೇವತೆ ಸ್ಥಿರ.', 'ಬೆರುಗಳಿಗೆ ಹಾನಿ ತಪ್ಪಿಸಿ.', 'ನಿಯಮಿತ ಪರಿಶೀಲನೆ.']
    },
    te: {
      label: 'WCLWD: సడలింపు',
      status: 'ప్రభావితం',
      symptoms: ['ఆకులు సడలిపోయి వాలిపోతాయి.'],
      cause: ['నీటి ఒత్తిడి లేదా శారీరక సమస్య.'],
      remedy: ['సరైన నీటిపారుదల.', 'సమతుల్య పోషణ.', 'తదుపరి కోసం నిపుణుల సలహా.'],
      prevention: ['మట్టి తేమ స్థిరంగా.', 'వేర్లకు నష్టం నివారించండి.', 'నియమిత పరిశీలన.']
    },
    ml: {
      label: 'WCLWD: തളർച്ച',
      status: 'ബാധിതം',
      symptoms: ['ഇലകൾ തളർന്ന് തൂങ്ങുന്നു.'],
      cause: ['ജലസമ്മർദ്ദം അല്ലെങ്കിൽ ശാരീരിക പ്രശ്നം.'],
      remedy: ['മതി ജലസേചനം.', 'സമതുലിത പോഷണം.', 'തുടർന്നാൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['മണ്ണിലെ ഈർപ്പം സ്ഥിരം.', 'വേരുകൾക്ക് ക്ഷതി ഒഴിവാക്കുക.', 'നിയമിത നിരീക്ഷണം.']
    },
    bn: {
      label: 'WCLWD: ঢিলে ভাব',
      status: 'আক্রান্ত',
      symptoms: ['পাতা ঢিলে/ঝুলে পড়ে।'],
      cause: ['জল চাপ বা শারীরবৃত্তীয় সমস্যা।'],
      remedy: ['পর্যাপ্ত সেচ।', 'সুষম পুষ্টি।', 'বাড়লে বিশেষজ্ঞ পরামর্শ।'],
      prevention: ['মাটির আর্দ্রতা স্থির রাখুন।', 'শিকড় ক্ষতি এড়ান।', 'নিয়মিত পর্যবেক্ষণ।']
    },
    gu: {
      label: 'WCLWD: ઢીલાશ',
      status: 'અસરગ્રસ્ત',
      symptoms: ['પાંદડા ઢીલા/લટકતા દેખાય.'],
      cause: ['પાણીનો તાણ અથવા શારીરિક સમસ્યા.'],
      remedy: ['પૂરતી સિંચાઈ.', 'સંતુલિત પોષણ.', 'વધે તો નિષ્ણાત સલાહ.'],
      prevention: ['માટી ભેજ સ્થિર.', 'મૂળને નુકસાન ટાળો.', 'નિયમિત નિરીક્ષણ.']
    },
    pa: {
      label: 'WCLWD: ਢੀਲਾਪਣ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਪੱਤੇ ਢੀਲੇ/ਝੁੱਕੇ ਹੋ ਜਾਂਦੇ ਹਨ।'],
      cause: ['ਪਾਣੀ ਦਾ ਤਣਾਅ ਜਾਂ ਸਰੀਰਕ ਸਮੱਸਿਆ।'],
      remedy: ['ਪੂਰੀ ਸਿੰਚਾਈ.', 'ਸੰਤੁਲਿਤ ਪੋਸ਼ਣ.', 'ਵੱਧੇ ਤਾਂ ਮਾਹਿਰ ਸਲਾਹ.'],
      prevention: ['ਮਿੱਟੀ ਦੀ ਨਮੀ ਸਥਿਰ.', 'ਜੜਾਂ ਨੂੰ ਨੁਕਸਾਨ ਨਾ ਹੋਵੇ.', 'ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ.']
    },
    or: {
      label: 'WCLWD: ଢିଲାପଣ',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ପତ୍ର ଢିଲା/ଲଟକିବା.'],
      cause: ['ଜଳ ଚାପ କିମ୍ବା ଶାରୀରିକ ସମସ୍ୟା.'],
      remedy: ['ପର୍ଯ୍ୟାପ୍ତ ସିଞ୍ଚନ.', 'ସମତୁଳିତ ପୋଷଣ.', 'ବଢିଲେ ତଜ୍ଞ ସଲାହ.'],
      prevention: ['ମାଟି ଆର୍ଦ୍ରତା ସ୍ଥିର.', 'ମୂଳ କ୍ଷତି ଟାଳନ୍ତୁ.', 'ନିୟମିତ ପର୍ଯ୍ୟବେକ୍ଷଣ.']
    },
    ur: {
      label: 'WCLWD: ڈھیلا پن',
      status: 'متاثرہ',
      symptoms: ['پتے ڈھیلے/لٹکے ہوئے۔'],
      cause: ['پانی کا دباؤ یا جسمانی مسئلہ۔'],
      remedy: ['مناسب آبپاشی۔', 'متوازن غذائیت۔', 'بڑھے تو ماہر سے مشورہ۔'],
      prevention: ['مٹی کی نمی مستحکم۔', 'جڑوں کو نقصان سے بچائیں۔', 'باقاعدہ نگرانی۔']
    }
  },

  WCLWD_Yellowing: {
    en: {
      label: 'WCLWD: Yellowing',
      status: 'Diseased',
      symptoms: ['Yellowing (chlorosis) of leaflets.', 'Reduced vigor and pale appearance.'],
      cause: ['Yellowing symptom consistent with WCLWD category; may be related to nutrient imbalance or root stress.'],
      remedy: ['Check irrigation and drainage.', 'Follow recommended fertilizer schedule; include micronutrients if needed.', 'Seek expert diagnosis if progressive.'],
      prevention: ['Maintain balanced fertilization and organic matter.', 'Avoid prolonged flooding or drought.', 'Early identification and removal of severely affected fronds.'],
      fertilizers: [
        'Iron sulfate (Ferrous sulfate) @ 50-100 g per palm as soil application to correct chlorosis.',
        'Chelated iron spray @ 0.5% concentration as foliar application for quick greening effect.',
        'Apply NPK 12:12:17 @ 2 kg per palm with emphasis on potassium for stress tolerance.',
        'Magnesium sulfate @ 250 g per palm if Mg deficiency suspected (common in sandy soils).',
        'Organic compost @ 30-40 kg per palm to improve soil structure and nutrient retention.'
      ]
    },
    hi: {
      label: 'WCLWD: पीलापन',
      status: 'रोग प्रभावित',
      symptoms: ['पत्तियों का पीला पड़ना।', 'विकास कम और रंग फीका।'],
      cause: ['WCLWD श्रेणी के अनुरूप पीलापन; पोषक असंतुलन/जड़ तनाव से जुड़ा हो सकता है।'],
      remedy: ['सिंचाई/निकास जाँचें।', 'खाद कार्यक्रम अपनाएँ।', 'यदि बढ़े तो विशेषज्ञ से सलाह लें।'],
      prevention: ['संतुलित पोषण रखें।', 'जलभराव/सूखे से बचें।', 'बहुत प्रभावित पत्तियाँ हटाएँ।'],
      fertilizers: [
        'आयरन सल्फेट @ 50-100 ग्राम प्रति पेड़ पीलापन ठीक करने के लिए।',
        'चेलेटेड आयरन स्प्रे @ 0.5% पत्ते पर छिड़काव जल्दी हरियाली के लिए।',
        'NPK 12:12:17 @ 2 किग्रा प्रति पेड़ पोटैशियम जोर के साथ।',
        'मैग्नीशियम सल्फेट @ 250 ग्राम प्रति पेड़ यदि Mg की कमी हो।',
        'जैविक खाद @ 30-40 किग्रा प्रति पेड़।'
      ]
    },
    mr: {
      label: 'WCLWD: पिवळेपणा',
      status: 'प्रभावित',
      symptoms: ['पाने पिवळी पडणे.', 'वाढ कमी/फिकट दिसणे.'],
      cause: ['पोषक असंतुलन किंवा मुळांवरील ताण.'],
      remedy: ['सिंचन/निचरा तपासा.', 'खत कार्यक्रम पाळा.', 'वाढल्यास तज्ज्ञ सल्ला.'],
      prevention: ['संतुलित खत.', 'जलभराव/दुष्काळ टाळा.', 'जास्त प्रभावित पाने काढा.']
    },
    kn: {
      label: 'WCLWD: ಹಳದಿಮು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಎಲೆಗಳು ಹಳದಿ ಆಗುವುದು.', 'ವೃದ್ಧಿ ಕಡಿಮೆಯಾಗುವುದು.'],
      cause: ['ಪೋಷಕ ಅಸಮತೋಲನ ಅಥವಾ ಬೇರು ಒತ್ತಡ.'],
      remedy: ['ನೀರಾವರಿ/ಡ್ರೈನೇಜ್ ಪರಿಶೀಲನೆ.', 'ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ.', 'ಮುಂದುವರಿದರೆ ತಜ್ಞ ಸಲಹೆ.'],
      prevention: ['ಸಮತೋಲ ಪೋಷಣೆ.', 'ಜಲಾವೃತ/ಬರ ತಪ್ಪಿಸಿ.', 'ತೀವ್ರ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.']
    },
    te: {
      label: 'WCLWD: పసుపు',
      status: 'ప్రభావితం',
      symptoms: ['ఆకులు పసుపు కావడం.', 'వృద్ధి తగ్గడం.'],
      cause: ['పోషక అసమతుల్యత లేదా వేర్ల ఒత్తిడి.'],
      remedy: ['నీరు/డ్రైనేజ్ తనిఖీ.', 'ఎరువు షెడ్యూల్ అనుసరించండి.', 'పెరిగితే నిపుణుల సలహా.'],
      prevention: ['సమతుల్య ఎరువు.', 'నీటి నిల్వ/కరువు నివారించండి.', 'తీవ్ర ఆకులు తొలగించండి.']
    },
    ml: {
      label: 'WCLWD: മഞ്ഞമാറ്റം',
      status: 'ബാധിതം',
      symptoms: ['ഇലകൾ മഞ്ഞയാകുക.', 'വളർച്ച കുറയുക.'],
      cause: ['പോഷക അസന്തുലനം അല്ലെങ്കിൽ വേര്സമ്മർദ്ദം.'],
      remedy: ['ജലസേചനം/ഡ്രൈനേജ് പരിശോധിക്കുക.', 'വള ഷെഡ്യൂൾ പിന്തുടരുക.', 'വ്യാപകമെങ്കിൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['സമതുലിത വളം.', 'ജലക്കെട്ട്/വരൾച്ച ഒഴിവാക്കുക.', 'കൂടുതൽ ബാധിച്ച ഇലകൾ നീക്കുക.']
    },
    bn: {
      label: 'WCLWD: হলদে হওয়া',
      status: 'আক্রান্ত',
      symptoms: ['পাতা হলদে হওয়া।', 'বৃদ্ধি কমে যাওয়া।'],
      cause: ['পুষ্টি ভারসাম্যহীনতা বা শিকড় চাপ।'],
      remedy: ['সেচ/নিকাশ পরীক্ষা।', 'সার সূচি অনুসরণ।', 'বাড়লে বিশেষজ্ঞ পরামর্শ।'],
      prevention: ['সুষম সার।', 'দীর্ঘ জলাবদ্ধতা/খরা এড়ান।', 'খুব আক্রান্ত পাতা সরান।']
    },
    gu: {
      label: 'WCLWD: પીળાશ',
      status: 'અસરગ્રસ્ત',
      symptoms: ['પાંદડા પીળા થવા.', 'વૃદ્ધિ ઘટે.'],
      cause: ['પોષક અસંતુલન અથવા મૂળ તાણ.'],
      remedy: ['સિંચાઈ/ડ્રેનેજ ચકાસો.', 'ખાતર કાર્યક્રમ અનુસરો.', 'વધે તો નિષ્ણાત સલાહ.'],
      prevention: ['સંતુલિત ખાતર.', 'જળભરાવ/દુષ્કાળ ટાળો.', 'ઘણું અસરગ્રસ્ત પાંદડા દૂર કરો.']
    },
    pa: {
      label: 'WCLWD: ਪੀਲਾਪਣ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਪੱਤੇ ਪੀਲੇ ਹੋਣਾ।', 'ਵਾਧਾ ਘਟਣਾ।'],
      cause: ['ਪੋਸ਼ਕ ਅਸਮਤੁਲਨ ਜਾਂ ਜੜਾਂ ਦਾ ਤਣਾਅ।'],
      remedy: ['ਸਿੰਚਾਈ/ਡਰੇਨੇਜ ਚੈੱਕ ਕਰੋ।', 'ਖਾਦ ਸ਼ਡਿਊਲ ਫਾਲੋ ਕਰੋ।', 'ਵਧੇ ਤਾਂ ਮਾਹਿਰ ਸਲਾਹ।'],
      prevention: ['ਸੰਤੁਲਿਤ ਖਾਦ।', 'ਜਲਭਰਾਵ/ਸੁੱਕਾ ਤੋਂ ਬਚੋ।', 'ਜਿਆਦਾ ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਹਟਾਓ।']
    },
    or: {
      label: 'WCLWD: ହଳଦିଆ',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ପତ୍ର ହଳଦିଆ ହେବା।', 'ବୃଦ୍ଧି କମିବା।'],
      cause: ['ପୋଷକ ଅସମତୁଳନ କିମ୍ବା ମୂଳ ଚାପ।'],
      remedy: ['ସିଞ୍ଚନ/ଡ୍ରେନେଜ୍ ଯାଞ୍ଚ।', 'ସାର କାର୍ଯ୍ୟକ୍ରମ ଅନୁସରଣ।', 'ବଢିଲେ ତଜ୍ଞ ସଲାହ।'],
      prevention: ['ସମତୁଳିତ ସାର।', 'ଜଳାବଦ୍ଧତା/ଖରା ଟାଳନ୍ତୁ।', 'ଅଧିକ ପ୍ରଭାବିତ ପତ୍ର ହଟାନ୍ତୁ।']
    },
    ur: {
      label: 'WCLWD: پیلاہٹ',
      status: 'متاثرہ',
      symptoms: ['پتے پیلے ہونا۔', 'کمزور بڑھوتری۔'],
      cause: ['غذائی عدم توازن یا جڑوں کا دباؤ۔'],
      remedy: ['آبپاشی/نکاسی چیک کریں۔', 'کھاد کا شیڈول اپنائیں۔', 'بڑھے تو ماہر سے مشورہ۔'],
      prevention: ['متوازن کھاد۔', 'لمبی پانی بھراؤ/خشکی سے بچیں۔', 'زیادہ متاثرہ پتے ہٹائیں۔']
    }
  }
}

export function getDiseaseInfo(diseaseKey, lang, fallback = null) {
  const key = String(diseaseKey || '')
  const code = String(lang || 'en').toLowerCase()

  const byDisease = DISEASE_INFO[key]
  if (!byDisease) {
    return fallback
  }

  return byDisease[code] || byDisease.en || fallback
}
