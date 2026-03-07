import React from 'react';
import { Clock } from 'lucide-react';

const CurationDetails = ({ orderId, selectedSlot, formatTime }) => {
    return (
        <div className="space-y-6 mb-10">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
                    <div className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        #{orderId.split('-')[1]}
                    </div>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Slot</p>
                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Clock size={14} className="text-emerald-500" />
                        {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : 'ASAP'}
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Steps</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-xs text-slate-500 leading-relaxed italic">
                        <div className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                        Keep this page open or save your order ID for pickup.
                    </li>
                    <li className="flex items-start gap-3 text-xs text-slate-500 leading-relaxed italic">
                        <div className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                        We'll prepare it fresh just before your selected time.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CurationDetails;
