// Coastal Kenya Tourism Experience & Booking Service
// Categories: Culture, Food, Stays, Beach, and Safaris
// Powered by LocalStorage for resilient offline persistence

const STORAGE_KEYS = {
    EVENTS: 'pwani_events_v2',
    BOOKINGS: 'pwani_bookings_v2',
    USERS: 'pwani_users_v2',
    CURRENT_USER: 'pwani_current_user_v2',
    LIKES: 'pwani_user_likes_v2',
    REVIEWS: 'pwani_reviews_v2'
};

export const COASTAL_CATEGORIES = [
    { id: 'all', name: 'All Experiences', icon: 'FaCompass', tag: 'All' },
    { id: 'Culture', name: 'Culture', icon: 'FaLandmark', tag: 'Swahili Culture' },
    { id: 'Food', name: 'Food', icon: 'FaUtensils', tag: 'Swahili Food & Dining' },
    { id: 'Stays', name: 'Stays', icon: 'FaHotel', tag: 'Coastal Stays & Villas' },
    { id: 'Beach', name: 'Beach', icon: 'FaUmbrellaBeach', tag: 'Beach & Watersports' },
    { id: 'Safaris', name: 'Safaris', icon: 'FaPaw', tag: 'Bush & Marine Safaris' }
];

export const EVENT_CATEGORIES = COASTAL_CATEGORIES;

export const COASTAL_DESTINATIONS = [
    'All Destinations',
    'Diani Beach',
    'Mombasa & Old Town',
    'Watamu',
    'Lamu Island',
    'Kilifi',
    'Malindi',
    'Wasini Island',
    'Shimba Hills / Tsavo'
];

export const INITIAL_USERS = [
    {
        id: 'usr_organizer_pwani',
        username: 'Pwani Escapes & Tours',
        email: 'organizer@zurucoast.com',
        role: 'host',
        hostType: 'business',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone_number: '+254 711 234 567',
        bio: 'Premier coastal experience provider across Mombasa, Diani, Watamu, Kilifi, and Lamu.'
    },
    {
        id: 'usr_traveler_pwani',
        username: 'Zawadi Traveler',
        email: 'traveler@zurucoast.com',
        role: 'traveler',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone_number: '+254 722 889 900',
        bio: 'Coastal explorer, Swahili seafood lover & dolphin cruise enthusiast.'
    },
    {
        id: 'usr_admin_pwani',
        username: 'Coast Tourism Admin',
        email: 'admin@zurucoast.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone_number: '+254 700 112 233',
        bio: 'Coast Regional Tourism Board Coordinator.'
    }
];

const INITIAL_COASTAL_EXPERIENCES = [
    // 1. CULTURE
    {
        id: 'cst_1',
        title: 'Fort Jesus Sound & Light Night Show with Swahili Banquet',
        description: 'Step into 400 years of coastal history inside Fort Jesus! Enjoy a 3D hologram sound and light show illuminating Portuguese and Omani battles, followed by a candlelit Swahili buffet dinner and live Taarab music under the stars.',
        category: 'Culture',
        location: 'Mombasa & Old Town',
        venue: 'Fort Jesus World Heritage Site, Mombasa Old Town',
        startDate: '2026-10-18',
        endDate: '2026-10-18',
        time: '6:30 PM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&auto=format&fit=crop&q=80',
        price: 2500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_c1_std', name: 'Show & Dinner Pass', price: 2500, available: 60, total: 100, perks: ['Fort Jesus entry', '3D Sound & Light Show', 'Traditional Swahili buffet dinner'] },
            { id: 'tier_c1_vip', name: 'VIP Royal Terrace', price: 5000, available: 15, total: 30, perks: ['Front-row terrace seating', 'Private butler service', 'Complimentary spiced Kahwa & Halwa gift pack'] }
        ],
        likesCount: 184,
        viewsCount: 2450,
        featured: true,
        tags: ['History', 'Taarab', 'Fort Jesus', 'Swahili Heritage']
    },
    {
        id: 'cst_2',
        title: 'Lamu Cultural Dhow Regatta & Henna Art Exhibition',
        description: 'Immerse yourself in UNESCO-listed Lamu Old Town. Witness traditional lateen-sail dhow racing across the Lamu archipelago, explore coral stone architecture, watch master woodcarvers, and enjoy aromatic coastal street delicacies.',
        category: 'Culture',
        location: 'Lamu Island',
        venue: 'Lamu Seafront & Shela Waterfront, Lamu Island',
        startDate: '2026-11-20',
        endDate: '2026-11-22',
        time: '9:00 AM - 6:00 PM',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80',
        price: 1800,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_c2_fest', name: 'Festival Explorer Pass', price: 1800, available: 85, total: 150, perks: ['Festival badge', 'Guided Old Town heritage walking tour', 'Dhow race viewing spot'] },
            { id: 'tier_c2_dhow', name: 'Dhow Cruise & Sunset Feast', price: 4500, available: 20, total: 35, perks: ['Spot aboard competing wooden dhow', 'Fresh coconut water & grilled samosas', 'Sunset cruise to Shela'] }
        ],
        likesCount: 142,
        viewsCount: 1890,
        featured: false,
        tags: ['Lamu', 'Dhow Race', 'UNESCO', 'Swahili Craft']
    },

    // 2. FOOD
    {
        id: 'cst_3',
        title: 'Tamarind Dhow Ocean Sunset Dinner & Seafood Feast',
        description: 'Sail into the Mombasa sunset on an authentic carved Arab Dhow. Savor charcoal-grilled jumbo prawns, lobster tail, and fish fillet prepared live on board while cruising the serene Tudor Creek accompanied by coastal jazz.',
        category: 'Food',
        location: 'Mombasa & Old Town',
        venue: 'Tamarind Jetty, Nyali, Mombasa',
        startDate: '2026-10-24',
        endDate: '2026-10-24',
        time: '5:30 PM - 10:30 PM',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
        price: 5500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_f1_dinner', name: 'Sunset Dinner Cruise', price: 5500, available: 32, total: 60, perks: ['Welcome Tamarind Dawa cocktail', '4-course fresh seafood dinner', 'Live acoustic band performance'] },
            { id: 'tier_f1_champagne', name: 'Champagne Captainâ€™s Deck', price: 9500, available: 8, total: 12, perks: ['Private forward deck seating', 'Chilled MoÃ«t Champagne bottle', 'Caviar & lobster canapÃ©s'] }
        ],
        likesCount: 275,
        viewsCount: 3820,
        featured: true,
        tags: ['Dhow Cruise', 'Seafood', 'Sunset', 'Fine Dining']
    },
    {
        id: 'cst_4',
        title: 'Mombasa Old Town Swahili Street Food & Spice Trail',
        description: 'Taste the real flavors of coastal Kenya! Walk the labyrinth alleys of Old Mombasa and sample sizzling Mshikaki, Viazi Karai, fresh Cassava crisps, Mahamri with coconut pigeon peas, Sugarcane juice, and aromatic Swahili Biryani.',
        category: 'Food',
        location: 'Mombasa & Old Town',
        venue: 'Old Port Fish Market to Kibokoni, Mombasa',
        startDate: '2026-10-22',
        endDate: '2026-10-22',
        time: '4:00 PM - 8:30 PM',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
        price: 1500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_f2_trail', name: 'Foodie Explorer Pass', price: 1500, available: 45, total: 60, perks: ['Local foodie guide', '7 food tastings included', 'Fresh sugarcane juice & Swahili coffee'] }
        ],
        likesCount: 198,
        viewsCount: 2210,
        featured: false,
        tags: ['Biryani', 'Street Food', 'Viazi Karai', 'Spices']
    },

    // 3. STAYS
    {
        id: 'cst_5',
        title: 'Luxury Swahili Stone Villa & Rooftop Plunge Pool Retreat',
        description: 'Experience pure coastal tranquility in Shela village. A restored 3-bedroom private Swahili coral-stone mansion featuring antique carved doors, breezy shaded verandas, private rooftop pool overlooking the Indian Ocean, and an in-house private chef.',
        category: 'Stays',
        location: 'Lamu Island',
        venue: 'Shela Village Beachfront, Lamu',
        startDate: '2026-11-01',
        endDate: '2026-11-05',
        time: 'Check-in: 12:00 PM',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
        price: 8500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_s1_night', name: 'Per Night Stay (Up to 4 Guests)', price: 8500, available: 6, total: 10, perks: ['Exclusive entire villa rental', 'Daily Swahili breakfast', 'Boat transfers from Manda Airstrip'] },
            { id: 'tier_s1_wknd', name: 'Weekend Escape Package (3 Nights)', price: 24000, available: 2, total: 4, perks: ['3-night luxury stay', 'Private chef preparing daily seafood banquets', 'Sunset dhow trip included'] }
        ],
        likesCount: 310,
        viewsCount: 4120,
        featured: true,
        tags: ['Lamu Villa', 'Private Pool', 'Luxury Stay', 'Ocean View']
    },
    {
        id: 'cst_6',
        title: 'Eco-Beachfront Mangrove Treehouse with Sunset Kayaking',
        description: 'Perched in the baobabs overlooking Kilifi Creek, wake up to sunrise bird calls and turquoise waters. Features eco-friendly timber suites, direct creek beach access, open-air rainwater showers, and complimentary paddleboards.',
        category: 'Stays',
        location: 'Kilifi',
        venue: 'Bofa Beach & Creek Overlook, Kilifi',
        startDate: '2026-10-25',
        endDate: '2026-10-28',
        time: 'Check-in: 2:00 PM',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80',
        price: 6200,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_s2_cabin', name: 'Overwater Treehouse Suite', price: 6200, available: 8, total: 12, perks: ['Boutique treehouse suite', 'Tropical breakfast bowl', 'Unlimited kayak & paddleboard use'] }
        ],
        likesCount: 165,
        viewsCount: 1980,
        featured: false,
        tags: ['Kilifi Creek', 'Treehouse', 'Eco Stay', 'Kayaking']
    },

    // 4. BEACH
    {
        id: 'cst_7',
        title: 'Wasini Island Dolphin Dhow Cruise & Kisite Coral Snorkeling',
        description: 'Board an authentic motorized wooden dhow sailing through the Kisite-Mpunguti Marine National Park. Swim alongside playful pods of wild dolphins, snorkel vibrant coral reefs teeming with sea turtles, followed by a Swahili crab feast on Wasini Island.',
        category: 'Beach',
        location: 'Wasini Island',
        venue: 'Shimoni Jetty & Kisite Marine Sanctuary, South Coast',
        startDate: '2026-10-19',
        endDate: '2026-10-19',
        time: '7:30 AM - 4:30 PM',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80',
        price: 4500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_b1_std', name: 'Dolphin Safari & Snorkel Pass', price: 4500, available: 28, total: 50, perks: ['Dhow cruise & dolphin spotting', 'Snorkeling gear & marine park fees', 'Wasini crab and coconut rice lunch'] },
            { id: 'tier_b1_priv', name: 'Private Charter Dhow', price: 18000, available: 3, total: 5, perks: ['Private dhow for up to 6 people', 'Personal marine biologist guide', 'Seafood platter with lobster & oysters'] }
        ],
        likesCount: 340,
        viewsCount: 4600,
        featured: true,
        tags: ['Dolphins', 'Wasini Island', 'Snorkeling', 'Marine Park']
    },
    {
        id: 'cst_8',
        title: 'Diani Beach Kitesurfing & Coral Sandbank Adventure',
        description: 'Voted Africaâ€™s leading beach destination! Catch the trade winds with certified IKO instructors in the shallow turquoise lagoons of Galu, followed by a boat ride to Robinson Crusoe Sandbank for fresh tropical fruits and chilled coconut water.',
        category: 'Beach',
        location: 'Diani Beach',
        venue: 'Galu Kinondo Beach & Robinson Sandbank, Diani',
        startDate: '2026-10-23',
        endDate: '2026-10-23',
        time: '10:00 AM - 3:00 PM',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        price: 3500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_b2_day', name: 'Sandbank Cruise & Watersports', price: 3500, available: 40, total: 60, perks: ['Glass-bottom boat to sandbank', 'Snorkel gear', 'Fresh seasonal fruit platter'] },
            { id: 'tier_b2_kite', name: '2-Hour Kitesurf Discovery Lesson', price: 7500, available: 12, total: 15, perks: ['Full equipment hire', '1-on-1 IKO certified instruction', 'Action camera photo package'] }
        ],
        likesCount: 220,
        viewsCount: 2890,
        featured: false,
        tags: ['Diani Beach', 'Kitesurfing', 'Sandbank', 'Lagoon']
    },

    // 5. SAFARIS
    {
        id: 'cst_9',
        title: 'Shimba Hills Sable Antelope & Sheldrick Falls Safari',
        description: 'Escape the beach heat into coastal rainforest! A guided 4x4 expedition through Shimba Hills National Reserve to see rare Sable Antelopes, elephant herds, and colobus monkeys, followed by a refreshing hike to the picturesque Sheldrick Falls.',
        category: 'Safaris',
        location: 'Shimba Hills / Tsavo',
        venue: 'Shimba Hills National Reserve, Kwale',
        startDate: '2026-10-26',
        endDate: '2026-10-26',
        time: '6:30 AM - 3:30 PM',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80',
        price: 4800,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_sf1_std', name: 'Day Safari & Waterfall Trek', price: 4800, available: 24, total: 36, perks: ['4x4 game drive vehicle', 'Park entry fees', 'Ranger-guided waterfall hike', 'Bush picnic lunch'] }
        ],
        likesCount: 215,
        viewsCount: 2780,
        featured: false,
        tags: ['Shimba Hills', 'Elephants', 'Waterfall', 'Coastal Safari']
    },
    {
        id: 'cst_10',
        title: 'Tsavo East Coastal Express 1-Day Big Five Safari',
        description: 'The ultimate coastal safari day trip! Early morning pickup from Diani/Mombasa directly into the red-dust savannah of Tsavo East. Spot the legendary Red Elephants, lions, cheetahs, and giraffes along the Galana River with sunset return.',
        category: 'Safaris',
        location: 'Shimba Hills / Tsavo',
        venue: 'Bachuma Gate, Tsavo East National Park',
        startDate: '2026-11-08',
        endDate: '2026-11-08',
        time: '5:00 AM - 7:00 PM',
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&auto=format&fit=crop&q=80',
        price: 14500,
        hostId: 'usr_organizer_pwani',
        organizer: {
            id: 'usr_organizer_pwani',
            username: 'Pwani Escapes & Tours',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            verified: true
        },
        ticketTiers: [
            { id: 'tier_sf2_join', name: 'Open-Roof Land Cruiser Seat', price: 14500, available: 16, total: 24, perks: ['Round-trip hotel transfer', 'Tsavo East KWS park entrance', 'Full day guided game drive', 'Lodge buffet lunch'] },
            { id: 'tier_sf2_priv', name: 'Private Jeep (Up to 5 Guests)', price: 48000, available: 3, total: 4, perks: ['Private 4x4 safari cruiser', 'Dedicated gold-level safari guide', 'Champagne sundowner at Aruba Dam'] }
        ],
        likesCount: 380,
        viewsCount: 5200,
        featured: true,
        tags: ['Tsavo East', 'Big Five', 'Red Elephants', 'Day Safari']
    }
];

const INITIAL_COASTAL_BOOKINGS = [
    {
        id: 'bkg_pwani_101',
        ticketCode: 'ZTK-DHOW-4921',
        eventId: 'cst_3',
        eventTitle: 'Tamarind Dhow Ocean Sunset Dinner & Seafood Feast',
        eventCategory: 'Food',
        eventImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
        eventVenue: 'Tamarind Jetty, Nyali, Mombasa',
        eventDate: '2026-10-24',
        eventTime: '5:30 PM - 10:30 PM',
        ticketTierName: 'Sunset Dinner Cruise',
        ticketPrice: 5500,
        quantity: 2,
        totalPrice: 11000,
        travelerName: 'Zawadi Traveler',
        travelerEmail: 'traveler@zurucoast.com',
        travelerPhone: '+254 722 889 900',
        userId: 'usr_traveler_pwani',
        hostId: 'usr_organizer_pwani',
        status: 'confirmed',
        bookingDate: '2026-09-10',
        specialRequests: 'Celebrating anniversary, forward deck preferred',
        qrData: 'ZTK-DHOW-4921::cst_3::Zawadi Traveler::2TICKETS::CONFIRMED'
    }
];

// Initialize Storage
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_COASTAL_EXPERIENCES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_COASTAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
        localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify({
            'cst_3': [
                { id: 'rev_1', user: 'Salim M.', rating: 5, comment: 'The grilled lobster on the dhow as the sun sets over Mombasa creek is unmatched in East Africa!', date: '2026-09-02' }
            ],
            'cst_7': [
                { id: 'rev_2', user: 'Chloe W.', rating: 5, comment: 'Seeing 20+ dolphins leap right beside our dhow in Kisite was magical. Amazing crab lunch too.', date: '2026-09-06' }
            ]
        }));
    }
}

// Ensure storage initialized
initStorage();

export const eventService = {
    // -------------------------------------------------------------
    // COASTAL EXPERIENCES
    // -------------------------------------------------------------
    getEvents: async ({ search = '', category = '', location = '', minPrice = '', maxPrice = '' } = {}) => {
        initStorage();
        let events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');

        if (search) {
            const q = search.toLowerCase();
            events = events.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.venue.toLowerCase().includes(q) ||
                e.location.toLowerCase().includes(q) ||
                (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
            );
        }

        if (category && category !== 'all') {
            events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
        }

        if (location && location !== 'All Destinations') {
            const loc = location.toLowerCase();
            events = events.filter(e => e.location.toLowerCase().includes(loc) || e.venue.toLowerCase().includes(loc));
        }

        if (minPrice) {
            events = events.filter(e => e.price >= Number(minPrice));
        }

        if (maxPrice) {
            events = events.filter(e => e.price <= Number(maxPrice));
        }

        return events;
    },

    getEventById: async (id) => {
        initStorage();
        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        return events.find(e => e.id === id) || null;
    },

    createEvent: async (eventData, currentUser) => {
        initStorage();
        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');

        const tiers = (eventData.ticketTiers && eventData.ticketTiers.length > 0) ? eventData.ticketTiers : [
            {
                id: `tier_${Date.now()}_std`,
                name: 'Standard Experience Pass',
                price: Number(eventData.price) || 2500,
                available: Number(eventData.capacity) || 50,
                total: Number(eventData.capacity) || 50,
                perks: ['Guided Coastal Tour', 'Equipment / Entrance']
            },
            {
                id: `tier_${Date.now()}_vip`,
                name: 'VIP Private Experience',
                price: (Number(eventData.price) || 2500) * 2,
                available: 15,
                total: 15,
                perks: ['Private Guide', 'Refreshments & Seafood Lunch', 'Priority Booking']
            }
        ];

        const newExperience = {
            id: `cst_${Date.now()}`,
            title: eventData.title,
            description: eventData.description || '',
            category: eventData.category || 'Culture',
            location: eventData.location || 'Diani Beach',
            venue: eventData.venue || eventData.location || 'Coast Beachfront',
            startDate: eventData.startDate || new Date().toISOString().split('T')[0],
            endDate: eventData.endDate || eventData.startDate || new Date().toISOString().split('T')[0],
            time: eventData.time || '9:00 AM - 5:00 PM',
            image: eventData.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80',
            price: Number(eventData.price) || 2500,
            hostId: currentUser?.id || 'usr_organizer_pwani',
            organizer: {
                id: currentUser?.id || 'usr_organizer_pwani',
                username: currentUser?.username || 'Coastal Host',
                avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                verified: true
            },
            ticketTiers: tiers,
            likesCount: 0,
            viewsCount: 1,
            featured: false,
            tags: eventData.tags || [eventData.category || 'Coastal Experience']
        };

        events.unshift(newExperience);
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
        return newExperience;
    },

    updateEvent: async (id, updateData) => {
        initStorage();
        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        const index = events.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Experience not found');

        events[index] = { ...events[index], ...updateData };
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
        return events[index];
    },

    deleteEvent: async (id) => {
        initStorage();
        let events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        events = events.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
        return { success: true };
    },

    toggleLike: async (eventId, userId) => {
        initStorage();
        const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}');
        const userLikes = likes[userId] || [];
        const isLiked = userLikes.includes(eventId);

        let newUserLikes;
        if (isLiked) {
            newUserLikes = userLikes.filter(id => id !== eventId);
        } else {
            newUserLikes = [...userLikes, eventId];
        }
        likes[userId] = newUserLikes;
        localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));

        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        const event = events.find(e => e.id === eventId);
        if (event) {
            event.likesCount = Math.max(0, (event.likesCount || 0) + (isLiked ? -1 : 1));
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
        }

        return { liked: !isLiked, count: event ? event.likesCount : 0 };
    },

    isLiked: async (eventId, userId) => {
        if (!userId) return false;
        initStorage();
        const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}');
        const userLikes = likes[userId] || [];
        return userLikes.includes(eventId);
    },

    // -------------------------------------------------------------
    // BOOKINGS & PASSES
    // -------------------------------------------------------------
    bookTickets: async ({
        eventId,
        ticketTierId,
        quantity = 1,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        specialRequests = '',
        user
    }) => {
        initStorage();
        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        const event = events.find(e => e.id === eventId);
        if (!event) throw new Error('Experience not found');

        const tier = event.ticketTiers.find(t => t.id === ticketTierId) || event.ticketTiers[0];
        if (tier.available < quantity) {
            throw new Error(`Only ${tier.available} spots left in ${tier.name}`);
        }

        tier.available -= Number(quantity);
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const prefix = event.title.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase();
        const ticketCode = `PWN-${prefix}-${randomCode}`;

        const newBooking = {
            id: `bkg_${Date.now()}`,
            ticketCode,
            eventId: event.id,
            eventTitle: event.title,
            eventCategory: event.category,
            eventImage: event.image,
            eventVenue: event.venue,
            eventDate: event.startDate,
            eventTime: event.time,
            ticketTierName: tier.name,
            ticketPrice: tier.price,
            quantity: Number(quantity),
            totalPrice: tier.price * Number(quantity),
            travelerName: attendeeName || user?.username || 'Coast Traveler',
            travelerEmail: attendeeEmail || user?.email || 'traveler@zurucoast.com',
            travelerPhone: attendeePhone || user?.phone_number || '',
            userId: user?.id || 'usr_traveler_pwani',
            hostId: event.hostId || 'usr_organizer_pwani',
            status: 'confirmed',
            bookingDate: new Date().toISOString().split('T')[0],
            specialRequests,
            qrData: `${ticketCode}::${event.id}::${attendeeName}::QTY:${quantity}::CONFIRMED`
        };

        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        bookings.unshift(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        return newBooking;
    },

    getMyBookings: async (userId) => {
        initStorage();
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        if (!userId) return bookings;
        return bookings.filter(b => b.userId === userId);
    },

    cancelBooking: async (bookingId) => {
        initStorage();
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');

        booking.status = 'cancelled';
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        const event = events.find(e => e.id === booking.eventId);
        if (event) {
            const tier = event.ticketTiers.find(t => t.name === booking.ticketTierName);
            if (tier) {
                tier.available = Math.min(tier.total, tier.available + booking.quantity);
                localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
            }
        }

        return booking;
    },

    deleteBooking: async (bookingId) => {
        initStorage();
        let bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        bookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return { success: true };
    },

    // -------------------------------------------------------------
    // ORGANIZER & ADMIN
    // -------------------------------------------------------------
    getHostEvents: async (hostId) => {
        initStorage();
        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
        if (!hostId) return events;
        return events.filter(e => e.hostId === hostId);
    },

    getHostBookings: async (hostId) => {
        initStorage();
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        if (!hostId) return bookings;
        return bookings.filter(b => b.hostId === hostId);
    },

    getHostAnalytics: async (hostId) => {
        initStorage();
        const events = await eventService.getHostEvents(hostId);
        const bookings = await eventService.getHostBookings(hostId);

        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        const totalTicketsSold = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.quantity || 0), 0);

        const totalViews = events.reduce((sum, e) => sum + (e.viewsCount || 0), 0);

        return {
            totalRevenue,
            totalTicketsSold,
            activeEventsCount: events.length,
            totalViews,
            recentSales: bookings.slice(0, 5),
            topEvents: events.slice(0, 3)
        };
    },

    getAllBookingsAdmin: async () => {
        initStorage();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    },

    getAllUsersAdmin: async () => {
        initStorage();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    // -------------------------------------------------------------
    // REVIEWS
    // -------------------------------------------------------------
    getReviews: async (eventId) => {
        initStorage();
        const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
        return allReviews[eventId] || [];
    },

    addReview: async (eventId, { user, rating, comment }) => {
        initStorage();
        const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
        if (!allReviews[eventId]) allReviews[eventId] = [];

        const newReview = {
            id: `rev_${Date.now()}`,
            user: user?.username || 'Verified Traveler',
            rating: Number(rating) || 5,
            comment,
            date: new Date().toISOString().split('T')[0]
        };

        allReviews[eventId].unshift(newReview);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
        return newReview;
    },

    // -------------------------------------------------------------
    // AUTH
    // -------------------------------------------------------------
    login: async (email, password) => {
        initStorage();
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            const newUser = {
                id: `usr_${Date.now()}`,
                username: email.split('@')[0],
                email,
                role: 'traveler',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };
            users.push(newUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
            return { success: true, user: newUser, token: `tok_${Date.now()}` };
        }

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return { success: true, user, token: `tok_${Date.now()}` };
    },

    register: async (username, email, password, role = 'traveler', hostType = 'individual') => {
        initStorage();
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            throw new Error('An account with this email already exists.');
        }

        const newUser = {
            id: `usr_${Date.now()}`,
            username,
            email,
            role: role || 'traveler',
            hostType: role === 'host' ? (hostType || 'individual') : undefined,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: role === 'host' ? 'Coastal Kenya Tourism Host & Guide' : 'Coast Tourism Explorer'
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
        return { success: true, user: newUser, token: `tok_${Date.now()}` };
    }
};
