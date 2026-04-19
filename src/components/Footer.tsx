import React from 'react';
import { Code2, Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-bg-main border-t border-border-card pt-20 pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Code2 className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Webnixo <span className="text-brand-primary">Academy</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Empowering the next generation of developers with industry-standard tech skills and real-world projects.
            </p>
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-brand-primary transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['About Us', 'Courses', 'Instructor', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-text-muted text-sm hover:text-brand-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => onNavigate?.('admin-login')}
                  className="text-text-muted text-sm hover:text-brand-primary transition-colors"
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              {[
                { label: 'Contact Us', action: () => (window.location.href = 'mailto:support@webnixo.com') },
                { label: 'Privacy Policy', action: () => onNavigate?.('privacy') },
                { label: 'Terms of Service', action: () => onNavigate?.('terms') },
                { label: 'Refund Policy', action: () => onNavigate?.('refund') },
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={item.action}
                    className="text-text-muted text-sm hover:text-brand-primary transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-text-muted text-sm">
                <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                <span>support@webnixo.com</span>
              </li>
              <li className="flex items-start gap-3 text-text-muted text-sm">
                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-text-muted text-sm">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                <span>Hubli, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} Webnixo Academy | Founded by <span className="text-text-main font-bold">SHIVANAGOUDA PATIL</span>
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate?.('privacy')} className="text-text-muted text-xs hover:text-brand-primary transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate?.('terms')} className="text-text-muted text-xs hover:text-brand-primary transition-colors">Terms of Service</button>
            <button onClick={() => onNavigate?.('refund')} className="text-text-muted text-xs hover:text-brand-primary transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full" />
    </footer>
  );
}
