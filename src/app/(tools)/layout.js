"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Zap,
    Image as ImageIcon,
    Download,
    Box,
    Loader2,
    CheckCircle2,
    Maximize,
    Repeat,
    Layers,
    ImageMinus,
    Share2,
    Info,
    Layers2,
    Sparkles
} from "lucide-react";
import { IMAGE_TOOLS } from "@/lib/constants";
import { ToolProvider, useToolState } from "@/hooks/useToolState";

const TOOL_ICONS = {
    resizer: Maximize,
    compressor: Zap,
    converter: Repeat,
    bulk: Layers,
    'bg-remove': ImageMinus,
    social: Share2,
    metadata: Info
};

function PlaygroundLayout({ children }) {
    const pathname = usePathname();
    const { uploadedFiles, isProcessing, progressMsg, outputs, downloadAll } = useToolState();

    return (
        <div className="flex h-screen w-screen bg-background text-white p-3 gap-3 overflow-hidden antialiased font-sans">
            {/* LEFT: COMMAND CENTER */}
            <aside className="w-[300px] glass-sidebar flex flex-col overflow-hidden relative border-white/10 bg-card-dark">


                <div className="flex-1 overflow-y-auto px-5 py-8 scroll-smooth custom-scrollbar">
                    <div className="grid grid-cols-2 gap-2.5 mb-10">
                        <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/50 ml-1 mb-3 col-span-2 heading-serif">
                            Modules Active
                        </label>
                        {IMAGE_TOOLS.map((tool) => {
                            const url = `/image-tools/${tool.id}`;
                            const isActive = pathname === url;
                            const Icon = TOOL_ICONS[tool.id] || Box;
                            return (
                                <Link
                                    key={tool.id}
                                    href={url}
                                    className={`flex flex-col items-center justify-center gap-3 px-2 py-4 rounded-xl transition-all duration-300 group border text-center ${isActive ? 'bg-accent-gold border-transparent text-black shadow-[0_10px_20px_-5px_rgba(255,184,76,0.2)]' : 'bg-white/[0.02] border-white/10 text-white/40 hover:text-white hover:bg-white/[0.05]'}`}
                                >
                                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-black' : ''} stroke-[2.5px]`} />
                                    <span className="text-[0.65rem] font-black uppercase tracking-[0.05em] leading-none truncate w-full">{tool.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div id="settings-portal" className="space-y-8 pb-4 animate-up">
                        {children}
                    </div>
                </div>

                <footer className="p-6 bg-card-dark border-t border-white/5 shrink-0">
                    <button
                        disabled={uploadedFiles.length === 0 || isProcessing}
                        id="process-btn-next"
                        className="action-btn text-[0.75rem] h-12"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin text-black" />
                                <span>Executing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 fill-current" />
                                Run Process
                            </div>
                        )}
                    </button>

                    {isProcessing && (
                        <div className="flex flex-col gap-2 mt-4 animate-pulse">
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-gold" style={{ width: '60%' }}></div>
                            </div>
                            <div className="flex justify-center text-[0.65rem] font-black text-white/40 tracking-[0.15em] font-mono uppercase truncate">
                                {progressMsg || 'Processing...'}
                            </div>
                        </div>
                    )}
                </footer>
            </aside>

            {/* CENTER: PLAYGROUND */}
            <main className="flex-1 glass-sidebar stage-grid flex flex-col relative bg-background overflow-hidden border-white/5">
                <div id="playground-portal" className="flex-1 w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
                    {/* The Page component content */}
                </div>
            </main>

            {/* RIGHT: OUTPUT STACK */}
            <aside className="w-[340px] glass-sidebar flex flex-col overflow-hidden relative border-white/10 bg-card-dark">
                <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-card-dark">
                    <h2 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/50 heading-serif">Output Archive</h2>
                    {outputs.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-mint/10 border border-accent-mint/30">
                            <div className="w-2 h-2 rounded-full bg-accent-mint shadow shadow-accent-mint/40 animate-pulse"></div>
                            <span className="text-[0.6rem] font-bold text-accent-mint uppercase tracking-widest leading-none">READY</span>
                        </div>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto px-5 py-8 custom-scrollbar space-y-6">
                    {outputs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center select-none text-center p-8 space-y-12">
                            <div className="w-20 h-20 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-center relative shadow-inner rotate-3">
                                <Box className="w-8 h-8 text-white/[0.05]" />
                            </div>
                            <div className="space-y-4">
                                <p className="font-black text-[0.65rem] uppercase tracking-[0.3em] text-accent-gold/40">Vault Queue</p>
                                <p className="text-[0.55rem] font-black leading-loose uppercase tracking-[0.2em] text-white/20 px-4">
                                    Processed assets will manifest in this stack for export
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-up">
                            {outputs.map((out, idx) => (
                                <div key={idx} className="group bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] shadow-2xl p-4">
                                    <div className="aspect-[1.5/1] w-full bg-black rounded-xl mb-4 flex items-center justify-center relative overflow-hidden ring-1 ring-white/10 shadow-inner">
                                        {['JPEG', 'PNG', 'WEBP'].includes(out.format) ? (
                                            <img src={out.url} alt={out.filename} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 text-white/10" />
                                        )}
                                        <span className="absolute top-2.5 left-2.5 text-[0.6rem] font-bold uppercase bg-black/90 text-white px-2 py-0.5 rounded-md border border-white/15 shadow-xl">{out.format}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 px-1">
                                        <div className="min-w-0">
                                            <span className="text-[0.65rem] font-black text-white/90 truncate block uppercase tracking-tight">{out.filename}</span>
                                            <div className="flex gap-2.5 items-center mt-2">
                                                <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                    <span className="text-[0.5rem] font-black text-white/40">{Math.round(out.size / 1024)}KB</span>
                                                </div>
                                                {out.saving > 0 && (
                                                    <span className="text-[0.6rem] font-bold text-accent-mint bg-accent-mint/10 px-2.5 py-1 rounded border border-accent-mint/20 tracking-wider leading-none">-{out.saving}% SIZE</span>
                                                )}
                                            </div>
                                        </div>

                                        <a
                                            href={out.url}
                                            download
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-purple text-black hover:bg-white transition-all shadow-xl active:scale-95 group/down"
                                        >
                                            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className="p-6 bg-card-dark border-t border-white/5 shrink-0">
                    {outputs.length > 0 ? (
                        <button
                            onClick={downloadAll}
                            className="w-full py-4.5 rounded-xl bg-white text-black hover:bg-accent-gold text-[0.7rem] font-black uppercase tracking-[0.25em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                        >
                            Download Vault
                            <Download className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="w-full py-4.5 rounded-xl bg-white/[0.02] border border-white/5 text-[0.6rem] font-black text-white/10 uppercase tracking-[0.2em] flex items-center justify-center cursor-not-allowed">
                            Archive Locked
                        </div>
                    )}
                </footer>
            </aside>
        </div>
    );
}

export default function RootToolsLayout({ children }) {
    return (
        <ToolProvider>
            <PlaygroundLayout>{children}</PlaygroundLayout>
        </ToolProvider>
    );
}
