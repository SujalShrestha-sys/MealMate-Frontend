import React from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

const StatusList = () => {
    const steps = [
        { label: 'Order Received', status: 'completed', icon: <Package size={16} /> },
        { label: 'Preparing Meal', status: 'active', icon: <Clock size={16} /> },
        { label: 'Ready for Pickup', status: 'pending', icon: <CheckCircle2 size={16} /> }
    ];

    return (
        <div className="space-y-4">
            {steps.map((step) => (
                <div key={step.label} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        step.status === 'active' ? 'bg-white border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                            'bg-white border-slate-100 text-slate-300'
                        }`}>
                        {step.icon}
                    </div>
                    <span className={`text-[13px] font-bold tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                        {step.label}
                    </span>
                    {step.status === 'active' && (
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full"
                        >
                            In Progress
                        </motion.span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatusList;
