"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    videoKey?: string;
}

export default function TrailerModal({ isOpen, onClose, title, videoKey }: TrailerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl bg-black/95 border-white/10 p-0 overflow-hidden outline-none">
                <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-white/5">
                    <DialogTitle className="text-white font-black uppercase tracking-tight">{title} - Official Trailer</DialogTitle>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>
                <div className="aspect-video w-full bg-black">
                    {videoKey ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40">
                            Trailer not available
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
