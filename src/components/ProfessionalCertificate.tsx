import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, Download, ShieldCheck, CheckCircle2, User as UserIcon, Calendar, BookOpen } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CourseCertificate } from '../types';

interface ProfessionalCertificateProps {
  certificate: CourseCertificate;
  isDarkMode: boolean;
  onDownload?: () => void;
}

export default function ProfessionalCertificate({ certificate, isDarkMode, onDownload }: ProfessionalCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      const element = certificateRef.current;
      // Wait for font loading and any potential transitions
      await document.fonts.ready;
      
      // Add a small delay to ensure all nested elements (like the ID block) are rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 1100,
        height: 778,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate="true"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '1100px';
            clonedElement.style.height = '778px';
            clonedElement.style.color = '#0f172a';
            clonedElement.style.backgroundColor = '#ffffff';

            const idBlock = clonedElement.querySelector('.id-block') as HTMLElement;
            if (idBlock) {
              idBlock.style.backgroundColor = '#0f172a';
              idBlock.style.border = '1px solid #D4AF37';
              idBlock.style.display = 'inline-block';
              idBlock.style.visibility = 'visible';
              idBlock.style.opacity = '1';
              
              // Direct style reinforcement for children
              const children = idBlock.querySelectorAll('p');
              if (children[0]) children[0].style.color = '#D4AF37';
              if (children[1]) children[1].style.color = '#ffffff';
            }

            // Recursively clean up any oklch variables or shadow classes
            const allNodes = clonedElement.querySelectorAll('*');
            allNodes.forEach((node) => {
              const el = node as HTMLElement;
              if (el.style) {
                el.style.boxShadow = 'none';
              }
            });
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Webnixo-Certificate-${certificate.code}.pdf`);
      if (onDownload) onDownload();
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try "Save as Image" or check your browser permissions.');
    }
  };

  const downloadAsImage = async () => {
    if (!certificateRef.current) return;
    
    try {
      const element = certificateRef.current;
      await document.fonts.ready;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 1100,
        height: 778,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate="true"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '1100px';
            clonedElement.style.height = '778px';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `Webnixo-Certificate-${certificate.code}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (onDownload) onDownload();
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Scrollable Container to prevent clipping on mobile */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <div className="inline-block min-w-full">
          <div className="relative group overflow-hidden rounded-[32px] shadow-2xl" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div 
              ref={certificateRef}
              data-certificate="true"
              className="aspect-[1.414/1] p-20 relative overflow-hidden font-sans"
              style={{ 
                width: '1100px', 
                minHeight: '778px', 
                color: '#0f172a', 
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }} 
            >
              {/* Ornate Border Design */}
              <div className="absolute inset-0 border-[40px]" style={{ borderColor: '#0f172a' }} />
              <div className="absolute inset-2 border-[4px]" style={{ borderColor: '#D4AF37' }} />
              <div className="absolute inset-6 border-[1px]" style={{ borderColor: '#1e293b' }} />
              <div className="absolute inset-10 border-[1px]" style={{ borderColor: '#e2e8f0' }} />
              
              {/* Elegant Corner Motifs */}
              <div className="absolute top-0 left-0 w-48 h-48 border-t-[15px] border-l-[15px] rounded-tl-[40px]" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }} />
              <div className="absolute top-0 right-0 w-48 h-48 border-t-[15px] border-r-[15px] rounded-tr-[40px]" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 border-b-[15px] border-l-[15px] rounded-bl-[40px]" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }} />
              <div className="absolute bottom-0 right-0 w-48 h-48 border-b-[15px] border-r-[15px] rounded-br-[40px]" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }} />

              {/* Background Watermark Pattern */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-35deg] select-none" style={{ opacity: 0.05 }}>
                <div className="grid grid-cols-3 gap-x-32 gap-y-24">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="text-3xl font-black whitespace-nowrap tracking-widest font-cinzel">
                      WEBNIXO ACADEMY
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none" 
                   style={{ 
                     opacity: 0.04,
                     backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`, 
                     backgroundSize: '24px 24px' 
                   }} />

              <div className="relative z-10 h-full flex flex-col items-center justify-between py-10">
                {/* Header Section */}
                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h1 className="text-sm font-extrabold uppercase tracking-[0.8em] font-cinzel" style={{ color: '#64748b' }}>Academic Completion</h1>
                    <h2 className="text-7xl font-cinzel font-bold tracking-[0.2em]" style={{ color: '#0f172a', marginTop: '1rem', marginBottom: '1.5rem' }}>CERTIFICATE</h2>
                  </div>
                  <div className="w-60 h-0.5 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
                </div>

                {/* Content Section */}
                <div className="text-center flex-grow flex flex-col justify-center max-w-4xl" style={{ gap: '2.5rem' }}>
                  <p className="text-2xl font-serif italic" style={{ color: '#64748b' }}>This prestigious award is presented to</p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 className="text-7xl font-serif font-bold underline underline-offset-8" style={{ color: '#0f172a', textDecorationColor: 'rgba(212, 175, 55, 0.3)', textDecorationThickness: '8px' }}>
                      {certificate.studentName.toUpperCase()}
                    </h2>
                  </div>

                  <div style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                    <p className="text-xl leading-relaxed font-serif italic" style={{ color: '#475569' }}>
                      In recognition of the successful completion and mastery of the course requirements for
                    </p>
                    <h3 className="text-4xl font-extrabold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                      {certificate.courseName}
                    </h3>
                  </div>
                </div>

                {/* High-End Footer */}
                <div className="w-full grid grid-cols-3 items-end px-16 pb-4">
                  <div className="text-center" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                    <div className="space-y-1">
                      <p className="font-mono text-sm font-bold tracking-tighter" style={{ color: '#0f172a' }}>
                        {certificate.date}
                      </p>
                      <div className="h-px w-36 mx-auto" style={{ backgroundColor: '#cbd5e1' }} />
                      <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: '#94a3b8' }}>Date of Issue</p>
                    </div>
                  </div>

                  {/* Highlighted Serial & Website URL */}
                  <div className="text-center" style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                    <div className="id-block px-6 py-3 rounded-lg inline-block" style={{ backgroundColor: '#0f172a', border: '1px solid #D4AF37' }}>
                      <p className="text-[10px] uppercase font-black tracking-widest mb-1" style={{ color: '#D4AF37', opacity: 0.7 }}>Certificate ID</p>
                      <p className="font-mono text-sm font-bold text-white tracking-[0.2em]">{certificate.code}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: '#0f172a' }}>Verified at</p>
                      <p className="text-xs font-bold tracking-widest" style={{ color: '#3b82f6' }}>learn.webnixo.in</p>
                    </div>
                  </div>

                  <div className="text-center" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                    <div className="space-y-1">
                      <div className="h-16 flex items-center justify-center">
                         <p className="font-serif font-bold italic text-3xl tracking-tighter" style={{ color: '#0f172a', opacity: 0.9 }}>Shivanagouda Patil</p>
                      </div>
                      <div className="h-px w-48 mx-auto" style={{ backgroundColor: '#cbd5e1' }} />
                      <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: '#94a3b8' }}>Director of Education</p>
                    </div>
                    <div className="pt-4">
                       <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#2563eb', opacity: 0.5 }}>WEBNIXO ACADEMY GLOBAL</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-10 -right-20 w-40 h-80 rotate-[45deg] blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
              <div className="absolute -bottom-10 -left-20 w-40 h-80 rotate-[45deg] blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Download Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-8">
        <button 
          onClick={downloadAsPDF}
          className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          Download PDF
        </button>
        <button 
          onClick={downloadAsImage}
          className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all group"
        >
          <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
            <Download className="w-5 h-5" />
          </div>
          Save as Image
        </button>
      </div>
    </div>
  );
}
