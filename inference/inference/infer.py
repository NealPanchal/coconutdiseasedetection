import io
import os
import re
import sys
from functools import lru_cache
from typing import Optional

import torch
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
from torchvision import models, transforms

app = FastAPI(title="Coconut Leaf Disease Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== DEVICE =====
def _resolve_device() -> torch.device:
    mps_backend = getattr(torch.backends, "mps", None)
    if mps_backend is not None and mps_backend.is_available():
        return torch.device("mps")
    return torch.device("cpu")


device = _resolve_device()

# ===== CLASSES (6 — MUST MATCH TRAINING) =====
class_names = [
    "Caterpillars",
    "CCI_Leaflets",
    "Healthy_Leaves",
    "WCLWD_DryingofLeaflets",
    "WCLWD_Flaccidity",
    "WCLWD_Yellowing"
]

REPORTS_EN = {
    "Healthy_Leaves": {
        "status": "Healthy",
        "cause": [
            "No visible disease symptoms detected in the provided leaf image.",
            "Minor natural color variation can occur due to age, lighting, or variety.",
        ],
        "symptoms": [
            "Uniform green color and normal leaflet texture.",
            "No distinct yellowing, drying, flaccidity, or pest feeding marks.",
        ],
        "remedies": [
            "Maintain regular irrigation schedule and avoid waterlogging.",
            "Apply balanced nutrition (NPK + micronutrients) based on soil test.",
            "Continue routine field scouting once per week.",
        ],
        "prevention": [
            "Keep the crown clean and remove old/dry fronds periodically.",
            "Use clean planting material and follow recommended spacing.",
            "Monitor for early pest activity (caterpillars/mites) and act early.",
        ],
        "fertilizers": [
            "Apply NPK 14:14:14 @ 1.5 kg per palm twice a year (June-July and November-December).",
            "Supplement with organic manure (FYM/compost) @ 25-50 kg per palm annually.",
            "Micronutrient spray: Mix Borax (0.2%), Zinc sulfate (0.5%), Magnesium sulfate (1%) - spray every 3-4 months.",
            "For coastal areas, consider salt-tolerant varieties and additional potassium (25-50% more).",
        ],
    },
    "Caterpillars": {
        "status": "Diseased",
        "cause": [
            "Caterpillar infestation feeding on leaf tissue.",
            "Higher risk during warm/humid periods and in dense canopies.",
        ],
        "symptoms": [
            "Irregular holes or chewed edges on leaflets.",
            "Skeletonization (leaf tissue eaten leaving veins).",
            "Presence of larvae, frass (droppings), or webbing.",
        ],
        "remedies": [
            "Physically remove and destroy visible larvae (small infestations).",
            "Encourage biological control (natural predators/parasitoids).",
            "If severe, use an approved biopesticide (e.g., Bt-based) or recommended insecticide as per local agriculture guidelines.",
        ],
        "prevention": [
            "Regular monitoring, especially on young palms and new flush leaves.",
            "Avoid excessive nitrogen which can attract pests.",
            "Maintain field sanitation and reduce alternate host plants.",
        ],
        "fertilizers": [
            "Use Bacillus thuringiensis (Bt) spray @ 1-2 g/liter water, apply every 7-10 days until infestation clears.",
            "Apply Neem oil solution @ 3-5 ml/liter water as organic pest control and foliar spray.",
            "Reduce nitrogen fertilizer temporarily; use balanced NPK 10:10:20 instead of high-N formulas.",
            "Support plant recovery with potassium-rich fertilizer (Muriate of Potash @ 0.5 kg/palm) after pest control.",
        ],
    },
    "CCI_Leaflets": {
        "status": "Diseased",
        "cause": [
            "Leaflet injury/stress category captured in the dataset (commonly associated with nutrient stress, minor infections, or environmental stress).",
            "Could be influenced by moisture stress, micronutrient deficiency, or early-stage infection patterns.",
        ],
        "symptoms": [
            "Patchy discoloration on leaflets.",
            "Mild spots or uneven chlorosis without clear WCLWD pattern.",
            "Localized damage that may not uniformly spread across the leaf.",
        ],
        "remedies": [
            "Improve field nutrition: apply balanced NPK and consider magnesium/boron if deficiency is suspected.",
            "Remove heavily damaged leaflets to reduce secondary infection sources.",
            "If spotting increases, consult local experts for targeted fungicide/insecticide recommendation.",
        ],
        "prevention": [
            "Maintain irrigation consistency and avoid drought stress.",
            "Conduct periodic soil and leaf nutrient analysis.",
            "Use clean tools and avoid mechanical damage during farm operations.",
        ],
        "fertilizers": [
            "Apply Magnesium sulfate (Epsom salt) @ 200-300 g per palm as soil application or foliar spray (2%).",
            "Borax @ 50-100 g per palm mixed with sand for even soil distribution (apply once a year).",
            "Zinc sulfate @ 0.5% foliar spray (400-500 g in 100 liters water for 100 palms).",
            "Balanced NPK 15:15:15 @ 1.5 kg per palm to correct overall nutrient balance.",
            "Organic option: Apply neem cake @ 5 kg per palm to improve soil health and micronutrient availability.",
        ],
    },
    "WCLWD_Yellowing": {
        "status": "Diseased",
        "cause": [
            "Yellowing symptom consistent with WCLWD category in dataset.",
            "May be associated with nutrient imbalance, root stress, or disease progression.",
        ],
        "symptoms": [
            "Yellowing of leaflets (chlorosis), often starting at tips or margins.",
            "Reduced vigor and pale appearance compared to healthy leaves.",
        ],
        "remedies": [
            "Check irrigation and drainage; correct water stress.",
            "Apply recommended fertilizer schedule; include micronutrients if needed.",
            "If widespread and progressive, seek expert diagnosis to confirm WCLWD and follow regional management protocol.",
        ],
        "prevention": [
            "Maintain balanced fertilization and organic matter in soil.",
            "Avoid prolonged flooding or drought.",
            "Early identification and removal of severely affected fronds can reduce stress load on the palm.",
        ],
        "fertilizers": [
            "Iron sulfate (Ferrous sulfate) @ 50-100 g per palm as soil application to correct chlorosis.",
            "Chelated iron spray @ 0.5% concentration as foliar application for quick greening effect.",
            "Apply NPK 12:12:17 @ 2 kg per palm with emphasis on potassium for stress tolerance.",
            "Magnesium sulfate @ 250 g per palm if Mg deficiency suspected (common in sandy soils).",
            "Organic compost @ 30-40 kg per palm to improve soil structure and nutrient retention.",
        ],
    },
    "WCLWD_Flaccidity": {
        "status": "Diseased",
        "cause": [
            "Flaccidity symptom consistent with WCLWD category in dataset.",
            "Often linked to water stress, vascular/physiological disruption, or advanced disease stress.",
        ],
        "symptoms": [
            "Leaflets appear limp, drooping, and lose firmness.",
            "Overall reduction in leaf turgor.",
        ],
        "remedies": [
            "Ensure adequate irrigation and correct any root-zone issues (compaction, poor drainage).",
            "Apply balanced nutrition to support recovery.",
            "If symptoms persist or spread, consult local agriculture department for WCLWD confirmation and management guidance.",
        ],
        "prevention": [
            "Maintain proper soil moisture and mulching to stabilize root-zone temperature.",
            "Avoid damaging roots during inter-cultivation.",
            "Regular scouting for early warning signs.",
        ],
        "fertilizers": [
            "Potassium-rich fertilizer: Muriate of Potash (MOP) @ 1-1.5 kg per palm to improve water regulation.",
            "Apply NPK 10:10:25 @ 2 kg per palm emphasizing potassium (K) for turgor maintenance.",
            "Calcium nitrate @ 200-300 g per palm to strengthen cell walls and improve water uptake.",
            "Root drench with seaweed extract or humic acid @ 50-100 ml per palm to stimulate root recovery.",
            "Adequate mulching with coconut husk/coir pith to conserve soil moisture.",
        ],
    },
    "WCLWD_DryingofLeaflets": {
        "status": "Diseased",
        "cause": [
            "Drying symptom consistent with WCLWD category in dataset.",
            "Can be intensified by drought, salt stress, or disease-related decline.",
        ],
        "symptoms": [
            "Leaflet tips/edges dry out and turn brown.",
            "Brittle texture and progressive drying from tip to base.",
        ],
        "remedies": [
            "Improve irrigation scheduling; avoid moisture stress.",
            "Apply potash-rich fertilization if recommended by local guidelines.",
            "Remove severely dried fronds and maintain sanitation.",
        ],
        "prevention": [
            "Mulching and organic matter addition to conserve moisture.",
            "Avoid saline irrigation water and ensure good drainage.",
            "Monitor early drying symptoms and act before progression.",
        ],
        "fertilizers": [
            "Sulphate of Potash (SOP) @ 1.5-2 kg per palm (preferred over MOP in saline conditions).",
            "Apply NPK 8:8:16 @ 2 kg per palm with double potassium ratio for drought tolerance.",
            "Gypsum @ 500 g per palm if soil salinity is an issue (helps leach excess salts).",
            "Foliar spray of potassium nitrate @ 1% (10 g/liter) for quick recovery.",
            "Organic mulch (coconut husk, straw) @ 50-75 kg around the palm basin to reduce evaporation.",
        ],
    },
}


REPORTS_I18N = {
    "en": REPORTS_EN,
    "hi": {
        "Healthy_Leaves": {
            "status": "स्वस्थ",
            "cause": [
                "दी गई पत्ती की तस्वीर में स्पष्ट रोग लक्षण नहीं दिखे।",
                "पत्ती की उम्र/रोशनी/प्रजाति के कारण हल्का रंग-परिवर्तन स्वाभाविक हो सकता है।",
            ],
            "symptoms": [
                "समान हरा रंग और सामान्य बनावट।",
                "पीला पड़ना/सूखना/ढीलापन/कीट-खुरचन जैसे स्पष्ट संकेत नहीं।",
            ],
            "remedies": [
                "नियमित सिंचाई रखें और जलभराव से बचें।",
                "मिट्टी परीक्षण के अनुसार संतुलित खाद (NPK + सूक्ष्म पोषक) दें।",
                "साप्ताहिक निरीक्षण जारी रखें।",
            ],
            "prevention": [
                "पुरानी/सूखी पत्तियाँ समय-समय पर हटाएँ।",
                "स्वच्छ रोपण सामग्री और उचित दूरी अपनाएँ।",
                "कीट गतिविधि की शुरुआती निगरानी करें और समय पर नियंत्रण करें।",
            ],
            "fertilizers": [
                "NPK 14:14:14 @ 1.5 किग्रा प्रति पेड़ वर्ष में दो बार (जून-जुलाई और नवंबर-दिसंबर) लगाएं।",
                "गोबर की खाद/कम्पोस्ट @ 25-50 किग्रा प्रति पेड़ सालाना मिलाएं।",
                "सूक्ष्म पोषक स्प्रे: बोरेक्स (0.2%), जिंक सल्फेट (0.5%), मैग्नीशियम सल्फेट (1%) मिश्रण - हर 3-4 महीने स्प्रे करें।",
                "तटीय क्षेत्रों के लिए अतिरिक्त पोटैशियम (25-50% अधिक) दें।",
            ],
        },
        "Caterpillars": {
            "status": "रोग/कीट प्रभावित",
            "cause": [
                "सूंडी/इल्ली द्वारा पत्ती के ऊतक को खाना।",
                "गरम-नम मौसम और घनी छाया में जोखिम बढ़ता है।",
            ],
            "symptoms": [
                "पत्तियों में अनियमित छेद या कटी किनारियाँ।",
                "स्केलेटनाइज़ेशन (नसें बचकर ऊतक खा जाना)।",
                "इल्ली, मल (frass) या जाला दिखाई देना।",
            ],
            "remedies": [
                "कम संक्रमण में दिखाई देने वाली इल्ली को हटाकर नष्ट करें।",
                "जैविक नियंत्रण (प्राकृतिक शत्रु/परजीवी) को बढ़ावा दें।",
                "अधिक संक्रमण में स्थानीय कृषि सलाह अनुसार Bt-आधारित जैव-कीटनाशी या अनुशंसित कीटनाशी का उपयोग करें।",
            ],
            "prevention": [
                "नियमित निगरानी, खासकर नई/कोमल पत्तियों पर।",
                "अधिक नाइट्रोजन से बचें (कीट आकर्षित हो सकते हैं)।",
                "खेत की सफाई रखें और वैकल्पिक पोषक पौधों को कम करें।",
            ],
            "fertilizers": [
                "Bacillus thuringiensis (Bt) स्प्रे @ 1-2 ग्राम/लीटर पानी, संक्रमण खत्म होने तक हर 7-10 दिन लगाएं।",
                "नीम तेल घोल @ 3-5 मिली/लीटर पानी कीट नियंत्रण और पत्ते स्प्रे के लिए।",
                "नाइट्रोजन खाद अस्थायी रूप से कम करें; NPK 10:10:20 का उपयोग करें।",
                "कीट नियंत्रण के बाद पोटैशियम युक्त खाद (म्यूरेट ऑफ पोटाश @ 0.5 किग्रा/पेड़) दें।",
            ],
        },
        "CCI_Leaflets": {
            "status": "प्रभावित",
            "cause": [
                "डेटासेट में यह श्रेणी अक्सर तनाव/हल्के संक्रमण/पोषक असंतुलन से जुड़ी होती है।",
                "नमी तनाव, सूक्ष्म पोषक कमी या शुरुआती संक्रमण पैटर्न का प्रभाव हो सकता है।",
            ],
            "symptoms": [
                "पत्ती के भागों में धब्बेदार रंग-परिवर्तन।",
                "हल्के धब्बे या असमान पीलापन।",
                "क्षति स्थानीय हो सकती है और पूरे पत्ते में समान नहीं फैलती।",
            ],
            "remedies": [
                "संतुलित पोषण दें; संदेह होने पर मैग्नीशियम/बोरॉन पर ध्यान दें।",
                "बहुत क्षतिग्रस्त भाग हटाएँ ताकि द्वितीयक संक्रमण कम हो।",
                "लक्षण बढ़ें तो लक्षित उपचार के लिए विशेषज्ञ से सलाह लें।",
            ],
            "prevention": [
                "सिंचाई नियमित रखें और सूखे तनाव से बचें।",
                "समय-समय पर मिट्टी/पत्ती पोषक परीक्षण करें।",
                "कृषि कार्यों के दौरान यांत्रिक चोट से बचें।",
            ],
            "fertilizers": [
                "मैग्नीशियम सल्फेट @ 200-300 ग्राम प्रति पेड़ मिट्टी में या 2% पत्ते स्प्रे।",
                "बोरेक्स @ 50-100 ग्राम प्रति पेड़ रेत के साथ मिलाकर (साल में एक बार)।",
                "जिंक सल्फेट @ 0.5% पत्ते स्प्रे (100 पेड़ों के लिए 100 लीटर पानी में 400-500 ग्राम)।",
                "संतुलित NPK 15:15:15 @ 1.5 किग्रा प्रति पेड़।",
                "नीम की खली @ 5 किग्रा प्रति पेड़ मिट्टी की सेहत सुधारने के लिए।",
            ],
        },
        "WCLWD_Yellowing": {
            "status": "रोग प्रभावित",
            "cause": [
                "डेटासेट की WCLWD श्रेणी के अनुरूप पीलापन।",
                "पोषक असंतुलन, जड़ तनाव या रोग प्रगति से जुड़ा हो सकता है।",
            ],
            "symptoms": [
                "पत्तियों का पीला पड़ना (क्लोरोसिस), अक्सर किनारों/सिरे से।",
                "पौधे की ताकत कम और रंग फीका।",
            ],
            "remedies": [
                "सिंचाई/निकास जाँचें; जल तनाव सुधारें।",
                "अनुशंसित खाद कार्यक्रम अपनाएँ; जरूरत पर सूक्ष्म पोषक दें।",
                "यदि तेजी से बढ़े तो पुष्टि के लिए स्थानीय विशेषज्ञ से सलाह लें।",
            ],
            "prevention": [
                "संतुलित पोषण और जैविक पदार्थ बनाए रखें।",
                "लंबे समय तक जलभराव या सूखा न होने दें।",
                "बहुत प्रभावित पत्तियाँ हटाकर पौधे का तनाव कम करें।",
            ],
            "fertilizers": [
                "आयरन सल्फेट @ 50-100 ग्राम प्रति पेड़ पीलापन ठीक करने के लिए।",
                "चेलेटेड आयरन स्प्रे @ 0.5% पत्ते पर छिड़काव जल्दी हरियाली के लिए।",
                "NPK 12:12:17 @ 2 किग्रा प्रति पेड़ पोटैशियम जोर के साथ।",
                "मैग्नीशियम सल्फेट @ 250 ग्राम प्रति पेड़ यदि Mg की कमी हो।",
                "जैविक खाद @ 30-40 किग्रा प्रति पेड़।",
            ],
        },
        "WCLWD_Flaccidity": {
            "status": "रोग प्रभावित",
            "cause": [
                "डेटासेट की WCLWD श्रेणी के अनुरूप पत्तियों का ढीलापन।",
                "जल तनाव या शारीरिक/वस्कुलर बाधा से जुड़ा हो सकता है।",
            ],
            "symptoms": [
                "पत्तियाँ ढीली/लटकती हुई दिखती हैं।",
                "turgor (कड़कपन) कम हो जाता है।",
            ],
            "remedies": [
                "पर्याप्त सिंचाई सुनिश्चित करें; जड़ क्षेत्र की समस्या सुधारें।",
                "संतुलित पोषण दें।",
                "लक्षण बने रहें तो विशेषज्ञ से पुष्टि/सलाह लें।",
            ],
            "prevention": [
                "मिट्टी की नमी स्थिर रखें; मल्चिंग करें।",
                "जड़ों को नुकसान से बचाएँ।",
                "नियमित निरीक्षण करें।",
            ],
            "fertilizers": [
                "म्यूरेट ऑफ पोटाश (MOP) @ 1-1.5 किग्रा प्रति पेड़ जल नियंत्रण के लिए।",
                "NPK 10:10:25 @ 2 किग्रा प्रति पेड़ पोटैशियम पर जोर।",
                "कैल्शियम नाइट्रेट @ 200-300 ग्राम प्रति पेड़।",
                "समुद्री शैवाल/ह्यूमिक अम्ल @ 50-100 ml प्रति पेड़ जड़ ड्रेंच।",
                "नारियल की भूसी से मल्चिंग।",
            ],
        },
        "WCLWD_DryingofLeaflets": {
            "status": "रोग प्रभावित",
            "cause": [
                "डेटासेट की WCLWD श्रेणी के अनुरूप पत्तियों का सूखना।",
                "सूखा, लवणता या रोग तनाव से बढ़ सकता है।",
            ],
            "symptoms": [
                "पत्ती के किनारे/सिरे भूरे होकर सूखना।",
                "भंगुर बनावट और धीरे-धीरे सूखना।",
            ],
            "remedies": [
                "सिंचाई सुधारें और नमी तनाव से बचें।",
                "स्थानीय सिफारिश अनुसार पोटाश युक्त खाद पर विचार करें।",
                "बहुत सूखी पत्तियाँ हटाकर सफाई रखें।",
            ],
            "prevention": [
                "मल्चिंग/जैविक पदार्थ से नमी संरक्षण।",
                "खारे पानी से बचें और अच्छी निकासी।",
                "शुरुआती लक्षणों पर जल्दी कार्रवाई करें।",
            ],
            "fertilizers": [
                "सल्फेट ऑफ पोटाश (SOP) @ 1.5-2 किग्रा प्रति पेड़ (नमकीन मिट्टी में MOP से बेहतर)।",
                "NPK 8:8:16 @ 2 किग्रा प्रति पेड़ दोगुनी पोटैशियम के साथ।",
                "जिप्सम @ 500 ग्राम प्रति पेड़ यदि नमक तनाव हो।",
                "पोटैशियम नाइट्रेट @ 1% स्प्रे (10 ग्राम/लीटर) जल्दी रिकवरी के लिए।",
                "जैविक मल्च (नारियल भूसी, पुआल) @ 50-75 किग्रा।",
            ],
        },
    },
    "ta": {
        "Healthy_Leaves": {
            "status": "ஆரோக்கியம்",
            "cause": [
                "கொடுக்கப்பட்ட படத்தில் நோய் அறிகுறிகள் தெளிவாக தெரியவில்லை.",
                "இலை வயது/ஒளி/வகை காரணமாக லேசான நிற மாற்றம் இயல்பானது.",
            ],
            "symptoms": [
                "ஒரே மாதிரியான பச்சை நிறம் மற்றும் இயல்பான இலை அமைப்பு.",
                "மஞ்சளாகுதல்/உலர்வு/தளர்வு/கீடுகள் கடித்த தடயங்கள் இல்லை.",
            ],
            "remedies": [
                "முறையான பாசனம்; நீர் தேக்கம் தவிர்க்கவும்.",
                "மண் பரிசோதனைப்படி சமநிலை உரம் (NPK + சிறு சத்துக்கள்).",
                "வாராந்திர கண்காணிப்பு தொடரவும்.",
            ],
            "prevention": [
                "பழைய/உலர்ந்த இலைகளை நீக்கவும்.",
                "சுத்தமான நாற்று மற்றும் பரிந்துரைக்கப்பட்ட இடைவெளி.",
                "கீடுகள் ஆரம்ப நிலையிலேயே கண்டறிந்து கட்டுப்படுத்தவும்.",
            ],
        },
        "Caterpillars": {
            "status": "பாதிப்பு",
            "cause": [
                "இலை திசுக்களை இலைப்புழுக்கள் (caterpillars) தின்னுதல்.",
                "வெப்பம்/ஈரப்பதம் மற்றும் அடர்ந்த இலைகள் உள்ள இடங்களில் அதிக வாய்ப்பு.",
            ],
            "symptoms": [
                "இலைகளில் ஒழுங்கற்ற துளைகள் அல்லது கடித்த விளிம்புகள்.",
                "இலை திசு கரைய, நரம்புகள் மட்டும் மிச்சமாகுதல்.",
                "இலைப்புழு/மலம்/வலைப்பின்னல் காணப்படுதல்.",
            ],
            "remedies": [
                "குறைந்த தாக்கத்தில் புழுக்களை கையால் அகற்றி அழிக்கவும்.",
                "இயற்கை எதிரிகள்/பராசிட்கள் மூலம் உயிரியல் கட்டுப்பாட்டை ஊக்குவிக்கவும்.",
                "அதிகமாக இருந்தால் உள்ளூர் வழிகாட்டுதல்படி Bt அடிப்படையிலான உயிர்க்கீடொல்லி அல்லது பரிந்துரைக்கப்பட்ட மருந்து பயன்படுத்தவும்.",
            ],
            "prevention": [
                "புதிய இலைகளில் அடிக்கடி கண்காணிப்பு.",
                "அதிக நைட்ரஜன் உரம் தவிர்க்கவும்.",
                "தோட்ட சுத்தம் மற்றும் மாற்று புரவலன் செடிகளை குறைக்கவும்.",
            ],
        },
        "CCI_Leaflets": {
            "status": "பாதிப்பு",
            "cause": [
                "இந்த வகை பெரும்பாலும் சத்து குறைவு/சூழல் அழுத்தம்/தொடக்க நிலை பாதிப்புகளுடன் தொடர்புடையதாக இருக்கும்.",
                "நீர்ப்பாசன அழுத்தம் அல்லது சிறுசத்துக் குறைவு காரணமாக இருக்கலாம்.",
            ],
            "symptoms": [
                "இலைத் துண்டுகளில் தழும்பான நிறமாற்றம்.",
                "மிதமான புள்ளிகள் அல்லது ஒற்றுமையற்ற மஞ்சள்மை.",
                "உள்ளூர் சேதம், முழு இலையிலும் சமமாக இல்லாமை.",
            ],
            "remedies": [
                "சமநிலை உரமிடல்; தேவையெனில் மெக்னீசியம்/போரான் போன்ற சிறுசத்துக்கள்.",
                "கடுமையாக பாதிக்கப்பட்ட பகுதிகளை அகற்றவும்.",
                "அறிகுறிகள் அதிகரித்தால் நிபுணர் ஆலோசனை பெறவும்.",
            ],
            "prevention": [
                "ஒழுங்கான பாசனம்; வறட்சியை தவிர்க்கவும்.",
                "மண்/இலை சத்து பரிசோதனை செய்யவும்.",
                "விவசாய பணிகளில் இயந்திர சேதம் தவிர்க்கவும்.",
            ],
        },
        "WCLWD_Yellowing": {
            "status": "பாதிப்பு",
            "cause": [
                "WCLWD வகையை ஒத்த மஞ்சள்மையைக் காட்டுகிறது.",
                "சத்து சமநிலை இல்லாமை அல்லது வேரழுத்தம் காரணமாக இருக்கலாம்.",
            ],
            "symptoms": [
                "இலைத் துண்டுகள் மஞ்சளாகுதல்.",
                "செடியின் வளர்ச்சி குறைவு, வெளிர் தோற்றம்.",
            ],
            "remedies": [
                "நீர் நிலை/வடிகால் சரிபார்த்து சரி செய்யவும்.",
                "பரிந்துரைக்கப்பட்ட உர அட்டவணையை பின்பற்றவும்.",
                "தொடர்ந்தால் நிபுணர் மூலம் உறுதி செய்து நடவடிக்கை எடுக்கவும்.",
            ],
            "prevention": [
                "சமநிலை உரமிடல் மற்றும் கரிமப் பொருள்.",
                "நீர் தேக்கம்/வறட்சி தவிர்க்கவும்.",
                "கடுமையாக பாதித்த இலைகளை அகற்றி அழுத்தத்தை குறைக்கவும்.",
            ],
        },
        "WCLWD_Flaccidity": {
            "status": "பாதிப்பு",
            "cause": [
                "WCLWD வகையை ஒத்த தளர்வுத் தன்மை.",
                "நீரழுத்தம் அல்லது உடலியல் பாதிப்பு காரணமாக இருக்கலாம்.",
            ],
            "symptoms": [
                "இலைத் துண்டுகள் தளர்ந்து தொங்குதல்.",
                "திடத்தன்மை குறைவு.",
            ],
            "remedies": [
                "பாசனம் சரி செய்யவும்; வேர்பகுதி பிரச்சினைகள் சரி செய்யவும்.",
                "சமநிலை ஊட்டச்சத்து வழங்கவும்.",
                "தொடர்ந்தால் உள்ளூர் நிபுணர் ஆலோசனை பெறவும்.",
            ],
            "prevention": [
                "முல்ச்சிங் மூலம் மண் ஈரப்பதம் நிலைநிறுத்தவும்.",
                "வேர்களுக்கு சேதம் தவிர்க்கவும்.",
                "அடிக்கடி கண்காணிப்பு.",
            ],
        },
        "WCLWD_DryingofLeaflets": {
            "status": "பாதிப்பு",
            "cause": [
                "WCLWD வகையை ஒத்த உலர்வு.",
                "வறட்சி/உப்பு அழுத்தம் அல்லது பாதிப்பு காரணமாக அதிகரிக்கலாம்.",
            ],
            "symptoms": [
                "இலை ஓரங்கள்/முனைகள் பழுப்பு நிறமாகி உலர்தல்.",
                "முறிவான அமைப்பு மற்றும் படிப்படி உலர்வு.",
            ],
            "remedies": [
                "பாசன அட்டவணையை மேம்படுத்தவும்.",
                "உள்ளூர் பரிந்துரைப்படி பொட்டாஷ் அதிகமான உரம்.",
                "கடுமையாக உலர்ந்த இலைகளை அகற்றி சுத்தம்.",
            ],
            "prevention": [
                "முல்ச்சிங்/கரிமப் பொருள் மூலம் ஈரப்பதம் பாதுகாப்பு.",
                "உப்பு நீர் தவிர்க்கவும், நல்ல வடிகால்.",
                "ஆரம்ப அறிகுறிகளிலேயே நடவடிக்கை.",
            ],
        },
    },
    "te": REPORTS_EN,
    "kn": REPORTS_EN,
    "ml": REPORTS_EN,
}


def get_report(disease: str, lang: str) -> dict:
    key = (lang or "en").strip().lower()
    templates = REPORTS_I18N.get(key) or REPORTS_I18N.get("en")
    report = templates.get(disease) if isinstance(templates, dict) else None
    if report is None:
        report = REPORTS_EN.get(disease)
    if report is None:
        return {
            "status": "Unknown",
            "cause": ["No report template available for this label."],
            "symptoms": [],
            "remedies": [],
            "prevention": [],
        }
    return report

@lru_cache(maxsize=1)
def _get_model_and_classes():
    model = models.mobilenet_v3_large(weights=None)
    model.classifier[3] = torch.nn.Linear(
        model.classifier[3].in_features,
        6,
    )

    _script_dir = os.path.dirname(os.path.abspath(__file__))
    _repo_root = os.path.abspath(os.path.join(_script_dir, "..", ".."))
    model_path = os.path.join(_repo_root, "mobilenet_best.pth")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model weights not found at: {model_path}")

    ckpt = torch.load(model_path, map_location=device)
    classes = list(class_names)
    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        model.load_state_dict(ckpt["state_dict"])
        if isinstance(ckpt.get("classes"), list) and ckpt["classes"]:
            classes = ckpt["classes"]
    else:
        model.load_state_dict(ckpt)

    model.to(device)
    model.eval()
    return model, classes

# ===== TRANSFORMS =====
tfm = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

def predict_pil_image(img: Image.Image, lang: str = "en") -> dict:
    model, classes = _get_model_and_classes()
    x = tfm(img.convert("RGB")).unsqueeze(0).to(device)

    with torch.no_grad():
        out = model(x)
        prob = torch.softmax(out, 1)
        conf, pred = torch.max(prob, 1)

    disease = classes[pred.item()]
    return {
        "disease": disease,
        "confidence": float(conf.item()),
        "report": get_report(disease, lang),
        "lang": (lang or "en").strip().lower(),
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "device": str(device),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...), lang: str = Form("en")):
    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")
    return predict_pil_image(img, lang=lang)


# ===== CHAT ENDPOINT =====

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"


# ---------------------------------------------------------------------------
# Multilingual rule-based chatbot responses
# ---------------------------------------------------------------------------
# Each language entry maps a "topic key" to a reply string.
# Keywords are matched against the user message (case-insensitive, unicode-aware).

CHAT_TOPICS = {
    "en": {
        "greeting":       (["hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening"],
                           "Hello! 👋 I'm CocoGuard Assistant. Ask me anything about coconut leaf diseases, pests, or fertilizers. How can I help you today?"),
        "healthy":        (["healthy", "no disease", "good leaf", "green leaf", "no problem", "normal"],
                           "✅ If your coconut leaf looks uniformly green without spots, yellowing, or drying — it is likely healthy! Continue regular irrigation, apply balanced NPK fertilizer twice a year, and inspect leaves weekly."),
        "caterpillar":    (["caterpillar", "worm", "larva", "larvae", "pest", "insect", "holes", "chew", "ate"],
                           "🐛 Caterpillar infestation detected. Symptoms: irregular holes, skeletonized leaves, worm droppings.\n\n**Action:** Remove visible larvae by hand for small infestations. Spray Bacillus thuringiensis (Bt) @ 1-2 g/L water every 7-10 days. Avoid excess nitrogen. Consult a local expert if infestation is severe."),
        "cci":            (["cci", "spot", "patch", "patchy", "discolor", "stress", "minor infection", "irregular"],
                           "🟡 CCI Leaflet damage detected. This usually indicates nutrient stress or a minor infection.\n\n**Action:** Apply Magnesium sulfate @ 200-300 g per palm. Spray zinc sulfate (0.5%). Use balanced NPK 15:15:15 @ 1.5 kg per palm. Remove heavily damaged leaflets."),
        "yellowing":      (["yellow", "yellowing", "pale", "chlorosis", "light green", "faded"],
                           "🟡 Yellowing (WCLWD) detected. This may be due to nutrient imbalance or root stress.\n\n**Action:** Check irrigation and drainage. Apply iron sulfate @ 50-100 g per palm. Use NPK 12:12:17 @ 2 kg per palm with extra potassium. Consult an expert if yellowing spreads rapidly."),
        "flaccidity":     (["flaccid", "flaccidity", "limp", "drooping", "droopy", "wilting", "wilt", "soft", "loose"],
                           "💧 Flaccidity (WCLWD) detected. Leaves appear limp and lose firmness.\n\n**Action:** Ensure adequate irrigation. Apply Muriate of Potash @ 1-1.5 kg per palm. Use calcium nitrate @ 200-300 g per palm. Mulch around the base to retain moisture."),
        "drying":         (["dry", "drying", "brown", "brittle", "tip burn", "edge burn", "tips dry", "leaves drying"],
                           "🍂 Drying (WCLWD) of leaflets detected. Tips and edges turn brown and dry.\n\n**Action:** Improve irrigation. Apply Sulphate of Potash (SOP) @ 1.5-2 kg per palm. Mulch with coconut husk. Use foliar spray of potassium nitrate @ 1% for quick recovery."),
        "fertilizer":     (["fertilizer", "fertiliser", "manure", "compost", "npk", "nutrient", "feed", "feeding"],
                           "🌿 **Recommended Fertilizer Schedule:**\n• NPK 14:14:14 @ 1.5 kg/palm – apply June-July & Nov-Dec\n• Organic compost/FYM @ 25-50 kg/palm annually\n• Micronutrient spray (Borax 0.2% + Zinc sulfate 0.5% + MgSO4 1%) every 3-4 months\n• Potassium (MOP) @ 1-1.5 kg/palm for stress conditions"),
        "irrigation":     (["water", "irrigation", "watering", "drought", "flood", "waterlog"],
                           "💧 **Irrigation Tips:**\n• Water coconut palms 40-45 liters per palm per day in summer\n• Avoid waterlogging — ensure good drainage\n• Mulch with coconut husk to reduce evaporation\n• Drip irrigation is ideal for water conservation"),
        "prevention":     (["prevent", "prevention", "protect", "avoid", "safe", "how to stop"],
                           "🛡️ **General Prevention Tips:**\n• Inspect leaves weekly for early signs\n• Remove old/dry fronds regularly\n• Use clean planting material and proper spacing\n• Apply balanced fertilizer on schedule\n• Avoid over-application of nitrogen"),
        "upload":         (["upload", "photo", "picture", "image", "scan", "detect", "diagnose", "check leaf"],
                           "📸 To detect the exact disease, use the **Upload & Check** page! Take a clear, well-lit photo of a single coconut leaf and upload it. Our AI model will analyze it and give you a detailed report."),
        "fallback":       ([], "🌴 I'm here to help with coconut leaf diseases! You can ask me about:\n• Yellowing, drying, or drooping leaves\n• Caterpillar & pest control\n• Fertilizer recommendations\n• Irrigation tips\n• Or upload a leaf photo for AI diagnosis"),
    },
    "hi": {
        "greeting":       (["नमस्ते", "हेलो", "हाय", "सुप्रभात", "नमस्कार"],
                           "नमस्ते! 👋 मैं CocoGuard सहायक हूँ। नारियल पत्ती रोग, कीट या खाद के बारे में कुछ भी पूछें। आज मैं आपकी कैसे मदद कर सकता हूँ?"),
        "healthy":        (["स्वस्थ", "ठीक", "सामान्य", "हरा", "अच्छा"],
                           "✅ यदि पत्ती समान रूप से हरी है और कोई धब्बा/पीलापन नहीं है — यह स्वस्थ है! नियमित सिंचाई जारी रखें, साल में दो बार NPK खाद दें, और साप्ताहिक निरीक्षण करें।"),
        "caterpillar":    (["इल्ली", "सूंडी", "कैटरपिलर", "कीट", "छेद", "खाया", "कीड़ा"],
                           "🐛 सूंडी/इल्ली का प्रकोप। लक्षण: अनियमित छेद, पत्ती का ढाँचा बचना, मल दिखना।\n\n**उपाय:** छोटे प्रकोप में हाथ से हटाएँ। Bacillus thuringiensis (Bt) @ 1-2 ग्राम/लीटर हर 7-10 दिन स्प्रे करें। अधिक नाइट्रोजन से बचें।"),
        "yellowing":      (["पीला", "पीलापन", "क्लोरोसिस", "फीका", "हल्का हरा"],
                           "🟡 पीलापन (WCLWD) — पोषक असंतुलन या जड़ तनाव से हो सकता है।\n\n**उपाय:** सिंचाई/निकास जाँचें। आयरन सल्फेट @ 50-100 ग्राम/पेड़। NPK 12:12:17 @ 2 किग्रा/पेड़। तेज़ी से बढ़ने पर विशेषज्ञ से सलाह लें।"),
        "flaccidity":     (["ढीला", "लटकना", "मुरझाना", "कमज़ोर", "ढीलापन"],
                           "💧 पत्तियों का ढीलापन (WCLWD)।\n\n**उपाय:** पर्याप्त सिंचाई सुनिश्चित करें। MOP @ 1-1.5 किग्रा/पेड़। कैल्शियम नाइट्रेट @ 200-300 ग्राम/पेड़। नारियल की भूसी से मल्चिंग करें।"),
        "drying":         (["सूखना", "भूरा", "किनारे सूखना", "सिरे जलना", "सूखी पत्ती"],
                           "🍂 पत्तियों का सूखना (WCLWD)।\n\n**उपाय:** सिंचाई सुधारें। SOP @ 1.5-2 किग्रा/पेड़। नारियल भूसी से मल्चिंग। पोटैशियम नाइट्रेट @ 1% स्प्रे।"),
        "fertilizer":     (["खाद", "उर्वरक", "npk", "पोषण", "खाद डालना"],
                           "🌿 **अनुशंसित खाद कार्यक्रम:**\n• NPK 14:14:14 @ 1.5 किग्रा/पेड़ — जून-जुलाई और नवम्बर-दिसम्बर\n• गोबर की खाद @ 25-50 किग्रा/पेड़ सालाना\n• सूक्ष्म पोषक स्प्रे (बोरेक्स 0.2% + जिंक 0.5% + MgSO4 1%) हर 3-4 महीने"),
        "upload":         (["फोटो", "तस्वीर", "अपलोड", "जाँच", "स्कैन"],
                           "📸 रोग की सटीक पहचान के लिए **अपलोड व जाँच** पृष्ठ पर जाएँ! एक साफ़ नारियल पत्ती की फोटो अपलोड करें।"),
        "fallback":       ([], "🌴 मैं नारियल रोगों में आपकी मदद कर सकता हूँ!\n• पीलापन, सूखना, ढीलापन\n• कीट नियंत्रण\n• खाद की सलाह\n• फोटो अपलोड करके AI जाँच"),
    },
    "mr": {
        "greeting":       (["नमस्ते", "नमस्कार", "हॅलो", "सुप्रभात"],
                           "नमस्ते! 👋 मी CocoGuard सहाय्यक आहे. नारळ पानांचे रोग, कीड किंवा खतांबद्दल काहीही विचारा!"),
        "healthy":        (["निरोगी", "ठीक", "सामान्य", "हिरवे", "चांगले"],
                           "✅ पान समान हिरवे असल्यास व कोणतेही डाग नसल्यास — ते निरोगी आहे! नियमित सिंचन करा, वर्षातून दोनदा NPK खत द्या."),
        "yellowing":      (["पिवळे", "पिवळसरपणा", "फिकट", "हलके हिरवे"],
                           "🟡 पिवळसरपणा (WCLWD) — पोषक असमतोल किंवा मूळ ताणामुळे होतो.\n\n**उपाय:** सिंचन/निचरा तपासा. आयर्न सल्फेट @ 50-100 ग्रॅम/झाड. NPK 12:12:17 @ 2 किलो/झाड."),
        "caterpillar":    (["अळी", "सुरवंट", "कीड", "छिद्र", "खाल्ले"],
                           "🐛 अळीचा प्रादुर्भाव. लक्षणे: छिद्रे, कंकाळ झालेली पाने.\n\n**उपाय:** दिसणाऱ्या अळ्या काढा. Bt @ 1-2 ग्रॅम/लिटर दर 7-10 दिवस फवारा."),
        "fertilizer":     (["खत", "npk", "पोषण", "खते"],
                           "🌿 **शिफारस खत कार्यक्रम:**\n• NPK 14:14:14 @ 1.5 किलो/झाड — जून-जुलै व नोव्हेंबर-डिसेंबर\n• शेणखत @ 25-50 किलो/झाड वार्षिक"),
        "upload":         (["फोटो", "अपलोड", "तपासणी", "स्कॅन"],
                           "📸 अचूक रोग ओळखण्यासाठी **अपलोड व तपासणी** पृष्ठ वापरा!"),
        "fallback":       ([], "🌴 मी नारळ रोगांबद्दल मदत करू शकतो!\n• पिवळसरपणा, कोरडेपणा, ढळढळ\n• कीड नियंत्रण\n• खत सल्ला"),
    },
    "ta": {
        "greeting":       (["வணக்கம்", "ஹலோ", "நமஸ்தே"],
                           "வணக்கம்! 👋 நான் CocoGuard உதவியாளர். தென்னை இலை நோய்கள், பூச்சிகள் அல்லது உரங்களைப் பற்றி கேளுங்கள்!"),
        "healthy":        (["ஆரோக்கியம்", "நல்ல", "பச்சை", "சாதாரண"],
                           "✅ இலை சீராக பச்சையாக இருந்தால் ஆரோக்கியமானது! தொடர்ந்து நீர்ப்பாசனம் செய்யுங்கள்."),
        "yellowing":      (["மஞ்சள்", "மஞ்சளாகுதல்", "வெளிர்"],
                           "🟡 மஞ்சளாகுதல் (WCLWD) — ஊட்டசத்து சமநிலையின்மை காரணமாக இருக்கலாம்.\n\n**நடவடிக்கை:** இரும்பு சல்பேட் @ 50-100 கிராம்/மரம். NPK 12:12:17 @ 2 கிலோ/மரம்."),
        "caterpillar":    (["இலைப்புழு", "புழு", "துளை", "கடித்தல்"],
                           "🐛 இலைப்புழு தாக்கம். Bt @ 1-2 கிராம்/லிட்டர் 7-10 நாட்களுக்கு ஒருமுறை தெளிக்கவும்."),
        "fertilizer":     (["உரம்", "npk", "சத்து"],
                           "🌿 NPK 14:14:14 @ 1.5 கிலோ/மரம் — ஆண்டு இருமுறை. தாவர சத்து தெளிப்பு ஒவ்வொரு 3-4 மாதத்திற்கு ஒருமுறை."),
        "upload":         (["ஒளிப்படம்", "புகைப்படம்", "பதிவேற்றம்"],
                           "📸 சரியான நோய் கண்டறிய **அப்‌லோட் & சரிபார்** பக்கத்தைப் பயன்படுத்துங்கள்!"),
        "fallback":       ([], "🌴 தென்னை நோய்களில் உதவ நான் இங்கே இருக்கிறேன்!\n• மஞ்சளாகுதல், உலர்தல், தளர்வு\n• பூச்சி கட்டுப்பாடு\n• உர பரிந்துரைகள்"),
    },
    "te": {
        "greeting":       (["నమస్కారం", "హలో", "వందనాలు"],
                           "నమస్కారం! 👋 నేను CocoGuard సహాయకుడిని. కొబ్బరి ఆకు వ్యాధులు, చీడ లేదా ఎరువుల గురించి అడగండి!"),
        "yellowing":      (["పచ్చిక", "పసుపు", "పసుపురంగు", "వెలవెల"],
                           "🟡 పసుపు రంగులోకి మారడం (WCLWD) — పోషక అసమతుల్యత వల్ల కావచ్చు.\n\n**చర్య:** ఐరన్ సల్ఫేట్ @ 50-100 గ్రా/చెట్టు. NPK 12:12:17 @ 2 కిలో/చెట్టు."),
        "caterpillar":    (["గొంగళి పురుగు", "పురుగు", "రంధ్రాలు"],
                           "🐛 గొంగళి పురుగు దాడి. Bt @ 1-2 గ్రా/లీటర్ — 7-10 రోజులకు ఒకసారి పిచికారీ చేయండి."),
        "fertilizer":     (["ఎరువు", "npk", "పోషకాలు"],
                           "🌿 NPK 14:14:14 @ 1.5 కిలో/చెట్టు — సంవత్సరానికి రెండుసార్లు. సేంద్రీయ ఎరువు @ 25-50 కిలో/చెట్టు."),
        "upload":         (["ఫోటో", "అప్‌లోడ్", "పరీక్ష"],
                           "📸 ఖచ్చితమైన వ్యాధి గుర్తింపుకు **అప్‌లోడ్ & చెక్** పేజీని ఉపయోగించండి!"),
        "fallback":       ([], "🌴 కొబ్బరి వ్యాధులలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను!"),
    },
    "kn": {
        "greeting":       (["ನಮಸ್ಕಾರ", "ಹಲೋ", "ವಂದನೆ"],
                           "ನಮಸ್ಕಾರ! 👋 ನಾನು CocoGuard ಸಹಾಯಕ. ತೆಂಗಿನ ಎಲೆ ರೋಗಗಳು, ಕೀಟ ಅಥವಾ ಗೊಬ್ಬರದ ಬಗ್ಗೆ ಕೇಳಿ!"),
        "yellowing":      (["ಹಳದಿ", "ಹಳದಿ ಬಣ್ಣ", "ಬಿಳಿಚಿಕೊಳ್ಳು"],
                           "🟡 ಹಳದಿ ಬಣ್ಣ (WCLWD) — ಪೋಷಕಾಂಶ ಅಸಮತೋಲನ ಕಾರಣವಾಗಿರಬಹುದು.\n\n**ಕ್ರಮ:** ಕಬ್ಬಿಣ ಸಲ್ಫೇಟ್ @ 50-100 ಗ್ರಾ/ಮರ. NPK 12:12:17 @ 2 ಕಿಲೋ/ಮರ."),
        "caterpillar":    (["ಹುಳ", "ಕಂಬಳಿ ಹುಳ", "ರಂಧ್ರ"],
                           "🐛 ಕಂಬಳಿ ಹುಳ ಬಾಧೆ. Bt @ 1-2 ಗ್ರಾ/ಲೀಟರ್ — 7-10 ದಿನಕ್ಕೊಮ್ಮೆ ಸ್ಪ್ರೇ ಮಾಡಿ."),
        "fertilizer":     (["ಗೊಬ್ಬರ", "npk", "ಪೋಷಕ"],
                           "🌿 NPK 14:14:14 @ 1.5 ಕಿಲೋ/ಮರ — ವರ್ಷದಲ್ಲಿ ಎರಡು ಬಾರಿ. ಸಾವಯವ ಗೊಬ್ಬರ @ 25-50 ಕಿಲೋ/ಮರ."),
        "upload":         (["ಫೋಟೋ", "ಅಪ್‌ಲೋಡ್", "ಪರೀಕ್ಷೆ"],
                           "📸 ನಿಖರ ರೋಗ ಪತ್ತೆಗೆ **ಅಪ್‌ಲೋಡ್ & ಪರಿಶೀಲನೆ** ಪುಟ ಬಳಸಿ!"),
        "fallback":       ([], "🌴 ತೆಂಗಿನ ರೋಗಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ನಾನಿದ್ದೇನೆ!"),
    },
    "ml": {
        "greeting":       (["നമസ്കാരം", "ഹലോ", "വന്ദനം"],
                           "നമസ്കാരം! 👋 ഞാൻ CocoGuard സഹായകനാണ്. തേങ്ങ ഇലരോഗം, കീടം അല്ലെങ്കിൽ വളം എന്നിവ ചോദിക്കൂ!"),
        "yellowing":      (["മഞ്ഞ", "മഞ്ഞളിക്കൽ", "വിളർക്കൽ"],
                           "🟡 മഞ്ഞളിക്കൽ (WCLWD) — പോഷക ഘടക അസന്തുലനം കാരണമായിരിക്കാം.\n\n**നടപടി:** ഐ‌റൺ സൾഫേറ്റ് @ 50-100 ഗ്രാം/മരം. NPK 12:12:17 @ 2 കിലോ/മരം."),
        "caterpillar":    (["ഇലനാശകൻ", "പുഴുക്കൾ", "ദ്വാരങ്ങൾ"],
                           "🐛 ഇലനാശക ബാധ. Bt @ 1-2 ഗ്രാം/ലിറ്റർ — 7-10 ദിവസത്തിലൊരിക്കൽ സ്പ്രേ ചെയ്യൂ."),
        "fertilizer":     (["വളം", "npk", "പോഷകങ്ങൾ"],
                           "🌿 NPK 14:14:14 @ 1.5 കിലോ/മരം — വർഷത്തിൽ രണ്ടുതവണ. ജൈവ വളം @ 25-50 കിലോ/മരം."),
        "upload":         (["ഫോട്ടോ", "അപ്‌ലോഡ്", "പരിശോധന"],
                           "📸 കൃത്യമായ രോഗ നിർണ്ണയത്തിന് **അപ്‌ലോഡ് & പരിശോധന** പേജ് ഉപയോഗിക്കൂ!"),
        "fallback":       ([], "🌴 തേങ്ങ ഇലരോഗങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെ ഉണ്ട്!"),
    },
    "bn": {
        "greeting":       (["নমস্কার", "হ্যালো", "হ্যালো"],
                           "নমস্কার! 👋 আমি CocoGuard সহকারী। নারকেল পাতার রোগ, পোকামাকড় বা সারের বিষয়ে জিজ্ঞেস করুন!"),
        "yellowing":      (["হলুদ", "হলুদ হওয়া", "ফ্যাকাসে"],
                           "🟡 হলুদ হওয়া (WCLWD) — পুষ্টির ভারসাম্যহীনতার কারণে হতে পারে।\n\n**পদক্ষেপ:** আয়রন সালফেট @ 50-100 গ্রাম/গাছ। NPK 12:12:17 @ 2 কেজি/গাছ।"),
        "caterpillar":    (["শুঁয়োপোকা", "পোকা", "ছিদ্র"],
                           "🐛 শুঁয়োপোকার আক্রমণ। Bt @ 1-2 গ্রাম/লিটার — 7-10 দিনে একবার স্প্রে করুন।"),
        "fertilizer":     (["সার", "npk", "পুষ্টি"],
                           "🌿 NPK 14:14:14 @ 1.5 কেজি/গাছ — বছরে দুবার। জৈব সার @ 25-50 কেজি/গাছ বার্ষিক।"),
        "upload":         (["ছবি", "আপলোড", "পরীক্ষা"],
                           "📸 সঠিক রোগ সনাক্তের জন্য **আপলোড ও যাচাই** পাতা ব্যবহার করুন!"),
        "fallback":       ([], "🌴 নারকেল রোগে সাহায্যের জন্য আমি এখানে আছি!"),
    },
    "gu": {
        "greeting":       (["નમસ્તે", "હેલો", "નમસ્કાર"],
                           "નમસ્તે! 👋 હું CocoGuard સહાયક છું. નાળિયેર પાનના રોગ, જીવાત અથવા ખાતર વિષે પૂછો!"),
        "yellowing":      (["પીળો", "પીળાશ", "ઝાંખો"],
                           "🟡 પીળાશ (WCLWD) — પોષક અસંતુલનને કારણે હોઈ શકે.\n\n**પગલાં:** આઇરન સલ્ફેટ @ 50-100 ગ્રામ/ઝાડ. NPK 12:12:17 @ 2 કિલો/ઝાડ."),
        "caterpillar":    (["ઇયળ", "કિડો", "ભૂરો", "છિદ્ર"],
                           "🐛 ઇયળ ઉપદ્રવ. Bt @ 1-2 ગ્રામ/લિટર — 7-10 દિવસે એકવાર સ્પ્રે કરો."),
        "fertilizer":     (["ખાતર", "npk", "પોષણ"],
                           "🌿 NPK 14:14:14 @ 1.5 કિલો/ઝાડ — વર્ષમાં બે વાર. જૈવ ખાતર @ 25-50 કિલો/ઝાડ."),
        "upload":         (["ફોટો", "અપલોડ", "તપાસ"],
                           "📸 ચોક્કસ રોગ ઓળખ માટે **અપલોડ & ચેક** પૃષ્ઠ વાપરો!"),
        "fallback":       ([], "🌴 નારિયળ રોગ અંગે સહાય કરવા હું અહીં છું!"),
    },
    "pa": {
        "greeting":       (["ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", "ਹੈਲੋ", "ਨਮਸਤੇ"],
                           "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 👋 ਮੈਂ CocoGuard ਸਹਾਇਕ ਹਾਂ। ਨਾਰੀਅਲ ਪੱਤੇ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਕੀੜੇ ਜਾਂ ਖਾਦ ਬਾਰੇ ਪੁੱਛੋ!"),
        "yellowing":      (["ਪੀਲਾ", "ਪੀਲਾਪਣ", "ਫਿੱਕਾ"],
                           "🟡 ਪੀਲਾਪਣ (WCLWD) — ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੇ ਅਸੰਤੁਲਨ ਕਾਰਨ ਹੋ ਸਕਦਾ ਹੈ।\n\n**ਕਦਮ:** ਆਇਰਨ ਸਲਫੇਟ @ 50-100 ਗ੍ਰਾਮ/ਰੁੱਖ. NPK 12:12:17 @ 2 ਕਿਲੋ/ਰੁੱਖ."),
        "caterpillar":    (["ਸੁੰਡੀ", "ਕੀੜਾ", "ਛੇਕ"],
                           "🐛 ਸੁੰਡੀ ਦਾ ਹਮਲਾ। Bt @ 1-2 ਗ੍ਰਾਮ/ਲੀਟਰ — 7-10 ਦਿਨ ਵਿੱਚ ਇੱਕ ਵਾਰ ਸਪਰੇ ਕਰੋ।"),
        "fertilizer":     (["ਖਾਦ", "npk", "ਪੋਸ਼ਣ"],
                           "🌿 NPK 14:14:14 @ 1.5 ਕਿਲੋ/ਰੁੱਖ — ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ. ਜੈਵਿਕ ਖਾਦ @ 25-50 ਕਿਲੋ/ਰੁੱਖ."),
        "upload":         (["ਫੋਟੋ", "ਅੱਪਲੋਡ", "ਜਾਂਚ"],
                           "📸 ਸਹੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਲਈ **ਅੱਪਲੋਡ & ਚੈੱਕ** ਪੰਨਾ ਵਰਤੋ!"),
        "fallback":       ([], "🌴 ਨਾਰੀਅਲ ਬਿਮਾਰੀਆਂ ਵਿੱਚ ਮਦਦ ਲਈ ਮੈਂ ਇੱਥੇ ਹਾਂ!"),
    },
    "ur": {
        "greeting":       (["سلام", "ہیلو", "آداب"],
                           "سلام! 👋 میں CocoGuard معاون ہوں۔ ناریل کے پتوں کی بیماریوں، کیڑوں یا کھادوں کے بارے میں پوچھیں!"),
        "yellowing":      (["پیلا", "پیلاپن", "زرد"],
                           "🟡 پیلاپن (WCLWD) — غذائی عدم توازن کی وجہ سے ہو سکتا ہے۔\n\n**اقدام:** آئرن سلفیٹ @ 50-100 گرام/درخت۔ NPK 12:12:17 @ 2 کلو/درخت۔"),
        "caterpillar":    (["سنڈی", "کیڑا", "سوراخ"],
                           "🐛 سنڈی کا حملہ۔ Bt @ 1-2 گرام/لیٹر — 7-10 دن میں ایک بار اسپرے کریں۔"),
        "fertilizer":     (["کھاد", "npk", "غذائیت"],
                           "🌿 NPK 14:14:14 @ 1.5 کلو/درخت — سال میں دو بار۔ نامیاتی کھاد @ 25-50 کلو/درخت سالانہ۔"),
        "upload":         (["تصویر", "اپ لوڈ", "جانچ"],
                           "📸 درست بیماری کی تشخیص کے لیے **اپ لوڈ اور چیک** صفحہ استعمال کریں!"),
        "fallback":       ([], "🌴 ناریل کی بیماریوں میں مدد کے لیے میں یہاں ہوں!"),
    },
}


def _find_chat_response(message: str, lang: str) -> str:
    """Return the best matching chat response given message and language."""
    lang_key = (lang or "en").strip().lower()
    # Try the requested language first, then fall back to English
    topics_to_try = []
    if lang_key in CHAT_TOPICS:
        topics_to_try.append(CHAT_TOPICS[lang_key])
    if lang_key != "en":
        topics_to_try.append(CHAT_TOPICS["en"])

    msg_lower = message.lower()

    for topics in topics_to_try:
        for topic_key, (keywords, reply) in topics.items():
            if topic_key == "fallback":
                continue
            for kw in keywords:
                if kw.lower() in msg_lower:
                    return reply

    # Return the fallback in the requested language if available
    if lang_key in CHAT_TOPICS and "fallback" in CHAT_TOPICS[lang_key]:
        return CHAT_TOPICS[lang_key]["fallback"][1]
    return CHAT_TOPICS["en"]["fallback"][1]


@app.post("/chat")
async def chat(req: ChatRequest):
    """Multilingual rule-based chatbot for coconut disease Q&A."""
    reply = _find_chat_response(req.message, req.language or "en")
    return {"reply": reply, "language": (req.language or "en").strip().lower()}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python infer.py <path_to_image>")

    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image not found: {img_path}")

    img = Image.open(img_path).convert("RGB")
    result = predict_pil_image(img)
    print("Disease:", result["disease"])
    print("Confidence:", round(result["confidence"] * 100, 2), "%")
