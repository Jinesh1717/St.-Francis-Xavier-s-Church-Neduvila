require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');
const Setting = require('../models/Setting');
const Prayer = require('../models/Prayer');
const Timing = require('../models/Timing');

const seedData = async () => {
  try {
    console.log('--- Starting Church Database Seeding ---');
    await connectDB();

    const adminUsername = (process.env.ADMIN_USERNAME || 'churchadmin').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'StFrancisXavier@2026#Secure!';

    // 1. Seed Admin
    let admin = await Admin.findOne({ username: adminUsername });
    if (!admin) {
      admin = new Admin({
        username: adminUsername,
        password: adminPassword,
      });
      await admin.save();
      console.log(`✓ Admin user created successfully: "${adminUsername}"`);
    } else {
      admin.password = adminPassword;
      admin.failedLoginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
      console.log(`✓ Admin user "${adminUsername}" updated with current credentials.`);
    }

    // 2. Seed Church Settings
    await Setting.deleteMany({});
    await Setting.create({
      churchName: "St. Francis Xavier's Church, Neduvila",
      churchNameMalayalam: "വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം, നെടുവില",
      address: "Neduvila, Latin Diocese of Neyyattinkara, Kerala, India - 688531",
      phone: "+91 94470 23456 / 0477 2289123",
      email: "parish@stfrancisneduvila.org",
      historyText: "Founded in the heart of Kerala under the Latin Diocese of Neyyattinkara, St. Francis Xavier's Church, Neduvila has served as a sanctuary of deep spiritual devotion and active communal fellowship for generations. Inspired by the zeal of our patron, the great Jesuit apostle of the East, St. Francis Xavier, the parish continues its vibrant ministry of faith, youth formation, and compassionate care for the vulnerable.",
      historyTextMalayalam: "നെയ്യാറ്റിൻകര ലത്തീൻ രൂപതയുടെ കീഴിൽ സ്ഥിതി ചെയ്യുന്ന നെടുവില വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം തലമുറകളായി വിശ്വാസത്തിന്റെ പവിത്ര കേന്ദ്രമാണ്. ഭാരതത്തിന്റെ അപ്പസ്തോലനായ വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യറിന്റെ മാതൃകയിൽ സ്ഥാപിതമായ ഈ ഇടവക പ്രാർത്ഥനയിലും അഗതികൾക്കായുള്ള ജീവകാരുണ്യ പ്രവർത്തനങ്ങളിലും മുൻപന്തിയിൽ നിൽക്കുന്നു.",
      massTimings: [
        { day: "Sunday (ഞായർ)", time: "06:30 AM & 09:30 AM", description: "വിശുദ്ധ കുർബാന & വചനസന്ദേശം (Solemn Mass)" },
        { day: "Monday to Thursday (തിങ്കൾ - വ്യാഴം)", time: "06:30 AM", description: "വിശുദ്ധ കുർബാന (Morning Mass)" },
        { day: "Friday (വെള്ളി)", time: "06:30 AM & 05:00 PM", description: "വിശുദ്ധ കുർബാന & നിത്യസഹായ മാതാവിന്റെ നൊവേന (Novena & Adoration)" },
        { day: "Saturday (ശനി)", time: "06:45 AM", description: "വിശുദ്ധ കുർബാന & മരിയൻ പ്രാർത്ഥന" },
      ],
      mapEmbedUrl: "https://www.google.com/maps?q=8.340649,77.1415017&z=17&output=embed",
    });
    console.log('✓ Church Settings & Mass Timings seeded.');

    // 3. Seed Events (Upcoming & Past)
    await Event.deleteMany({});
    const now = new Date();

    const upcomingDate1 = new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000); // 32 days from now (as on feast poster)
    const upcomingDate2 = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days
    const upcomingDate3 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days
    const pastDate1 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
    const pastDate2 = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000); // 40 days ago

    await Event.insertMany([
      {
        title: "Annual Parish Feast of St. Francis Xavier (ഇടവക തിരുനാൾ മഹോത്സവം)",
        date: upcomingDate1,
        time: "09:30 AM - 01:30 PM",
        venue: "St. Francis Xavier's Church, Neduvila (നെയ്യാറ്റിൻകര ലത്തീൻ രൂപത)",
        description: "സെന്റ് ഫ്രാൻസിസ് സേവ്യർ ചർച്ച് നെടുവില ഇടവക തിരുനാൾ മഹോത്സവം (നെയ്യാറ്റിൻകര ലത്തീൻ രൂപത). കൊടിയേറ്റ്, ആഘോഷമായ തിരുനാൾ പാട്ടുകുർബാന, വചനസന്ദേശം, പ്രസുദേന്തി വാഴ്ച, ഭക്തിസാന്ദ്രമായ പ്രദക്ഷിണം, സ്നേഹവിരുന്ന് എന്നിവയോടെ സമുചിതമായി ആഘോഷിക്കുന്നു. ഏവർക്കും ഹൃദ്യമായ സ്വാഗതം!",
        posterImage: {
          url: "/images/events/parish_feast_poster.jpg",
          public_id: "parish_feast_poster_seed",
        },
      },
      {
        title: "Parish Youth Retreat & Catechism Convention (യുവജന ധ്യാനം)",
        date: upcomingDate2,
        time: "09:00 AM - 04:30 PM",
        venue: "Neduvila Church Auditorium",
        description: "A three-day spiritual seminar focusing on Christian leadership, scripture reflection, and moral formation for Sunday School students and Parish Youth (KCYM).",
        posterImage: {
          url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
          public_id: "seed_youth_retreat",
        },
      },
      {
        title: "Ecumenical Carol Evening & Community Harmony Meet (ക്രിസ്മസ് കരോൾ സന്ധ്യ)",
        date: upcomingDate3,
        time: "06:00 PM - 09:30 PM",
        venue: "Parish Open-Air Stage",
        description: "Joyful evening of sacred choral hymns in Malayalam and English presented by the church choir, followed by Christmas tableau presentation and inter-religious harmony gathering.",
        posterImage: {
          url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80",
          public_id: "seed_carols_poster",
        },
      },
      {
        title: "Medical Camp & Free Health Screening (സൗജന്യ മെഡിക്കൽ ക്യാമ്പ്)",
        date: pastDate1,
        time: "08:30 AM - 01:00 PM",
        venue: "St. Xavier's Parish Hall",
        description: "Comprehensive medical screening organized in partnership with Pushpagiri Medical College, providing free cardiology check-ups, eye screenings, and medicine distribution for elderly parish members.",
        posterImage: {
          url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          public_id: "seed_med_camp",
        },
      },
      {
        title: "Harvest Festival & Parish Food Fair (ഫലശേഖരണ ഉത്സവം)",
        date: pastDate2,
        time: "10:30 AM - 05:00 PM",
        venue: "Church Courtyard, Neduvila",
        description: "Traditional parish auction and home-cooked culinary festival celebrating the bounty of our agricultural harvest with traditional Kerala delicacies.",
        posterImage: {
          url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
          public_id: "seed_harvest_fair",
        },
      },
    ]);
    console.log('✓ Sample Events seeded (upcoming and past).');

    // 4. Seed Notices
    await Notice.deleteMany({});
    const noticeExpiry1 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const noticeExpiry2 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await Notice.insertMany([
      {
        title: "Feast Day Novena Schedule & Special Intentions (തിരുനാൾ നൊവേന സമയക്രമം)",
        message: "The 10-day preparatory Novena for the feast of St. Francis Xavier begins next Friday at 05:00 PM. Ward prayer units (കുടുംബക്കൂട്ടായ്മകൾ) are requested to coordinate their assigned days for liturgy and floral offerings.",
        isPinned: true,
        expiryDate: noticeExpiry1,
      },
      {
        title: "First Holy Communion & Confirmation Registration (ആദ്യകുർബാന രജിസ്ട്രേഷൻ)",
        message: "Registration is open for Class 4 catechism children preparing for First Holy Communion. Parents are requested to submit copies of Baptism certificates at the parish office before the month end.",
        isPinned: true,
        expiryDate: noticeExpiry2,
      },
      {
        title: "Parish Cemetery Beautification & All Souls Remembrance",
        message: "Parishioners are requested to assist in cemetery cleaning and grave maintenance ahead of All Souls Day blessings. Special prayers will be offered for all departed brethren.",
        isPinned: false,
        expiryDate: null,
      },
      {
        title: "Vincent de Paul Society Monthly Grain & Care Collection",
        message: "The parish unit of Society of St. Vincent de Paul will be conducting the monthly food packet collection this Sunday. Generous contributions of rice, pulses, and dry rations are welcomed for needy families.",
        isPinned: false,
        expiryDate: null,
      },
    ]);
    console.log('✓ Sample Notices seeded (pinned and standard).');

    // 5. Seed Gallery
    await Gallery.deleteMany({});
    await Gallery.insertMany([
      {
        image: {
          url: "https://images.unsplash.com/photo-1548625361-195fe578dedf?auto=format&fit=crop&w=1000&q=80",
          public_id: "gallery_altar_01",
        },
        caption: "Main Altar adorned during Sunday Solemn Mass (വിശുദ്ധ ബലിപീഠം)",
        album: "Sanctuary",
      },
      {
        image: {
          url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
          public_id: "gallery_feast_02",
        },
        caption: "Parishioners gathering for the annual St. Francis Xavier procession (തിരുനാൾ പ്രദക്ഷിണം)",
        album: "Feast Celebrations",
      },
      {
        image: {
          url: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1000&q=80",
          public_id: "gallery_choir_03",
        },
        caption: "Parish Choir rehearsing sacred hymns in Malayalam (ദൈവാലയ ഗായകസംഘം)",
        album: "Choir & Music",
      },
      {
        image: {
          url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=80",
          public_id: "gallery_exterior_04",
        },
        caption: "Church facade illuminated against the twilight sky (ദൈവാലയ ദൃശ്യം)",
        album: "Campus",
      },
      {
        image: {
          url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
          public_id: "gallery_communion_05",
        },
        caption: "Solemn First Holy Communion ceremony (ആദ്യകുർബാന സ്വീകരണം)",
        album: "Sacraments",
      },
      {
        image: {
          url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
          public_id: "gallery_youth_06",
        },
        caption: "Parish youth community outreach and distribution of essential kits (യുവജന കാരുണ്യ പ്രവർത്തനം)",
        album: "Charity & Youth",
      },
    ]);
    console.log('✓ Sample Gallery photos seeded.');

    // 6. Seed Japamala (Holy Rosary Structure)
    await Prayer.deleteMany({});
    const japamalaPrayers = [
      {
        type: 'japamala',
        order: 1,
        title: 'Sign of the Cross',
        titleMl: 'കുരിശടയാളം',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 2,
        title: "Apostles' Creed",
        titleMl: 'വിശ്വാസപ്രമാണം',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 3,
        title: 'Our Father',
        titleMl: 'സ്വർഗ്ഗസ്ഥനായ ഞങ്ങളുടെ പിതാവേ',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 4,
        title: 'Three Hail Marys (Faith, Hope, Charity)',
        titleMl: 'മൂന്ന് നന്മനിറഞ്ഞ മറിയമേ (വിശ്വാസം, ശരണം, സ്നേഹം)',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 5,
        title: 'Glory Be',
        titleMl: 'ത്രീത്വസ്തുതി',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 6,
        title: 'Fatima Prayer / O My Jesus',
        titleMl: 'ഓ എന്റെ ഈശോയെ',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 7,
        title: 'Hail Holy Queen / Salve Regina',
        titleMl: 'എത്രയും ദയയുള്ള മാതാവേ / സുകൃതജപം',
        body: 'Admin: add the approved prayer text here',
      },
      {
        type: 'japamala',
        order: 8,
        title: 'Litany of the Blessed Virgin Mary',
        titleMl: 'മാതാവിന്റെ ലുത്തിനിയ',
        body: 'Admin: add the approved prayer text here',
      },
    ];

    // 7. Seed Kurisinte Vazhi (14 Stations of the Cross)
    const stations = [
      {
        type: 'kurisinte-vazhi',
        order: 1,
        title: 'Station 1: Jesus is condemned to death',
        titleMl: 'ഒന്നാം സ്ഥലം: ഈശോമിശിഹാ മരണത്തിന് വിധിക്കപ്പെടുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 2,
        title: 'Station 2: Jesus carries His cross',
        titleMl: 'രണ്ടാം സ്ഥലം: ഈശോമിശിഹാ കുരിശു ചുമക്കുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 3,
        title: 'Station 3: Jesus falls the first time',
        titleMl: 'മൂന്നാം സ്ഥലം: ഈശോമിശിഹാ ഒന്നാം പ്രാവശ്യം വീഴുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 4,
        title: 'Station 4: Jesus meets His mother',
        titleMl: 'നാലാം സ്ഥലം: ഈശോമിശിഹാ വഴിയിൽവച്ചു തന്റെ മാതാവിനെ കാണുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 5,
        title: 'Station 5: Simon of Cyrene helps Jesus',
        titleMl: 'അഞ്ചാം സ്ഥലം: ശിമയോൻ ഈശോയെ സഹായിക്കുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 6,
        title: 'Station 6: Veronica wipes the face of Jesus',
        titleMl: 'ആറാം സ്ഥലം: വേറോനിക്ക ഈശോയുടെ മുഖം തുടയ്ക്കുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe578dedf?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 7,
        title: 'Station 7: Jesus falls the second time',
        titleMl: 'ഏഴാം സ്ഥലം: ഈശോമിശിഹാ രണ്ടാം പ്രാവശ്യം വീഴുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 8,
        title: 'Station 8: Jesus meets the women of Jerusalem',
        titleMl: 'എട്ടാം സ്ഥലം: ഈശോ യെരുശലേം നഗരിയിലെ സ്ത്രീകളെ ആശ്വസിപ്പിക്കുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 9,
        title: 'Station 9: Jesus falls the third time',
        titleMl: 'ഒൻപതാം സ്ഥലം: ഈശോമിശിഹാ മൂന്നാം പ്രാവശ്യം വീഴുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 10,
        title: 'Station 10: Jesus is stripped of His garments',
        titleMl: 'പത്താം സ്ഥലം: ഈശോയുടെ വസ്ത്രങ്ങൾ ഉരിയപ്പെടുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 11,
        title: 'Station 11: Jesus is nailed to the cross',
        titleMl: 'പതിനൊന്നാം സ്ഥലം: ഈശോ കുരിശിൽ തറയ്ക്കപ്പെടുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 12,
        title: 'Station 12: Jesus dies on the cross',
        titleMl: 'പന്ത്രണ്ടാം സ്ഥലം: ഈശോ കുരിശിൽ മരിക്കുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 13,
        title: 'Station 13: Jesus is taken down from the cross',
        titleMl: 'പതിമൂന്നാം സ്ഥലം: ഈശോയുടെ തിരുശരീരം കുരിശിൽ നിന്നിറക്കി മാതാവിന്റെ മടിയിൽ കിടത്തുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      },
      {
        type: 'kurisinte-vazhi',
        order: 14,
        title: 'Station 14: Jesus is laid in the tomb',
        titleMl: 'പതിനാലാം സ്ഥലം: ഈശോയുടെ തിരുശരീരം കല്ലറയിൽ അടക്കുന്നു',
        body: 'Admin: add the approved prayer text here',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      },
    ];

    await Prayer.insertMany([...japamalaPrayers, ...stations]);
    console.log('✓ Seeded Japamala & Kurisinte Vazhi structures.');

    // 8. Seed Timings
    await Timing.deleteMany({});
    await Timing.insertMany([
      {
        type: 'japamala',
        text: 'Daily parish community Rosary at 06:00 PM before evening prayers (പ്രതിദിന സമൂഹ ജപമാല വൈകുന്നേരം 06:00 മണിക്ക്).',
      },
      {
        type: 'kurisinte-vazhi',
        text: 'Every Friday during Great Lent (വലിയ നോമ്പിലെ എല്ലാ വെള്ളിയാഴ്ചകളിലും) at 04:30 PM followed by Holy Mass & Adoration.',
      },
    ]);
    console.log('✓ Seeded Japamala & Kurisinte Vazhi parish timings.');

    console.log('--- Database seeding completed successfully! ---');
    if (require.main === module) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding error:', error);
    if (require.main === module) {
      await disconnectDB();
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;

