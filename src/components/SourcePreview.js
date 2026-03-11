"use client";
import React, { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
    Maximize,
    RotateCw,
    RotateCcw,
    FlipHorizontal,
    Target,
    Focus,
    BoxSelect,
    Scan,
    Monitor,
    Target as TargetCenter,
    LayoutTemplate,
    Layers,
    Cpu,
    Heart,
    MessageCircle,
    Send,
    MoreVertical,
    Play,
    User,
    Chrome,
    ArrowLeft,
    Share
} from "lucide-react";
import { useToolState } from "@/hooks/useToolState";

export default function SourcePreview() {
    const { uploadedFiles, settings, setSettings } = useToolState();
    const imgRef = useRef(null);
    const cropperRef = useRef(null);
    const [activeRatio, setActiveRatio] = useState('ORG');
    const [isImageReady, setIsImageReady] = useState(false);

    const primaryFile = uploadedFiles[settings.primaryAssetIndex] || uploadedFiles.find(f => f.type === 'image');

    useEffect(() => {
        setIsImageReady(false);
        if (!primaryFile || !imgRef.current) return;

        const initCropper = () => {
            if (cropperRef.current) {
                cropperRef.current.destroy();
            }

            cropperRef.current = new Cropper(imgRef.current, {
                viewMode: 2,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                background: false,
                zoomable: true,
                ready() {
                    setIsImageReady(true);
                },
                crop(event) {
                    setSettings(prev => ({
                        ...prev,
                        crop: {
                            x: Math.round(event.detail.x),
                            y: Math.round(event.detail.y),
                            w: Math.round(event.detail.width),
                            h: Math.round(event.detail.height)
                        }
                    }));
                }
            });
        };

        const img = imgRef.current;
        if (img.complete) {
            initCropper();
        } else {
            img.onload = initCropper;
        }

        return () => {
            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }
            if (img) img.onload = null;
        };
    }, [primaryFile]);

    const applyRatio = (label, ratio) => {
        setActiveRatio(label);
        if (cropperRef.current) {
            cropperRef.current.setAspectRatio(ratio);
        }
    };

    const rotate = (deg) => {
        if (cropperRef.current) cropperRef.current.rotate(deg);
    };

    const flipX = () => {
        if (cropperRef.current) {
            const data = cropperRef.current.getData();
            cropperRef.current.scaleX(data.scaleX === 1 ? -1 : 1);
        }
    };

    if (!primaryFile) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 select-none animate-up relative overflow-hidden bg-background">
                {/* Subtle Central Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* High Precision Asset Slot */}
                    <div className="w-72 h-72 rounded-lg bg-white/[0.01] border border-white/[0.03] flex items-center justify-center mb-16 relative group transition-all duration-700">
                        {/* Static Guides */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-sm"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-sm"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-sm"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 rounded-br-sm"></div>

                        {/* Thin Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>

                        {/* Central Functional Focus */}
                        <div className="relative flex flex-col items-center gap-6">
                            <LayoutTemplate className="w-10 h-10 text-white/[0.05] group-hover:text-white/10 transition-all duration-700" />
                            <div className="flex items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                                <div className="w-1 h-1 rounded-full bg-white"></div>
                                <div className="w-1 h-1 rounded-full bg-white"></div>
                                <div className="w-1 h-1 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Hover Focus Effect */}
                        <div className="absolute inset-0 border border-accent-gold/0 group-hover:border-accent-gold/10 transition-colors duration-700 pointer-events-none rounded-lg"></div>
                    </div>

                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-[0.85rem] font-black tracking-[0.5em] text-white/90 uppercase font-display leading-tight">Studio Engine</h3>
                            <div className="h-[1px] w-6 bg-accent-gold mx-auto opacity-30"></div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[0.6rem] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed">
                                Ready for asset import
                            </p>
                            <p className="text-[0.5rem] font-bold text-white/10 uppercase tracking-[0.2em]">
                                Multi-Format • Batch Ready • High Precision
                            </p>
                        </div>
                    </div>

                    {/* Module Status Indicators */}
                    <div className="mt-20 flex items-center gap-8 py-4 px-8 rounded-full bg-white/[0.01] border border-white/[0.03] backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <Scan className="w-3 h-3 text-accent-gold/30" />
                            <span className="text-[0.5rem] font-black text-white/10 uppercase tracking-widest">Resizer</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/5"></div>
                        <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-accent-mint/30" />
                            <span className="text-[0.5rem] font-black text-white/10 uppercase tracking-widest">AI Engine</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/5"></div>
                        <div className="flex items-center gap-2">
                            <Layers className="w-3 h-3 text-accent-purple/30" />
                            <span className="text-[0.5rem] font-black text-white/10 uppercase tracking-widest">Presets</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const mockup = settings.activePresetId ? (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center">
            {settings.activePresetId.startsWith('ig') && (
                <div className="w-full h-full flex flex-col pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <span className="text-[0.7rem] font-bold text-white shadow-sm">studio_engine</span>
                        </div>
                        <MoreVertical className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                        {settings.activePresetId === 'ig_story' ? (
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-9 rounded-full border border-white/40 flex items-center px-4">
                                    <span className="text-[0.65rem] text-white/60">Send message</span>
                                </div>
                                <Heart className="w-6 h-6 text-white" />
                                <Send className="w-6 h-6 text-white" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Heart className="w-6 h-6 text-white" />
                                    <MessageCircle className="w-6 h-6 text-white" />
                                    <Send className="w-6 h-6 text-white" />
                                </div>
                                <div className="h-1.5 w-32 bg-white/20 rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {settings.activePresetId === 'fb_post' && (
                <div className="absolute inset-0 bg-transparent flex flex-col p-4 pointer-events-none">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center border border-white/20">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[0.7rem] font-bold text-white leading-tight">Studio Engine</span>
                            <span className="text-[0.55rem] text-white/40 font-bold uppercase tracking-tighter">Sponsored • Just now</span>
                        </div>
                    </div>
                </div>
            )}
            {(settings.activePresetId === 'tw_post' || settings.activePresetId === 'linkedin_post') && (
                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-2xl">
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-[0.6rem] font-black text-white/80 uppercase tracking-widest">{settings.activePresetId === 'tw_post' ? 'X / Post' : 'LinkedIn'}</span>
                </div>
            )}
            {settings.activePresetId === 'yt_thumb' && (
                <div className="absolute bottom-6 right-6 px-2 py-0.5 bg-black/90 text-white text-[0.65rem] font-bold rounded">
                    14:02
                </div>
            )}
            {(settings.activePresetId === 'passport' || settings.activePresetId === 'visa') && (
                <div className="absolute inset-0 border-[30px] border-white/[0.03] pointer-events-none">
                    <div className="absolute top-8 left-8 p-3 border border-dashed border-white/20 rounded-lg bg-black/40 backdrop-blur-sm">
                        <span className="text-[0.5rem] font-black text-white/40 uppercase tracking-widest">Biometric Zone</span>
                    </div>
                    <div className="absolute inset-x-20 inset-y-10 border border-white/10 rounded-[20%] opacity-20 bg-gradient-to-b from-white/10 to-transparent"></div>
                </div>
            )}
            {settings.activePresetId === 'id_card' && (
                <div className="absolute inset-0 p-8 flex border-[20px] border-white/5">
                    <div className="w-1/3 aspect-[3/4] border-2 border-white/10 rounded-lg bg-white/5 flex items-center justify-center relative overflow-hidden">
                        <User className="w-12 h-12 text-white/10" />
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-accent-gold/40"></div>
                    </div>
                    <div className="ml-8 space-y-4 flex-1 pt-4">
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                        <div className="h-2 w-48 bg-white/5 rounded"></div>
                        <div className="h-2 w-40 bg-white/5 rounded"></div>
                    </div>
                </div>
            )}
        </div>
    ) : null;

    return (
        <div className="flex-1 w-full flex flex-col relative animate-up h-full select-none p-5">
            <div className={`absolute top-8 left-5 right-5 z-50 flex flex-nowrap items-center justify-between transition-all duration-500 ${isImageReady ? 'opacity-100' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="bg-black/90 backdrop-blur-md border border-white/15 p-1.5 flex gap-1 items-center shadow-2xl rounded-2xl h-[52px]">
                    <div className="flex items-center px-4 border-r border-white/10 mr-1 gap-3 shrink-0 h-full min-w-[125px]">
                        <BoxSelect className="w-4 h-4 text-accent-gold" />
                        <span className="text-[0.65rem] font-bold tracking-[0.2em] text-white/50 uppercase font-display leading-none mt-0.5">Ratio</span>
                    </div>
                    <div className="flex items-center gap-1.5 h-full">
                        {[
                            { label: 'ORG', ratio: NaN },
                            { label: '1:1', ratio: 1 / 1 },
                            { label: '4:5', ratio: 4 / 5 },
                            { label: '16:9', ratio: 16 / 9 }
                        ].map(r => (
                            <button
                                key={r.label}
                                onClick={() => applyRatio(r.label, r.ratio)}
                                className={`px-4 h-[36px] flex items-center text-[0.65rem] font-black rounded-xl transition-all duration-300 ${activeRatio === r.label ? 'bg-accent-gold text-black shadow-lg shadow-black/40' : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-black/90 backdrop-blur-md border border-white/15 p-1.5 flex gap-1 items-center shadow-2xl rounded-2xl h-[52px]">
                    <div className="flex items-center px-4 border-r border-white/10 mr-1 gap-3 shrink-0 h-full min-w-[80px] justify-center">
                        <Scan className="w-4 h-4 text-accent-mint" />
                    </div>
                    <div className="flex items-center gap-1.5 h-full">
                        <button onClick={() => rotate(-90)} className="w-[40px] h-[36px] rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all text-white/40 hover:text-white">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={() => rotate(90)} className="w-[40px] h-[36px] rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all text-white/40 hover:text-white">
                            <RotateCw className="w-4 h-4" />
                        </button>
                        <button onClick={flipX} className="w-[40px] h-[36px] rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all text-white/40 hover:text-white">
                            <FlipHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full relative group overflow-hidden bg-background ring-1 ring-white/10 shadow-2xl rounded-2xl mt-20 mb-4 border border-white/5">
                <div className="absolute inset-0 stage-grid opacity-30 pointer-events-none"></div>

                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <img
                        ref={imgRef}
                        src={primaryFile.previewUrl}
                        alt="Studio Stage"
                        crossOrigin="anonymous"
                        className="max-h-full max-w-full opacity-0"
                    />
                </div>
                {mockup}
                <div className={`absolute bottom-8 right-8 pointer-events-none flex items-center gap-4 bg-black/80 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${isImageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex flex-col items-end">
                        <span className="text-[0.6rem] font-bold opacity-60 uppercase tracking-[0.15em] text-white">Coords</span>
                        <span className="text-[0.8rem] font-bold tracking-tighter text-white font-mono leading-none mt-2">{Math.round(settings.crop?.x || 0)}, {Math.round(settings.crop?.y || 0)} <span className="text-[0.6rem] opacity-40 font-sans font-black uppercase">px</span></span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center border border-white/10">
                        <Focus className="w-4 h-4 text-accent-gold" />
                    </div>
                </div>
            </div>
        </div>
    );
}
