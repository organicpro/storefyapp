import React, { useState } from 'react';
import { Play, Info, ChevronRight, PlayCircle, Lock } from 'lucide-react';

interface VideoInfo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

const featuredVideo = {
  title: 'Dominando a Storefy do Zero',
  description: 'Aprenda tudo o que você precisa para configurar sua loja, adicionar produtos e começar a vender no automático usando o poder da nossa plataforma.',
  thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop',
};

const categories = [
  {
    title: 'Começando do zero',
    videos: [
      { id: 'v1', title: 'Como criar sua primeira loja', duration: '5:20', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop' },
      { id: 'v2', title: 'Entendendo o Dashboard', duration: '4:15', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop' },
      { id: 'v3', title: 'Configurando seu domínio', duration: '6:30', thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop' },
      { id: 'v4', title: 'Personalizando as cores', duration: '3:45', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop' },
    ]
  },
  {
    title: 'Estratégias Avançadas',
    videos: [
      { id: 'v5', title: 'Integração com WhatsApp', duration: '8:10', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop' },
      { id: 'v6', title: 'Kits e Combos de Venda', duration: '7:50', thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop' },
      { id: 'v7', title: 'Recuperação de carrinho', duration: '9:15', thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=600&auto=format&fit=crop' },
      { id: 'v8', title: 'Otimização de conversão', duration: '12:00', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop' },
    ]
  }
];

export default function Academy() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] text-gray-900 pb-20 page-transition font-sans">
      
      {/* Locked Overlay */}
      <div className="absolute inset-0 z-50 flex flex-col items-center pt-[20vh] bg-white/40 backdrop-blur-md">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center max-w-sm text-center">
          <div className="w-16 h-16 bg-[#f4edd9] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Lock className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Em Breve</h2>
          <p className="text-gray-500 font-medium">A Academy será lançada em breve com conteúdos exclusivos para alavancar suas vendas.</p>
        </div>
      </div>

      {/* Netflix-style Hero Section but light and elegant */}
      <div className="relative w-full h-[65vh] min-h-[500px] overflow-hidden rounded-b-[40px] shadow-sm mb-12 border-b border-gray-200/50">
        <div className="absolute inset-0 bg-gray-100">
          <img 
            src={featuredVideo.thumbnail} 
            alt="Featured" 
            className="w-full h-full object-cover opacity-90 object-top"
          />
        </div>
        {/* Soft elegant gradient instead of harsh black */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 p-12 md:p-16 lg:p-24 max-w-3xl z-10">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20 backdrop-blur-md">
            Conteúdo Exclusivo
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-none">
            {featuredVideo.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
            {featuredVideo.description}
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-gray-900/20 cursor-pointer">
              <Play className="w-5 h-5 fill-current" /> Assistir Agora
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/60 backdrop-blur-md text-gray-900 rounded-xl font-bold text-lg border border-gray-200 transition-transform hover:scale-105 hover:bg-white shadow-sm cursor-pointer">
              <Info className="w-5 h-5" /> Mais Informações
            </button>
          </div>
        </div>
      </div>

      {/* Video Rows */}
      <div className="px-8 md:px-12 lg:px-16 space-y-12">
        {categories.map((category, idx) => (
          <div key={idx} className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                {category.title}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 -mx-8 px-8 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
              `}} />
              {category.videos.map((video) => (
                <div 
                  key={video.id} 
                  className="relative group min-w-[280px] md:min-w-[320px] aspect-video rounded-2xl overflow-hidden bg-gray-100 cursor-pointer snap-start shrink-0 border border-gray-200/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle dark gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-80" />
                  
                  {/* Play icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-[2px]">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-75 text-gray-900">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{video.title}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                      <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">Aula</span>
                      <span>•</span>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


