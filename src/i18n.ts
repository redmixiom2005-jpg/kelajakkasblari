import { Language } from './types';

export interface Translations {
  schoolTitle: string;
  appTitle: string;
  appSubtitle: string;
  home: string;
  takeTest: string;
  careersCatalog: string;
  aboutPlatform: string;
  adminLogin: string;
  logout: string;
  heroHeadline: string;
  heroDescription: string;
  startAssessment: string;
  browseCareers: string;
  totalCareers: string;
  testedStudents: string;
  hollandMethod: string;
  aiPowered: string;
  testSubtitle: string;
  stepStudentInfo: string;
  stepQuestions: string;
  stepResults: string;
  fullName: string;
  gradeClass: string;
  gender: string;
  male: string;
  female: string;
  phoneOptional: string;
  startQuestions: string;
  questionProgress: string;
  previous: string;
  next: string;
  finishTest: string;
  stronglyDisagree: string;
  disagree: string;
  neutral: string;
  agree: string;
  stronglyAgree: string;
  resultsTitle: string;
  resultsSubtitle: string;
  matchedTopCareer: string;
  matchScore: string;
  careerRoadmap: string;
  requiredSubjects: string;
  suggestedUniversities: string;
  futureProspects: string;
  riasecProfile: string;
  dimensionsBreakdown: string;
  pressureIndexTitle: string;
  aiThinkingTitle: string;
  aiThinkingDesc: string;
  askAiQuestion: string;
  submitQuestion: string;
  printPassport: string;
  allCategories: string;
  searchPlaceholder: string;
  viewDetails: string;
  close: string;
  username: string;
  password: string;
  loginButton: string;
  analyticsTitle: string;
  exportCsv: string;
}

export const translations: Record<Language, Translations> = {
  uz: {
    schoolTitle: "Namangan viloyati, Uychi tumani, 41-sonli umumiy o‘rta ta'lim maktabi",
    appTitle: "Kasbim — Kelajagim",
    appSubtitle: "O‘quvchilarning kasbiy qiziqishlarini aniqlash va yo‘naltirish milliy platformasi",
    home: "Bosh sahifa",
    takeTest: "Test topshirish",
    careersCatalog: "Kasblar atlasi",
    aboutPlatform: "Maktab haqida",
    adminLogin: "O‘qituvchi / Admin",
    logout: "Chiqish",
    heroHeadline: "O‘z iqtidoringni kashf et, kelajak kasbingni ongli tanla!",
    heroDescription: "41-maktab o‘quvchilari uchun maxsus ishlab chiqilgan, 8 qirrali psixometrik metodika, Holland RIASEC modeli va sun'iy intellekt tahliliga asoslangan kasbga yo‘naltirish tizimi.",
    startAssessment: "Kasbiy testni boshlash",
    browseCareers: "200+ kasblar bazasi",
    totalCareers: "200+ Zamonaviy kasblar",
    testedStudents: "Diagnostika qilinganlar",
    hollandMethod: "RIASEC xalqaro standarti",
    aiPowered: "Gemini 3.1 High Thinking tahlili",
    testSubtitle: "40 ta ixtisoslashtirilgan savol orqali shaxsiy moyilligingizni aniqlang",
    stepStudentInfo: "1. O‘quvchi ma'lumotlari",
    stepQuestions: "2. Savol-javoblar",
    stepResults: "3. Kasbiy Pasport",
    fullName: "Familiya, Ism va Sharifingiz",
    gradeClass: "Sinfingiz (masalan, 9-A, 10-B)",
    gender: "Jinsi",
    male: "O‘g‘il bola",
    female: "Qiz bola",
    phoneOptional: "Telefon raqamingiz (ixtiyoriy)",
    startQuestions: "Savollarga o‘tish",
    questionProgress: "Savol",
    previous: "Oldingi",
    next: "Keyingi",
    finishTest: "Testni yakunlash va natijani hisoblash",
    stronglyDisagree: "Umuman to‘g‘ri kelmaydi",
    disagree: "Qisman noto‘g‘ri",
    neutral: "Neytral / Ikkilanaman",
    agree: "Menga mos keladi",
    stronglyAgree: "Aynan men haqimda!",
    resultsTitle: "Sizning Kasbiy Pasportingiz",
    resultsSubtitle: "Namangan viloyati, Uychi tumani, 41-maktab psixologik xulosasi",
    matchedTopCareer: "Sizga eng mos kasb",
    matchScore: "Muvofiqlik ko‘rsatkichi",
    careerRoadmap: "4 bosqichli amaliy yo‘l xaritasi (Roadmap)",
    requiredSubjects: "Maktabda chuqur o‘rganiladigan fanlar",
    suggestedUniversities: "Tavsiya etilgan oliygohlar va kollejlar",
    futureProspects: "Mehnat bozoridagi istiqboli",
    riasecProfile: "Holland RIASEC shaxsiyat profili",
    dimensionsBreakdown: "8 yo‘nalish bo‘yicha tahlil",
    pressureIndexTitle: "Mustaqil tanlov / Oila ta'siri indeksi",
    aiThinkingTitle: "Gemini 3.1 Pro — Chuqur Fikrlash (Thinking Mode) Tahlili",
    aiThinkingDesc: "Sun'iy intellekt sizning javoblaringizni chuqur mantiqiy tahlil qilib, 3 yillik individual strategiya ishlab chiqdi.",
    askAiQuestion: "AI Maslahatchidan qo‘shimcha savol so‘rang...",
    submitQuestion: "Fikrlash rejimida tahlil qilish",
    printPassport: "Kasbiy Pasportni chop etish (PDF)",
    allCategories: "Barcha sohalar",
    searchPlaceholder: "Kasb nomi, ko‘nikma yoki soha bo‘yicha qidirish...",
    viewDetails: "Batafsil ma'lumot",
    close: "Yopish",
    username: "Login",
    password: "Parol",
    loginButton: "Tizimga kirish",
    analyticsTitle: "41-Maktab kasbiy diagnostika tahlili",
    exportCsv: "Excel / CSV yuklab olish"
  },
  krill: {
    schoolTitle: "Наманган вилояти, Уйчи тумани, 41-сонли умумий ўрта таълим мактаби",
    appTitle: "Касбим — Келажагим",
    appSubtitle: "Ўқувчиларнинг касбий қизиқишларини аниқлаш ва йўналтириш миллий платформаси",
    home: "Бош саҳифа",
    takeTest: "Тест топшириш",
    careersCatalog: "Касблар атласи",
    aboutPlatform: "Мактаб ҳақида",
    adminLogin: "Ўқитувчи / Админ",
    logout: "Чиқиш",
    heroHeadline: "Ўз иқтидорингни кашф эт, келажак касбингни онгли танла!",
    heroDescription: "41-мактаб ўқувчилари учун махсус ишлаб чиқилган, 8 қиррали психометрик методика, Holland RIASEC модели ва сунъий интеллект таҳлилига асосланган касбга йўналтириш тизими.",
    startAssessment: "Касбий тестни бошлаш",
    browseCareers: "200+ касблар базаси",
    totalCareers: "200+ Замонавий касблар",
    testedStudents: "Диагностика қилинганлар",
    hollandMethod: "RIASEC халқаро стандарти",
    aiPowered: "Gemini 3.1 High Thinking таҳлили",
    testSubtitle: "40 та ихтисослаштирилган савол орқали шахсий мойиллигингизни аниқланг",
    stepStudentInfo: "1. Ўқувчи маълумотлари",
    stepQuestions: "2. Савол-жавоблар",
    stepResults: "3. Касбий Паспорт",
    fullName: "Фамилия, Исм ва Шарифингиз",
    gradeClass: "Синфингиз (масалан, 9-А, 10-Б)",
    gender: "Жинси",
    male: "Ўғил бола",
    female: "Қиз бола",
    phoneOptional: "Телефон рақамингиз (ихтиёрий)",
    startQuestions: "Саволларга ўтиш",
    questionProgress: "Савол",
    previous: "Олдинги",
    next: "Кейинги",
    finishTest: "Тестни якунлаш ва натижани ҳисоблаш",
    stronglyDisagree: "Умуман тўғри келмайди",
    disagree: "Қисман нотўғри",
    neutral: "Нейтрал / Иккиланаман",
    agree: "Менга мос келади",
    stronglyAgree: "Айнан мен ҳақимда!",
    resultsTitle: "Сизнинг Касбий Паспортингиз",
    resultsSubtitle: "Наманган вилояти, Уйчи тумани, 41-мактаб психологик хулосаси",
    matchedTopCareer: "Сизга энг мос касб",
    matchScore: "Мувофиқлик кўрсаткичи",
    careerRoadmap: "4 босқичли амалий йўл харитаси (Roadmap)",
    requiredSubjects: "Мактабда чуқур ўрганиладиган фанлар",
    suggestedUniversities: "Тавсия этилган олийгоҳлар ва коллежлар",
    futureProspects: "Меҳнат бозоридаги истиқболи",
    riasecProfile: "Holland RIASEC шахсият профили",
    dimensionsBreakdown: "8 йўналиш бўйича таҳлил",
    pressureIndexTitle: "Мустақил танлов / Оила таъсири индекси",
    aiThinkingTitle: "Gemini 3.1 Pro — Чуқур Фикрлаш (Thinking Mode) Таҳлили",
    aiThinkingDesc: "Сунъий интеллект сизнинг жавобларингизни чуқур мантиқий таҳлил қилиб, 3 йиллик стратегик режа тузди.",
    askAiQuestion: "AI Маслаҳатчидан қўшимча савол сўранг...",
    submitQuestion: "Фикрлаш режимида таҳлил қилиш",
    printPassport: "Касбий Паспортни чоп этиш (PDF)",
    allCategories: "Барча соҳалар",
    searchPlaceholder: "Касб номи ёки соҳа бўйича қидириш...",
    viewDetails: "Батафсил маълумот",
    close: "Ёпиш",
    username: "Логин",
    password: "Парол",
    loginButton: "Тизимга кириш",
    analyticsTitle: "41-Мактаб касбий диагностика таҳлили",
    exportCsv: "Excel / CSV юклаб олиш"
  },
  ru: {
    schoolTitle: "Общеобразовательная школа №41, Уйчинский район, Наманганская область",
    appTitle: "Касбим — Келажагим",
    appSubtitle: "Национальная платформа профориентации и диагностики учащихся",
    home: "Главная",
    takeTest: "Пройти тест",
    careersCatalog: "Атлас профессий",
    aboutPlatform: "О школе",
    adminLogin: "Учитель / Вход",
    logout: "Выход",
    heroHeadline: "Раскрой свои таланты, выбери профессию будущего осознанно!",
    heroDescription: "Система профориентации школы №41 на основе 8-векторной психометрики, модели Holland RIASEC и ИИ-анализа Gemini 3.1.",
    startAssessment: "Начать тестирование",
    browseCareers: "Каталог 200+ профессий",
    totalCareers: "200+ Востребованных профессий",
    testedStudents: "Продиагностировано учеников",
    hollandMethod: "Международная модель RIASEC",
    aiPowered: "Глубокое мышление Gemini 3.1 Pro",
    testSubtitle: "40 специализированных вопросов для выявления ваших подлинных склонностей",
    stepStudentInfo: "1. Данные ученика",
    stepQuestions: "2. Вопросы теста",
    stepResults: "3. Профессиональный паспорт",
    fullName: "Фамилия, Имя и Отчество",
    gradeClass: "Класс (например, 9-А, 10-Б)",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    phoneOptional: "Номер телефона (необязательно)",
    startQuestions: "Перейти к вопросам",
    questionProgress: "Вопрос",
    previous: "Назад",
    next: "Далее",
    finishTest: "Завершить и рассчитать результат",
    stronglyDisagree: "Совершенно не согласен",
    disagree: "Скорее не согласен",
    neutral: "Нейтрально",
    agree: "Скорее согласен",
    stronglyAgree: "Полностью про меня!",
    resultsTitle: "Ваш Профессиональный Паспорт",
    resultsSubtitle: "Психологическое заключение школы №41 Уйчинского района",
    matchedTopCareer: "Наиболее подходящая профессия",
    matchScore: "Коэффициент соответствия",
    careerRoadmap: "4-этапная дорожная карта развития",
    requiredSubjects: "Профильные школьные предметы",
    suggestedUniversities: "Рекомендуемые вузы и колледжи",
    futureProspects: "Перспективы на рынке труда",
    riasecProfile: "Профиль личности Holland RIASEC",
    dimensionsBreakdown: "Анализ по 8 направлениям",
    pressureIndexTitle: "Индекс самостоятельности / Влияния семьи",
    aiThinkingTitle: "Gemini 3.1 Pro — Анализ в режиме глубокого мышления",
    aiThinkingDesc: "Искусственный интеллект детально проанализировал ваши склонности и составил 3-летний план подготовки.",
    askAiQuestion: "Задайте дополнительный вопрос ИИ-консультанту...",
    submitQuestion: "Спросить с глубоким анализом",
    printPassport: "Распечатать паспорт (PDF)",
    allCategories: "Все сферы",
    searchPlaceholder: "Поиск по профессии или навыкам...",
    viewDetails: "Подробнее",
    close: "Закрыть",
    username: "Логин",
    password: "Пароль",
    loginButton: "Войти в систему",
    analyticsTitle: "Статистика профориентации школы №41",
    exportCsv: "Экспорт в Excel / CSV"
  },
  en: {
    schoolTitle: "General Secondary School No. 41, Uychi District, Namangan Region",
    appTitle: "Kasbim — Kelajagim",
    appSubtitle: "National Career Guidance & Psychometric Assessment Platform",
    home: "Home",
    takeTest: "Take Assessment",
    careersCatalog: "Career Atlas",
    aboutPlatform: "About School",
    adminLogin: "Teacher / Admin",
    logout: "Log out",
    heroHeadline: "Discover Your Talents, Choose Your Future Profession Consciously!",
    heroDescription: "A specialized career guidance platform designed for School No. 41 students, combining 8-dimensional psychometrics, Holland RIASEC models, and Gemini 3.1 AI reasoning.",
    startAssessment: "Start Career Assessment",
    browseCareers: "Browse 200+ Careers",
    totalCareers: "200+ Modern Careers",
    testedStudents: "Students Assessed",
    hollandMethod: "Holland RIASEC Certified",
    aiPowered: "Gemini 3.1 High Thinking Mode",
    testSubtitle: "40 targeted psychometric questions uncovering your true vocational calling",
    stepStudentInfo: "1. Student Profile",
    stepQuestions: "2. Assessment Questions",
    stepResults: "3. Vocational Passport",
    fullName: "Full Name",
    gradeClass: "Class / Grade (e.g., 9-A, 10-B)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    phoneOptional: "Phone Number (optional)",
    startQuestions: "Proceed to Questions",
    questionProgress: "Question",
    previous: "Previous",
    next: "Next",
    finishTest: "Submit & Calculate Results",
    stronglyDisagree: "Strongly Disagree",
    disagree: "Disagree",
    neutral: "Neutral",
    agree: "Agree",
    stronglyAgree: "Strongly Agree",
    resultsTitle: "Your Career Vocational Passport",
    resultsSubtitle: "Psychological evaluation from School No. 41, Uychi District",
    matchedTopCareer: "Your Top Matched Career",
    matchScore: "Match Percentage",
    careerRoadmap: "4-Stage Career Roadmap",
    requiredSubjects: "Priority Academic Subjects",
    suggestedUniversities: "Recommended Colleges & Universities",
    futureProspects: "Labor Market Outlook",
    riasecProfile: "Holland RIASEC Profile",
    dimensionsBreakdown: "8-Dimensional Spectrum Analysis",
    pressureIndexTitle: "Independent Choice / External Pressure Index",
    aiThinkingTitle: "Gemini 3.1 Pro — High Thinking Mode Analysis",
    aiThinkingDesc: "Artificial intelligence reasoned over your answers to construct a personalized 3-year preparation strategy.",
    askAiQuestion: "Ask the AI Counselor a follow-up query...",
    submitQuestion: "Analyze with High Thinking",
    printPassport: "Print Vocational Passport (PDF)",
    allCategories: "All Categories",
    searchPlaceholder: "Search careers by title, skills or industry...",
    viewDetails: "View Details",
    close: "Close",
    username: "Username",
    password: "Password",
    loginButton: "Log In",
    analyticsTitle: "School No. 41 Career Analytics Dashboard",
    exportCsv: "Download Excel / CSV"
  }
};
