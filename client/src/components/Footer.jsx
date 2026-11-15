import React from 'react';
import { MapPin, Phone, Mail, Clock, Heart, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_CONFIG } from '../config/church';

const Footer = () => {
  return (
    <footer className="bg-cream-200/80 border-t border-cream-300 text-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Parish Info */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="/logo.png"
                alt="St. Francis Xavier Logo"
                className="w-11 h-11 rounded-full object-cover shadow-sm border border-gold-400"
              />
              <h3 className="font-heading font-semibold text-lg text-slate-900">
                St. Francis Xavier's Church
              </h3>
            </div>
            <p className="font-ml text-sm text-gold-700 font-medium mb-3">
              {CHURCH_CONFIG.nameMalayalam}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              A community of faith, communion, and charity rooted in Christ and inspired by the missionary spirit of St. Francis Xavier.
            </p>
            <div className="flex items-center text-xs text-slate-500">
              <span>{CHURCH_CONFIG.archdiocese} • Kerala, India</span>
            </div>
          </div>

          {/* Column 2: Quick Links & Mass Times */}
          <div>
            <h4 className="font-heading font-semibold text-base text-slate-900 mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gold-500" />
              Regular Mass Timings
            </h4>
            <ul className="text-sm space-y-2 text-slate-600">
              <li className="flex justify-between border-b border-cream-300/50 pb-1.5">
                <span className="font-medium">Sunday</span>
                <span className="text-slate-900">06:30 AM & 09:30 AM</span>
              </li>
              <li className="flex justify-between border-b border-cream-300/50 pb-1.5">
                <span className="font-medium">Mon - Thu</span>
                <span className="text-slate-900">06:30 AM</span>
              </li>
              <li className="flex justify-between border-b border-cream-300/50 pb-1.5">
                <span className="font-medium">Friday</span>
                <span className="text-slate-900">06:30 AM & 05:00 PM</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span className="font-medium">Saturday</span>
                <span className="text-slate-900">06:45 AM</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Church Map */}
          <div>
            <h4 className="font-heading font-semibold text-base text-slate-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gold-500" />
              Location & Parish Office
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              {CHURCH_CONFIG.address}
            </p>
            <div className="w-full h-32 rounded-xl overflow-hidden border border-cream-300 mb-3 shadow-xs">
              <iframe
                src={CHURCH_CONFIG.map.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={CHURCH_CONFIG.map.title}
                className="w-full h-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <a
                href={CHURCH_CONFIG.map.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gold-700 hover:text-gold-800 font-semibold"
              >
                <Navigation className="w-3.5 h-3.5 mr-1" />
                Get Directions
              </a>
              <span className="text-slate-400">Lat: 8.3406°, Lng: 77.1415°</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Notice the Admin link is strictly omitted as required */}
        <div className="border-t border-cream-300 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} St. Francis Xavier's Church, Neduvila. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Peace and Grace to all who visit <Heart className="w-3.5 h-3.5 ml-1 text-gold-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

