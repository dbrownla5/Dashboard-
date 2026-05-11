import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const KeySettings = () => {
    const [status, setStatus] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/keys-status')
            .then(res => res.json())
            .then(data => {
                setStatus(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    const keys = [
        { id: 'GEMINI_API_KEY', label: 'Gemini AI' },
        { id: 'CLAUDE_API_KEY', label: 'Claude AI' },
        { id: 'MANUS_API_KEY', label: 'Manus AI' },
        { id: 'GITHUB_TOKEN', label: 'GitHub Token' },
        { id: 'JULES_API_KEY', label: 'Jules AI' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Key className="text-indigo-600" />
                Integration Keys
            </h3>
            <p className="text-sm text-slate-500 mb-6">
                Manage your API integrations. Keys are managed securely via AI Studio secrets.
            </p>
            <div className="space-y-3">
                {keys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <span className="font-medium text-sm text-slate-700">{key.label}</span>
                        {status[key.id] ? (
                            <div className="flex items-center gap-1 text-emerald-600 text-xs">
                                <CheckCircle2 size={16} /> Configured
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-amber-600 text-xs">
                                <AlertCircle size={16} /> Not Configured
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-xs text-indigo-800">
                To add or update these keys, please use the <strong>Settings &gt; Secrets</strong> menu in AI Studio.
            </div>
        </div>
    );
};
