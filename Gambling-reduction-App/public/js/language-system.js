// 🎯 SOUTH AFRICA - 11 OFFICIAL LANGUAGES SYSTEM
class SouthAfricanLanguageSystem {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLang') || 'en';
        this.translations = this.getAllTranslations();
        this.init();
    }

    getAllTranslations() {
        return {
            // ENGLISH (Default)
            en: {
                // Navigation & Auth
                dashboard: "Dashboard",
                addExpense: "Add Expense", 
                logout: "Logout",
                login: "Login",
                register: "Register",
                email: "Email",
                password: "Password",
                fullName: "Full Name",
                monthlySalary: "Monthly Salary (R)",
                bettingPercentage: "Betting Budget Percentage",
                createAccount: "Create Account",
                haveAccount: "Already have an account?",
                noAccount: "Don't have an account?",
                selectLanguage: "Choose Your Language",
                
                // Dashboard
                welcome: "Welcome back",
                controlBudget: "Stay in control of your betting budget",
                availableBalance: "Available Balance",
                monthlyBudget: "Monthly Budget", 
                totalSpent: "Total Spent",
                daysLeft: "Days Left This Month",
                budgetProgress: "Monthly Budget Progress",
                quickActions: "Quick Add Expense",
                recentSpending: "Recent Spending",
                noSpending: "No spending recorded yet",
                addFirstExpense: "Add Your First Expense",
                
                // Quick Actions
                quickAdd: "Quick Add",
                customAmount: "Custom Amount",
                
                // Registration Success
                registrationSuccess: "Registration Successful!",
                yourBudget: "Your Monthly Betting Budget",
                rememberBudget: "Remember: This is your MAXIMUM spending limit for betting this month!"
            },

            // ISIZULU
            zu: {
                dashboard: "Ideshibhodi",
                addExpense: "Faka Izindleko",
                logout: "Phuma",
                login: "Ngena ngemvume",
                register: "Bhalisa",
                email: "I-imeyili",
                password: "Iphasiwedi",
                fullName: "Igama eliphelele",
                monthlySalary: "Umholo wanyanga (R)",
                bettingPercentage: "Amaphesenti esabelo sokubheja",
                createAccount: "Yakha i-akhawunti",
                haveAccount: "Sewunawo i-akhawunti?",
                noAccount: "Awunawo i-akhawunti?",
                selectLanguage: "Khetha Ulimi Lakho",
                
                welcome: "Wamukelekile futhi",
                controlBudget: "Hlala ulawula isabelo sakho sokubheja",
                availableBalance: "Ibhalansi etholakalayo",
                monthlyBudget: "Isabelo senyanga",
                totalSpent: "Isamba esichithiwe",
                daysLeft: "Izinsuku ezisele kule nyanga",
                budgetProgress: "Intuthuko yesabelo senyanga",
                quickActions: "Faka izindleko ngokushesha",
                recentSpending: "Ukuchitha kwakamuva", 
                noSpending: "Azikho izindleko ezirekhodiwe okwamanje",
                addFirstExpense: "Faka isindleko sakho sokuqala",
                
                quickAdd: "Faka Ngokushesha",
                customAmount: "Inani elikhethekile",
                
                registrationSuccess: "Ukubhalisa Kuphumelele!",
                yourBudget: "Isabelo Sakho Sanyanga Sokubheja",
                rememberBudget: "Khumbula: Lesi yisilinganiso sakho esiphezulu sokuchitha kule nyanga!"
            },

            // AFRIKAANS
            af: {
                dashboard: "Dashboard",
                addExpense: "Voeg Uitgawe By",
                logout: "Teken Uit",
                login: "Teken In",
                register: "Registreer",
                email: "E-pos",
                password: "Wagwoord",
                fullName: "Volle Naam",
                monthlySalary: "Maandelikse Salaris (R)",
                bettingPercentage: "Dobbelbegroting Persentasie",
                createAccount: "Skep Rekening",
                haveAccount: "Het jy reeds 'n rekening?",
                noAccount: "Het jy nie 'n rekening nie?",
                selectLanguage: "Kies Jou Taal",
                
                welcome: "Welkom terug", 
                controlBudget: "Bly in beheer van jou dobbelbegroting",
                availableBalance: "Beskikbare Balans",
                monthlyBudget: "Maandelikse Begroting",
                totalSpent: "Totaal Bestee",
                daysLeft: "Dae Oor Hierdie Maand",
                budgetProgress: "Maandelikse Begrotingsvordering",
                quickActions: "Vinnige Uitgawes",
                recentSpending: "Onlangse Besteding",
                noSpending: "Nog geen besteding aangeteken nie",
                addFirstExpense: "Voeg Jou Eerste Uitgawe By",
                
                quickAdd: "Vinnige Toevoeging",
                customAmount: "Pasgemaakte Bedrag",
                
                registrationSuccess: "Registrasie Suksesvol!",
                yourBudget: "Jou Maandelikse Dobbelbegroting",
                rememberBudget: "Onthou: Dit is jou MAKSIMUM bestedingslimiet vir dobbel hierdie maand!"
            },

            // SESOTHO SA LEBOA (Northern Sotho)
            nso: {
                dashboard: "Dashboard",
                addExpense: "Lokela Ditshenyehelo",
                logout: "Tšwa",
                login: "Kena",
                register: "Ngodisa",
                email: "Imeile",
                password: "Phasewete",
                fullName: "Leina la botlalo",
                monthlySalary: "Moputso wa kgwedi (R)",
                bettingPercentage: "Lehesente ya peeletšo ya go bata",
                createAccount: "Hloma akhaonto",
                haveAccount: "O se o na le akhaonto?",
                noAccount: "Ga o na akhaonto?",
                selectLanguage: "Kgetha Polelo ya Gago",
                
                welcome: "Amogelle gape",
                controlBudget: "Dula o laola peeletšo ya gago ya go bata",
                availableBalance: "Palanse ye e hwetšagalago",
                monthlyBudget: "Peeletšo ya Kgwedi",
                totalSpent: "Kakaretšo ye e sepetšwego",
                daysLeft: "Matšatši a Šetšego Kgweding Ye",
                budgetProgress: "Tšwelopele ya Peeletšo ya Kgwedi",
                quickActions: "Lokela Ditshenyehelo Ka Bophapoši",
                recentSpending: "Ditshenyehelo tša Maabane",
                noSpending: "Ga go na ditshenyehelo tše di ngwadilwego go fihla ga bjale",
                addFirstExpense: "Lokela Tšenyehelo ya Gago ya Mathomo",
                
                quickAdd: "Lokela Ka Bophapoši",
                customAmount: "Tekanyo ye e Ikgethilego",
                
                registrationSuccess: "Ngodiso e Atlegile!",
                yourBudget: "Peeletšo ya Gago ya Kgwedi ya Go Bata",
                rememberBudget: "Gopola: Ye ke tekanyo ya gago ya godimo kudu ya tšenyehelo go bata kgweding ye!"
            },

            // SESOTHO (Southern Sotho)
            st: {
                dashboard: "Dashboard",
                addExpense: "Kenya Litšenyehelo",
                logout: "Tsoa",
                login: "Kena",
                register: "Ngolisa",
                email: "E-mail",
                password: "Password",
                fullName: "Leina le Feletseng",
                monthlySalary: "Moputso oa Khoeli (R)",
                bettingPercentage: "Peresente ea Budget ea ho Bapalla",
                createAccount: "Theha Akhaonto",
                haveAccount: "O se o na le akhaonto?",
                noAccount: "Ha u na akhaonto?",
                selectLanguage: "Khetha Puo ea Hau",
                
                welcome: "Rea u amohela hape",
                controlBudget: "Dula o laola tekanyetso ea hau ea ho bapala",
                availableBalance: "Chelete e teng",
                monthlyBudget: "Tekanyetso ea Khoeli",
                totalSpent: "Kakaretso e sebeditsweng",
                daysLeft: "Matsatsi a Setseng Khoeling ena",
                budgetProgress: "Nts'etsopele ea Tekanyetso ea Khoeli",
                quickActions: "Kenya Litšenyehelo Ka Potlako",
                recentSpending: "Litšenyehelo tsa hajoale",
                noSpending: "Ha ho na litšenyehelo tse ngolisitsoeng ho fihlela joale",
                addFirstExpense: "Kenya Tšenyehelo ea Hau ea Pele",
                
                quickAdd: "Kenya Ka Potlako",
                customAmount: "Chelete e Ithopileng",
                
                registrationSuccess: "Ho ngolisoa ha Atlehile!",
                yourBudget: "Budget ea Hau ea Khoeli ea ho Bapalla",
                rememberBudget: "Hopola: Ena ke moeli oa hau oa ho sebelisa chelete bakeng sa ho bapalla khoeling ena!"
            },

            // SETSWANA
            tn: {
                dashboard: "Dashboard",
                addExpense: "Lokela Ditshenyegelo",
                logout: "Tswa",
                login: "Tsena",
                register: "Ikwadise",
                email: "Imeile",
                password: "Password",
                fullName: "Leina la Gago lotlhe",
                monthlySalary: "Moputso wa kgwedi (R)",
                bettingPercentage: "Peresente ya Bajethe ya go Bheja",
                createAccount: "Dirisa Akhaonto",
                haveAccount: "O setse o na le akhaonto?",
                noAccount: "Ga o na akhaonto?",
                selectLanguage: "Tlhopha Puo ya Gago",
                
                welcome: "O amogetswe gape",
                controlBudget: "Nna o laola pakete ya gago ya go betha",
                availableBalance: "Palanse e e gona",
                monthlyBudget: "Pakete ya Kgwedi",
                totalSpent: "Kakaretso e e dirisitsweng",
                daysLeft: "Matsatsi a a Setseng mo Kgweding eno",
                budgetProgress: "Tlhabololo ya Pakete ya Kgwedi",
                quickActions: "Lokela Ditshenyegelo Ka Bonako",
                recentSpending: "Ditshenyegelo tsa Gompieno",
                noSpending: "Ga go na ditshenyegelo di kwadilweng go fitlha ga jaana",
                addFirstExpense: "Lokela Tšenyo ya Gago ya Ntlha",
                
                quickAdd: "Lokela Ka Bonako",
                customAmount: "Tekanyetso e e Ithutileng",
                
                registrationSuccess: "Go Ikwadisa go Atlegile!",
                yourBudget: "Bajethe ya Gago ya Kgwedi ya go Bheja",
                rememberBudget: "Gakologelwa: Eno ke tekanyetso ya gago e e kwa godimo ya go dirisa madi go bheja mo kgweding eno!"
            },

            // XITSONGA
            ts: {
                dashboard: "Dashboard",
                addExpense: "Yelana Swihetelelo",
                logout: "Humela",
                login: "Nghena",
                register: "Tsarisa",
                email: "Imeile",
                password: "Xihlamuselo",
                fullName: "Vito ro hetelela",
                monthlySalary: "Muholo wa n'weti (R)",
                bettingPercentage: "Peresente ya Bajeti ya ku Chela",
                createAccount: "Tumbuluxa Akhawunti",
                haveAccount: "Xana u se u na akhawunti?",
                noAccount: "Xana a wu na akhawunti?",
                selectLanguage: "Hlawula Ririmi ra Wena",
                
                welcome: "Amukeriwa nakambe",
                controlBudget: "Tshama u lawula bajeti ya wena ya ku chela",
                availableBalance: "Bhalansi yi kumekaka",
                monthlyBudget: "Bajeti ya N'weti",
                totalSpent: "Xigwebo xo hlayisiwa",
                daysLeft: "Siku lese N'wetini Lowu",
                budgetProgress: "Nhluvukiso wa Bajeti ya N'weti",
                quickActions: "Yelana Swihetelelo hi Xihatla",
                recentSpending: "Swihetelelo swa sweswi",
                noSpending: "A ku na swihetelelo leswi tsariweke ku fikela sweswi",
                addFirstExpense: "Yelana Helelo ra Wena ro Sungula",
                
                quickAdd: "Yelana hi Xihatla",
                customAmount: "Ndhzawulo wo Hlawuleka",
                
                registrationSuccess: "Ku Tsarisa swi Phumelele!",
                yourBudget: "Bajeti ya Wena ya N'weti ya ku Chela",
                rememberBudget: "Yiva: Leswi i xikombiso xa wena xa le henhla xa ku tirhisa mali eku cheleni en'wetini lowu!"
            },

            // SISWATI
            ss: {
                dashboard: "Dashboard",
                addExpense: "Faka Incenyetelo",
                logout: "Phuma",
                login: "Ngena",
                register: "Bhalisa",
                email: "I-imeyili",
                password: "Iphasiwedi",
                fullName: "Libito leliphelele",
                monthlySalary: "Umholo wenyanga (R)",
                bettingPercentage: "Liphesenti lebajeti yekubheja",
                createAccount: "Yakha i-akhawunti",
                haveAccount: "Sengivele nginayo i-akhawunti?",
                noAccount: "Awunayo i-akhawunti?",
                selectLanguage: "Khetsa Lulwimi lwakho",
                
                welcome: "Wemukelekile futsi",
                controlBudget: "Hlala ulawula inkeleko yakho yekubheja",
                availableBalance: "I-balance lekhona",
                monthlyBudget: "Inkeleko yenyanga",
                totalSpent: "Inani lelisetyenzisiwe",
                daysLeft: "Emalanga asele kule nyanga",
                budgetProgress: "Intfutfuko yenkeleko yenyanga",
                quickActions: "Faka Incenyetelo Ngesivinini",
                recentSpending: "Incenyetelo yakamuva",
                noSpending: "Ayikho incenyetelo lebolwe kuze kube manje",
                addFirstExpense: "Faka Incenyetelo Yakho Yekucala",
                
                quickAdd: "Faka Ngesivinini",
                customAmount: "Inani lelikhetsekile",
                
                registrationSuccess: "Kubhalisa Kuphumelele!",
                yourBudget: "Inkeleko Yakho Yenyanga Yekubheja",
                rememberBudget: "Khumbula: Leli lilinganiso lakho leliphezulu lekutisebenzisa imali ekubhejeni kule nyanga!"
            },

            // TSHIVENDA
            ve: {
                dashboard: "Dashboard",
                addExpense: "Dzudzanya Mbadelo",
                logout: "Bva",
                login: "Ngena",
                register: "Ngwadisa",
                email: "Imeila",
                password: "Phasiwede",
                fullName: "Dzina lo fhelela",
                monthlySalary: "Muelo wa mvedzi (R)",
                bettingPercentage: "Peresente ya budzete ya u beda",
                createAccount: "Bumba Akhaunti",
                haveAccount: "Ndi no vha na akhaunti?",
                noAccount: "A wa vha na akhaunti?",
                selectLanguage: "Nanga Luambo lwawe",
                
                welcome: "Takalitsheni nga mulandu",
                controlBudget: "Dzula u laula budzete yawe ya u beda",
                availableBalance: "Balansi yo wanala",
                monthlyBudget: "Budzete ya Mvedzi",
                totalSpent: "Tholi yo shumiswa",
                daysLeft: "Matshili o sala Mvedzini Uno",
                budgetProgress: "Muelo wa Budzete ya Mvedzi",
                quickActions: "Dzudzanya Mbadelo nga Vhuangu",
                recentSpending: "Mbadelo ya Vhudzihili",
                noSpending: "A hu na mbadelo yo ngwalwa hu fi hafhu",
                addFirstExpense: "Dzudzanya Mbadelo Yawe ya U thoma",
                
                quickAdd: "Dzudzanya nga Vhuangu",
                customAmount: "Ndea yo itwaho",
                
                registrationSuccess: "Ku Ngwadisa ho Konbele!",
                yourBudget: "Budzete Yawe ya Mvedzi ya U Beda",
                rememberBudget: "Fhungudzani: Iyi ndi tshivhalo tshawe tsha henefha tsha u shumisa mali kha u beda kha mvedzi uno!"
            },

            // ISINDEBELE
            nr: {
                dashboard: "Dashboard",
                addExpense: "Faka Izindleko",
                logout: "Phuma",
                login: "Ngena",
                register: "Bhalisa",
                email: "I-imeyili",
                password: "Iphasiwedi",
                fullName: "Igama eliphelele",
                monthlySalary: "Umholo wenyanga (R)",
                bettingPercentage: "Amaphesenti esabelo sokubheja",
                createAccount: "Yakha i-akhawunti",
                haveAccount: "Sewunayo i-akhawunti?",
                noAccount: "Awunayo i-akhawunti?",
                selectLanguage: "Khetha Ulimi Lakho",
                
                welcome: "Wamukelekile futhi",
                controlBudget: "Hlala ulawula isabelo sakho sokubheja",
                availableBalance: "Ibhalansi etholakalayo",
                monthlyBudget: "Isabelo senyanga",
                totalSpent: "Isamba esichithiwe",
                daysLeft: "Izinsuku ezisele kule nyanga",
                budgetProgress: "Intuthuko yesabelo senyanga",
                quickActions: "Faka izindleko ngokushesha",
                recentSpending: "Ukuchitha kwakamuva", 
                noSpending: "Azikho izindleko ezirekhodiwe okwamanje",
                addFirstExpense: "Faka isindleko sakho sokuqala",
                
                quickAdd: "Faka Ngokushesha",
                customAmount: "Inani elikhethekile",
                
                registrationSuccess: "Ukubhalisa Kuphumelele!",
                yourBudget: "Isabelo Sakho Sanyanga Sokubheja",
                rememberBudget: "Khumbula: Lesi yisilinganiso sakho esiphezulu sokuchitha kule nyanga!"
            },

            // ISIXHOSA
            xh: {
                dashboard: "Dashboard",
                addExpense: "Faka Iindleko",
                logout: "Phuma",
                login: "Ngena",
                register: "Bhalisa",
                email: "I-imeyili",
                password: "Ipassword",
                fullName: "Igama elipheleleyo",
                monthlySalary: "Umvuzo wenyanga (R)",
                bettingPercentage: "Ipesenti yeBajeti yokutshaya",
                createAccount: "Yenza iAkhawunti",
                haveAccount: "Sele unayo iAkhawunti?",
                noAccount: "Awunayo iAkhawunti?",
                selectLanguage: "Khetha Ulwimi lwakho",
                
                welcome: "Wamkelekile kwakhona",
                controlBudget: "Hlala ulawula iBajeti yakho yokutshaya",
                availableBalance: "Ibhalansi ekhoyo",
                monthlyBudget: "IBajeti yenyanga",
                totalSpent: "Isonto esichithiweyo",
                daysLeft: "Iintsuku ezisele kule nyanga",
                budgetProgress: "Inkqubela yeBajeti yenyanga",
                quickActions: "Faka Iindleko Ngesantya",
                recentSpending: "Ukuchitha kwakutshanje", 
                noSpending: "Azikho iindleko ezirekhodiweyo okwangoku",
                addFirstExpense: "Faka intlawulo yakho yokuqala",
                
                quickAdd: "Faka Ngesantya",
                customAmount: "Isixa esiSesikhethe",
                
                registrationSuccess: "Ukubhalisa Kuphumelele!",
                yourBudget: "IBajeti yakho yenyanga yokutshaya",
                rememberBudget: "Khumbula: Le yimalo yakho ephezulu yokusebenzisa imali ekutshayeni kule nyanga!"
            }
        };
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.createLanguageSelector();
    }

    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[lang] && this.translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                    element.placeholder = this.translations[lang][key];
                } else {
                    element.textContent = this.translations[lang][key];
                }
            }
        });
    }

    createLanguageSelector() {
        const selectorHTML = `
            <div class="language-selector">
                <select id="languageSelect" onchange="window.saLanguageSystem.changeLanguage(this.value)">
                    <option value="en">🇺🇸 English</option>
                    <option value="zu">🇿🇦 isiZulu</option>
                    <option value="af">🇿🇦 Afrikaans</option>
                    <option value="nso">🇿🇦 Sesotho sa Leboa</option>
                    <option value="st">🇿🇦 Sesotho</option>
                    <option value="tn">🇿🇦 Setswana</option>
                    <option value="ts">🇿🇦 Xitsonga</option>
                    <option value="ss">🇿🇦 siSwati</option>
                    <option value="ve">🇿🇦 Tshivenda</option>
                    <option value="nr">🇿🇦 isiNdebele</option>
                    <option value="xh">🇿🇦 isiXhosa</option>
                </select>
            </div>
        `;
        
        // Add to navigation if it exists
        const navContainer = document.querySelector('.nav-links');
        if (navContainer) {
            const existingSelector = navContainer.querySelector('.language-selector');
            if (!existingSelector) {
                navContainer.insertAdjacentHTML('afterbegin', selectorHTML);
                document.getElementById('languageSelect').value = this.currentLang;
            }
        }
    }

    changeLanguage(lang) {
        this.applyLanguage(lang);
        
        // Show language change confirmation
        const langName = this.getLanguageName(lang);
        if (typeof showAlert === 'function') {
            showAlert(`🌍 Language changed to ${langName}`, 'success');
        }
    }

    getLanguageName(langCode) {
        const names = {
            en: 'English',
            zu: 'isiZulu', 
            af: 'Afrikaans',
            nso: 'Sesotho sa Leboa',
            st: 'Sesotho',
            tn: 'Setswana',
            ts: 'Xitsonga',
            ss: 'siSwati',
            ve: 'Tshivenda',
            nr: 'isiNdebele',
            xh: 'isiXhosa'
        };
        return names[langCode] || 'English';
    }

    t(key, variables = {}) {
        let translation = this.translations[this.currentLang][key] || key;
        
        // Replace variables
        Object.keys(variables).forEach(variable => {
            translation = translation.replace(`{${variable}}`, variables[variable]);
        });
        
        return translation;
    }
}

// Initialize Language System
window.saLanguageSystem = new SouthAfricanLanguageSystem();