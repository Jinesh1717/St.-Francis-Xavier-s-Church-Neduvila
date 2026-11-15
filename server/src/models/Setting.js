const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    churchName: {
      type: String,
      default: "St. Francis Xavier's Church, Neduvila",
    },
    churchNameMalayalam: {
      type: String,
      default: "വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം, നെടുവില",
    },
    address: {
      type: String,
      default: "Neduvila, Alappuzha / Kottayam District, Kerala, India - 688531",
    },
    phone: {
      type: String,
      default: "+91 94470 12345 / 0477 2291234",
    },
    email: {
      type: String,
      default: "parish@stfrancisneduvila.org",
    },
    historyText: {
      type: String,
      default: "St. Francis Xavier's Church, Neduvila has been a beacon of faith, hope, and charity for generations. Established under the Archdiocese, our parish family gathers in prayer and communion, dedicated to the patron saint of missionaries, St. Francis Xavier. We are devoted to pastoral care, catechism, community outreach, and spiritual renewal.",
    },
    historyTextMalayalam: {
      type: String,
      default: "തലമുറകളായി വിശ്വാസത്തിന്റെയും സ്നേഹത്തിന്റെയും ദീപസ്തംഭമായി നെടുവില വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം നിലകൊള്ളുന്നു. വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യറുടെ മധ്യസ്ഥതയിൽ സ്ഥാപിതമായ ഈ ഇടവക കൂട്ടായ്മ പ്രാർത്ഥനയിലും കാരുണ്യപ്രവർത്തനങ്ങളിലും സജീവമാണ്.",
    },
    massTimings: [
      {
        day: { type: String, required: true },
        time: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    mapEmbedUrl: {
      type: String,
      default: "https://www.google.com/maps?q=8.340649,77.1415017&z=17&output=embed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);

