"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    Maximize2,
    Minimize2,
    MoveHorizontal,
    Palette,
    Cpu,
    LayoutGrid,
    Laptop,
    Sliders,
    Pipette,
    CircleSlash
} from "lucide-react";
import { useToolState } from "@/hooks/useToolState";
import { IMAGE_PRESETS } from "@/lib/constants";
import UploadZone from "@/components/UploadZone";
import SourcePreview from "@/components/SourcePreview";

export default function ToolInterface({ tool }) {
    const { settings, setSettings, isProcessing, uploadedFiles } = useToolState();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const updateSetting = (key, val) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    const isBgProcessing = tool === 'bg-remove' || settings.bgRemove;

    // --- RENDER SETTINGS (Left Panel) ---
    const settingsPanel = (
        <div className="flex flex-col gap-10 animate-up">
            <UploadZone />

            <div className="space-y-8">
                <div className="flex items-center gap-3 px-1">
                    <Sliders className="w-4 h-4 accent-rose stroke-[2.5px]" />
                    <label className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-white/60 heading-serif">Configuration</label>
                </div>

                {(tool === 'resizer' || tool === 'social') && (
                    <div className="space-y-8">
                        <div className="flex bg-card-dark p-1.5 rounded-xl border border-white/10 shadow-inner">
                            <button
                                onClick={() => {
                                    updateSetting('modeType', 'custom');
                                    updateSetting('activePresetId', null);
                                }}
                                className={`flex-1 py-3 text-[0.7rem] font-black rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 ${settings.modeType !== 'presets' ? 'bg-accent-gold text-black shadow-lg shadow-black/40' : 'text-white/40 hover:text-white/80 uppercase tracking-widest'}`}
                            >
                                <Laptop className="w-4 h-4" />
                                Custom
                            </button>
                            <button
                                onClick={() => updateSetting('modeType', 'presets')}
                                className={`flex-1 py-3 text-[0.7rem] font-black rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 ${settings.modeType === 'presets' ? 'bg-accent-gold text-black shadow-lg shadow-black/40' : 'text-white/40 hover:text-white/80 uppercase tracking-widest'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Presets
                            </button>
                        </div>

                        {settings.modeType === 'presets' ? (
                            <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                {IMAGE_PRESETS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            updateSetting('width', p.width);
                                            updateSetting('height', p.height);
                                            updateSetting('fitMode', p.mode);
                                            updateSetting('activePresetId', p.id);
                                        }}
                                        className={`group px-4 py-3.5 rounded-xl border-2 transition-all duration-300 text-left ${settings.width === p.width && settings.height === p.height ? 'bg-white/5 border-[#ece7e1]/40 text-white shadow-xl' : 'bg-transparent border-white/5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 hover:border-white/10'}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <span className="text-[0.75rem] font-bold uppercase tracking-tight truncate">{p.label}</span>
                                                <span className="font-mono text-[0.65rem] tracking-tighter uppercase opacity-50">{p.width} × {p.height} PX</span>
                                            </div>
                                            {settings.width === p.width && settings.height === p.height && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-accent-gold shadow-lg shadow-accent-gold/40 animate-pulse"></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 px-1">
                                <div className="space-y-3">
                                    <label className="text-[0.65rem] font-bold opacity-60 uppercase tracking-[0.15em] ml-1 text-white">Target Width</label>
                                    <input type="number" value={settings.width} onChange={(e) => updateSetting('width', e.target.value)} className="studio-input" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[0.65rem] font-bold opacity-60 uppercase tracking-[0.15em] ml-1 text-white">Target Height</label>
                                    <input type="number" value={settings.height} onChange={(e) => updateSetting('height', e.target.value)} className="studio-input" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-5 pt-8 border-t border-white/10">
                            <label className="text-[0.65rem] font-bold opacity-60 uppercase tracking-[0.15em] ml-1 text-white">Scaling Protocol</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'cover', icon: Maximize2 },
                                    { label: 'contain', icon: Minimize2 },
                                    { label: 'stretch', icon: MoveHorizontal }
                                ].map(m => (
                                    <button
                                        key={m.label}
                                        onClick={() => updateSetting('fitMode', m.label)}
                                        className={`py-3.5 text-[0.65rem] font-black rounded-xl border transition-all duration-300 uppercase tracking-widest flex flex-col items-center gap-3 ${settings.fitMode === m.label ? 'bg-accent-gold text-black shadow-lg' : 'bg-white/[0.04] border-white/5 text-white/40 hover:bg-white/[0.08] hover:text-white'}`}
                                    >
                                        <m.icon className="w-4 h-4 stroke-[2.5px]" />
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ENVIRONMENT SETTINGS */}
                {isBgProcessing && (
                    <div className="space-y-8 pt-8 border-t border-white/5 animate-up">
                        <div className="flex items-center gap-3 px-1">
                            <Palette className="w-4 h-4 accent-gold stroke-[2.5px]" />
                            <label className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-white/50 heading-serif italic">Environment</label>
                        </div>

                        <div className="grid grid-cols-4 gap-3 px-1 pb-4">
                            {[
                                { id: 'transparent', label: 'VOID', class: 'bg-[#0a0a0a] relative overflow-hidden', icon: <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#333_1px,transparent_1px)] bg-[length:6px_6px]"><CircleSlash className="w-5 h-5 text-zinc-600 opacity-80" /></div> },
                                { id: 'white', label: 'PURE', class: 'bg-white' },
                                { id: 'black', label: 'DARK', class: 'bg-black' },
                                { id: '#ece7e1', label: 'CREAM', class: 'bg-[#ece7e1]' }
                            ].map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => updateSetting('bgFill', c.id)}
                                    className={`aspect-square rounded-xl border-2 transition-all duration-300 relative group shadow-xl p-0.5 ${settings.bgFill === c.id ? 'border-accent-gold scale-105' : 'border-white/10 hover:border-white/30'}`}
                                >
                                    <div className={`w-full h-full rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-95 ${c.class}`}>
                                        {c.icon}
                                    </div>
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[0.45rem] font-black tracking-widest text-white/30 uppercase group-hover:text-white/60 transition-colors">{c.label}</span>
                                    {settings.bgFill === c.id && <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-accent-gold shadow-xl border border-black flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-black"></div></div>}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 px-1 pt-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[0.65rem] font-black opacity-60 uppercase tracking-[0.15em] block text-white">Custom Tone</label>
                                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                                    <Pipette className="w-3 h-3 text-accent-gold" />
                                    <span className="text-[0.55rem] font-bold text-white/40 uppercase">Color Hub</span>
                                </div>
                            </div>
                            <div className="relative flex items-center gap-3">
                                <div className="relative group/color shrink-0">
                                    <input
                                        type="color"
                                        value={settings.bgFill.startsWith('#') ? settings.bgFill : '#000000'}
                                        onChange={(e) => updateSetting('bgFill', e.target.value.toUpperCase())}
                                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-2 [&::-webkit-color-swatch]:border-white/20 hover:[&::-webkit-color-swatch]:border-white/40 transition-all"
                                    />
                                    <div className="absolute inset-0 pointer-events-none rounded-xl shadow-inner ring-1 ring-inset ring-white/10"></div>
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="#FFB84C"
                                        value={settings.bgFill.startsWith('#') ? settings.bgFill : ''}
                                        onChange={(e) => updateSetting('bgFill', e.target.value.toUpperCase())}
                                        className="studio-input text-[0.85rem] font-mono text-accent-gold tracking-widest h-12 pl-4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="space-y-5 px-1">
                        <label className="text-[0.65rem] font-bold opacity-60 uppercase tracking-[0.15em] ml-1 text-white">Output Codec</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['JPEG', 'PNG', 'WEBP'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => updateSetting('format', f)}
                                    className={`py-3 text-[0.7rem] font-black rounded-xl border transition-all duration-300 uppercase tracking-widest ${settings.format === f ? 'bg-accent-gold text-black shadow-lg' : 'bg-white/[0.04] border-white/10 text-white/40 hover:text-white/80'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {['JPEG', 'WEBP'].includes(settings.format) && (
                        <div className="space-y-5 px-1 pb-6">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[0.55rem] font-black opacity-40 uppercase tracking-[0.3em] text-white">Coefficient</label>
                                <span className="text-[0.75rem] font-black text-white font-mono shadow-sm">{settings.quality}%</span>
                            </div>
                            <div className="relative h-6 flex items-center group/range">
                                <div className="absolute inset-x-0 h-[4px] bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-gold" style={{ width: `${settings.quality}%` }}></div>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={settings.quality}
                                    onChange={(e) => updateSetting('quality', e.target.value)}
                                    className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute w-5 h-5 bg-white rounded-full shadow-2xl transition-transform group-hover/range:scale-125 cursor-pointer ring-4 ring-black" style={{ left: `calc(${settings.quality}% - 10px)` }}></div>
                            </div>
                        </div>
                    )}

                    {/* AI TOGGLE */}
                    {tool !== 'bg-remove' && (
                        <div className="pb-8">
                            <button
                                onClick={() => updateSetting('bgRemove', !settings.bgRemove)}
                                className={`w-full py-4.5 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 text-[0.7rem] font-black uppercase tracking-[0.2em] ${settings.bgRemove ? 'bg-accent-purple text-black border-transparent shadow-2xl shadow-black/40' : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white/80 hover:bg-white/[0.05]'}`}
                            >
                                <Cpu className={`w-5 h-5 ${settings.bgRemove ? 'animate-pulse' : ''} stroke-[2px]`} />
                                {settings.bgRemove ? 'Alpha Channel Active' : 'Alpha Channel Off'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // --- RENDER STAGE (Center Panel) ---
    const stagePanel = (
        <div className="flex-1 w-full h-full flex flex-col relative animate-up">
            <SourcePreview />
            <SyncEvents tool={tool} startProcessing={useToolState().startProcessing} isProcessing={isProcessing} uploadedFiles={uploadedFiles} />
        </div>
    );

    if (!mounted) return null;

    return (
        <>
            {createPortal(settingsPanel, document.getElementById("settings-portal"))}
            {createPortal(stagePanel, document.getElementById("playground-portal"))}
        </>
    );
}

function SyncEvents({ tool, startProcessing, isProcessing, uploadedFiles }) {
    useEffect(() => {
        const btn = document.getElementById("process-btn-next");
        if (btn) {
            const handler = () => startProcessing(tool);
            btn.addEventListener("click", handler);
            return () => btn.removeEventListener("click", handler);
        }
    }, [tool, startProcessing, isProcessing, uploadedFiles]);
    return null;
}
