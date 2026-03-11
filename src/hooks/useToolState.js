"use client";
import React, { useState, createContext, useContext } from "react";

const ToolContext = createContext();

const getApiBase = () => {
    if (typeof window !== 'undefined') {
        const envBase = process.env.NEXT_PUBLIC_API_BASE;
        if (envBase) return envBase;
        // Fallback to current host on port 3020 if no env is set
        return `${window.location.protocol}//${window.location.hostname}:3020/api`;
    }
    return "http://localhost:3020/api";
};
const API_BASE = getApiBase();

export const ToolProvider = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [outputs, setOutputs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progressMsg, setProgressMsg] = useState("");
    const [settings, setSettings] = useState({
        format: "JPEG",
        quality: 90,
        bgFill: "white",
        width: 1080,
        height: 1080,
        fitMode: "cover",
        bgRemove: false,
        crop: null, // {x, y, w, h}
        modeType: 'custom',
        primaryAssetIndex: 0
    });

    const clearFiles = () => {
        setUploadedFiles([]);
        setOutputs([]);
        setIsProcessing(false);
        setProgressMsg("");
        setSettings(prev => ({ ...prev, primaryAssetIndex: 0 }));
    };

    const addFiles = (newFiles) => {
        const mapped = newFiles.map(f => ({
            ...f,
            previewUrl: `${API_BASE}/preview/${f.id}`
        }));
        setUploadedFiles((prev) => [...prev, ...mapped]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });

        // Adjust primaryAssetIndex if needed
        setSettings(prev => {
            if (prev.primaryAssetIndex >= index && prev.primaryAssetIndex > 0) {
                return { ...prev, primaryAssetIndex: prev.primaryAssetIndex - 1 };
            }
            return prev;
        });
    };

    const startProcessing = async (tool) => {
        if (!uploadedFiles.length) return;
        setIsProcessing(true);
        setOutputs([]);
        setProgressMsg("Booting Sequencer...");

        try {
            const payload = {
                ids: uploadedFiles.map(f => f.id),
                requests: [{
                    width: parseInt(settings.width),
                    height: parseInt(settings.height),
                    mode: settings.fitMode,
                    label: tool === 'bg-remove' ? 'bgrem' : 'custom',
                    crop: settings.crop
                }],
                format: settings.format,
                quality: parseInt(settings.quality),
                bg_fill: settings.bgFill,
                bg_remove: tool === 'bg-remove' || settings.bgRemove
            };

            const res = await fetch(`${API_BASE}/process`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Process Error Occurred");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);
                        if (data.type === 'progress') setProgressMsg(data.message);
                        else if (data.type === 'complete') {
                            const mappedOutputs = data.outputs.map(o => ({
                                ...o,
                                url: `${API_BASE}/download/${o.filename}`
                            }));
                            setOutputs(mappedOutputs);
                            setIsProcessing(false);
                            setProgressMsg("Processing Complete");
                        }
                    } catch (e) { console.error("Parse err", e); }
                }
            }
        } catch (e) {
            console.error(e);
            setIsProcessing(false);
            setProgressMsg("ERROR: " + e.message);
        }
    };

    const downloadAll = async () => {
        if (!outputs.length) return;
        try {
            const fnames = outputs.map(o => o.filename);
            const res = await fetch(`${API_BASE}/zip`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filenames: fnames })
            });
            const data = await res.json();
            if (data.url) {
                const url = new URL(data.url, API_BASE.replace('/api', ''));
                const link = document.createElement('a');
                link.href = url.href;
                link.download = `studio_bundle.zip`;
                link.click();
            }
        } catch (e) {
            alert("Archive Generation Failed");
        }
    };

    return (
        <ToolContext.Provider
            value={{
                uploadedFiles,
                setUploadedFiles,
                outputs,
                setOutputs,
                isProcessing,
                setIsProcessing,
                isUploading,
                setIsUploading,
                progressMsg,
                setProgressMsg,
                settings,
                setSettings,
                clearFiles,
                addFiles,
                removeFile,
                startProcessing,
                downloadAll,
                API_BASE
            }}
        >
            {children}
        </ToolContext.Provider>
    );
};

export const useToolState = () => useContext(ToolContext);
