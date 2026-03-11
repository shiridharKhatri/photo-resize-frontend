"use client";
import React, { useRef, useState } from "react";
import {
    X,
    FileImage,
    CloudDownload,
    HardDrive,
    CheckCircle2
} from "lucide-react";
import { useToolState } from "@/hooks/useToolState";

export default function UploadZone() {
    const { addFiles, uploadedFiles, clearFiles, removeFile, settings, setSettings, API_BASE, setIsUploading, isUploading } = useToolState();
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsUploading(true);
        const formData = new FormData();
        files.forEach(f => formData.append("file", f));

        try {
            const res = await fetch(`${API_BASE}/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                addFiles(data.files);
            } else {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Asset connection failed. Please verify engine status.");
        } finally {
            setIsUploading(false);
        }
        fileInputRef.current.value = "";
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) {
            const eFake = { target: { files: e.dataTransfer.files } };
            handleUpload(eFake);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-up">
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`bg-white/[0.03] p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden border border-dashed rounded-2xl ${isDragging ? 'bg-[#f4efea]/5 border-[#f4efea]/40' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'}`}
            >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10 group-hover:ring-[#f4efea]/20 transition-all duration-300 relative shadow-inner">
                    <CloudDownload className={`w-6 h-6 transition-all duration-300 relative z-10 ${isDragging ? 'text-accent-gold' : 'text-zinc-500 group-hover:text-white'}`} />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <strong className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-white/70 group-hover:text-white transition-all duration-300 font-display italic">Upload Assets</strong>
                    <p className="text-[0.6rem] font-medium opacity-40 uppercase text-center tracking-[0.2em] font-display">Drag and Drop or Browse</p>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" multiple accept="image/*,.heic,.heif" />
            </div>

            {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-white/30">Active Batch</span>
                        <button onClick={clearFiles} className="text-[0.55rem] font-black text-rose-400/30 hover:text-rose-400 uppercase tracking-[0.2em] transition-all">Clear All</button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {uploadedFiles.map((file, idx) => {
                            const isPrimary = settings.primaryAssetIndex === idx;
                            return (
                                <div
                                    key={file.id}
                                    onClick={() => setSettings(prev => ({ ...prev, primaryAssetIndex: idx }))}
                                    className={`group relative bg-card-dark rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer p-3 flex items-center gap-4 ${isPrimary ? 'border-accent-gold/40 bg-accent-gold/[0.03] shadow-lg shadow-black/20' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center overflow-hidden shrink-0 border border-white/10 shadow-inner">
                                        <img src={file.previewUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[0.65rem] font-black text-white/80 truncate uppercase tracking-tight">{file.filename}</div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[0.5rem] font-black text-white/20 uppercase tracking-tighter">{file.width}×{file.height}</span>
                                            {isPrimary && (
                                                <span className="text-[0.45rem] font-black text-accent-gold uppercase tracking-[0.15em] flex items-center gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-accent-gold animate-pulse"></div>
                                                    Editing
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(idx);
                                        }}
                                        className="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                                    >
                                        <X className="w-3 h-3 text-white/20 group-hover:text-rose-500 transition-colors" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

