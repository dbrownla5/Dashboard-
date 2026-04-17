/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Home, 
  Wallet, 
  ShieldCheck, 
  Search, 
  Send, 
  Loader2, 
  ChevronRight, 
  MapPin, 
  Users, 
  AlertCircle,
  FileText,
  BarChart3,
  BrainCircuit,
  Sun,
  Coffee,
  Moon,
  AlertTriangle,
  Plane,
  Car,
  DollarSign,
  Database,
  Briefcase,
  Target,
  Heart,
  Sparkles,
  Clock,
  Zap,
  Key
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';

// --- Types ---

type Tab = 'market' | 'home-org' | 'spending' | 'validator' | 'site-audit' | 'scope-tool' | 'launch-strategy' | 'catalog' | 'logistics-crm' | 'success-planner' | 'seo-growth' | 'handoff';

interface MarketData {
  inheritanceTrends: any[];
  proximityData: any[];
  generationalFears: any[];
  homeOrgReasons: any[];
  consumerBehavior: {
    preferredColors: any[];
    meetingPreferences: any[];
    postPandemicTrends: any[];
  };
}

// --- Constants ---

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const SERVICES_DATA = {
  homeOrg: {
    title: "Home Organization",
    tagline: "The Last Box",
    price: "$150 / hr",
    description: "Maybe you just moved and the boxes are winning. Maybe you have been looking at the same mess for three years and today is the day. I focus on what is actually not working in your space and what the real solution is for how you live.",
    subServices: [
      "Room-by-room organization",
      "Full home organization",
      "Storage unit recovery",
      "Family home cleanouts",
      "Workspace & Office closures",
      "Retail store packouts",
      "Furniture assembly",
      "Hands-on home improvements",
      "Move-in setup ($1,200/day flat rate)"
    ]
  },
  resale: {
    title: "Vintage Resale Curation & Consignment Concierge",
    tagline: "The Last Look",
    description: "I reduce the burden of the effort it takes to find the possible value or resale potential of the pieces you no longer need, still love, or know deserve another life. I build relationships — I do not set minimums or charge to come take photos and research items for clients.",
    commission: "55% Me / 45% You (Clothing)",
    features: [
      "No minimums for pickup (Zip bags provided)",
      "Vintage, Designer, Art, Furniture, and Home pieces",
      "Platform-specific listing strategy",
      "White-glove packing & shipping",
      "Monthly payout by the 5th",
      "50/50 split for Designer & Furniture"
    ]
  },
  legacy: {
    title: "Storytelling Concierge / Legacy Inventory",
    tagline: "The Archives",
    price: "From $3,500",
    hourly: "$175 / hr",
    description: "Families now inherit more belongings than they inherit room to keep them or a clear way to decide what comes next. I create clarity before a family mistakes value, memory, or meaning for garbage.",
    output: "Physical Leather Book with on-the-spot prints",
    packages: [
      { name: "Legacy Catalog", price: "From $3,500", detail: "20-30 hours. Research, valuation, and the physical Leather Book." },
      { name: "Home Organization Project", price: "$7,000", detail: "40 hours. Multi-day or multi-site full household story project + catalog." },
      { name: "Larger Estates / Out of State", price: "Quoted", detail: "Extensive research, commissioned projects, or out-of-state moves." }
    ]
  },
  specialDelivery: {
    title: "House Calls",
    tagline: "The Last Detail",
    price: "$175 / hr",
    description: "Did we forget to pack the parents? Modern families no longer live in the same city... House Calls bridges the real-life gaps that show up between visits, moves, downsizing, and everyday life.",
    features: [
      "Trusted presence & practical continuity",
      "Comfort resets after major life transitions",
      "Tech setup & Wi-Fi troubleshooting",
      "Hands-on home improvements (ladders, detectors, lighting)",
      "Peace of mind when you cannot be there"
    ]
  }
};

const INITIAL_MARKET_DATA: MarketData = {
  consumerBehavior: {
    preferredColors: [
      { color: 'Sage/Olive', sentiment: 'Trust, Growth, Calm', match: 85 },
      { color: 'Navy/Indigo', sentiment: 'Authority, Reliability', match: 92 },
      { color: 'Warm Taupe', sentiment: 'Stability, History', match: 78 },
      { color: 'Charcoal', sentiment: 'Modern Rigor, Precision', match: 88 }
    ],
    meetingPreferences: [
      { time: 'Late Morning (10am-12pm)', preference: 'High (Decision making)', icon: 'Sun' },
      { time: 'Mid Afternoon (2pm-4pm)', preference: 'Medium (Walkthroughs)', icon: 'Coffee' },
      { time: 'Early Evening (5pm-7pm)', preference: 'High (Adult children/Working pros)', icon: 'Moon' }
    ],
    postPandemicTrends: [
      { trend: 'Hyper-Transparency', detail: 'Clients demand to know exactly where items go (resale vs. landfill).' },
      { trend: 'The "Safe Stranger"', detail: 'Higher barrier to entry, but deeper loyalty once the "key to the house" is earned.' },
      { trend: 'Digital Continuity', detail: 'Expectation of text/photo updates for out-of-state family members.' }
    ]
  },
  inheritanceTrends: [
    { name: 'Will Prepared', value: 42, label: '42%' },
    { name: 'No Will', value: 58, label: '58%' },
  ],
  proximityData: [
    { name: 'Same State', value: 65 },
    { name: 'Different State', value: 35 },
  ],
  generationalFears: [
    { gen: 'Gen Z', fear: 'Cost of Living', score: 85 },
    { gen: 'Millennials', fear: 'Housing Stability', score: 78 },
    { gen: 'Gen X', fear: 'Retirement Savings', score: 72 },
    { gen: 'Boomers', fear: 'Healthcare Costs', score: 90 },
  ],
  homeOrgReasons: [
    { reason: 'Downsizing', percent: 35 },
    { reason: 'Mental Clarity', percent: 28 },
    { reason: 'Life Transition', percent: 22 },
    { reason: 'Relocation', percent: 15 },
  ]
};

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

const Card = ({ children, title, className }: { children: React.ReactNode, title?: string, className?: string }) => (
  <div className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden", className)}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [draftInput, setDraftInput] = useState('');
  const [scopeDescription, setScopeDescription] = useState('');
  const [proposedRevenue, setProposedRevenue] = useState('');
  const [serviceType, setServiceType] = useState('Home Organization (Bucket 1)');
  const [hours, setHours] = useState('40');
  const [location, setLocation] = useState('Los Angeles, CA');
  const [complexity, setComplexity] = useState('5');
  const [validatorAnalysis, setValidatorAnalysis] = useState<string | null>(null);
  const [scopingAnalysis, setScopingAnalysis] = useState<string | null>(null);
  const [auditAnalysis, setAuditAnalysis] = useState<string | null>(null);
  const [pricingPulseAnalysis, setPricingPulseAnalysis] = useState<string | null>(null);
  const [seoAnalysis, setSeoAnalysis] = useState<string | null>(null);
  const [handoffAnalysis, setHandoffAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketReport, setMarketReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [legacyCount, setLegacyCount] = useState(1);
  const [homeOrgCount, setHomeOrgCount] = useState(2);
  const [resaleHours, setResaleHours] = useState(10);
  const [resaleCommission, setResaleCommission] = useState(5000);

  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and proceed
      setHasApiKey(true);
    }
  };

  const ai = useMemo(() => {
    const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return new GoogleGenAI({ apiKey: key });
  }, [hasApiKey]);

  const generateMarketReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: "Generate a detailed market report on: 1. Parents of Millennials dying trends (next 10 years). 2. Inheritance/Will stats. 3. Geographic proximity of parents/children. 4. Home organization top 10 reasons, expectations, and regional differences (LA vs WA vs FL). 5. Spending trends (who is spending, who is scared). 6. Top 5 fears per generation. Format with clear headings and bullet points.",
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      setMarketReport(response.text || "Failed to generate report.");
    } catch (error: any) {
      console.error("Report generation error:", error);
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        setMarketReport(`
### ⚠️ API Quota Exceeded
The shared API key has reached its limit. To continue using real-time market data and strategic analysis, please select your **Paid API Key** in the sidebar.

**Current Fallback Data:**
* **Inheritance Trends:** Trillions passing to Millennials; 58% of Boomers lack wills.
* **Geographic Proximity:** 35% of adult children live out-of-state from aging parents.
* **Top Reasons for Hiring:** Downsizing (35%), Mental Clarity (28%), Transitions (22%).
        `);
      } else {
        setMarketReport("Error generating report. Please check your connection or API key.");
      }
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const generateSeoStrategy = async () => {
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: "Generate a comprehensive SEO and Growth strategy for 'The Well Lived Citizen' in Los Angeles. Services: 1. Home Organization (The Last Box). 2. Curated Resale (The Last Look). 3. Legacy Inventory (The Archives). Target: Affluent LA neighborhoods (Beverly Hills, Santa Monica, West Hollywood). Include: 1. Local SEO neighborhood keywords. 2. Long-tail keywords for the 'Resale + Org' synergy. 3. Content pillars for authority. 4. Visual SEO tips for Pinterest/Instagram. 5. A 30-day launch SEO checklist.",
        config: { tools: [{ googleSearch: {} }] }
      });
      setSeoAnalysis(response.text || "SEO strategy generation failed.");
    } catch (error: any) {
      console.error("SEO error:", error);
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        setSeoAnalysis("⚠️ API Quota Exceeded. Please select your Paid API Key in the sidebar to run this analysis.");
      } else {
        setSeoAnalysis("Error generating SEO strategy.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateManusHandoff = async () => {
    if (!draftInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Convert these raw branding/site edits into a professional, clear, and data-backed "Developer Handoff" for Manus. 
        Context: 'The Well Lived Citizen' (LA Luxury Home Org + Resale). 
        Founder Background: SVP Worldwide (Singer Viking Pfaff), operational rigor, luxury retail.
        Raw Edits: "${draftInput}"
        
        Requirements for the Handoff Document:
        1. **Executive Summary**: 1-2 sentences on the goal of these changes.
        2. **Action Items (Before vs. After)**: For each edit, provide a "Current State" and "Desired State" description.
        3. **SEO & Market Context**: Explain WHY this change matters for the LA market (e.g., "Targets high-net-worth estate managers").
        4. **Copywriting**: Provide the exact final copy for headlines or body text.
        5. **Developer Checklist**: A bulleted list of technical tasks for Manus to check off.
        6. **Tone**: Professional, direct, and technically clear to minimize back-and-forth and billable hours.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      setHandoffAnalysis(response.text || "Handoff generation failed.");
    } catch (error: any) {
      console.error("Handoff error:", error);
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        setHandoffAnalysis("⚠️ API Quota Exceeded. Please select your Paid API Key in the sidebar to run this analysis.");
      } else {
        setHandoffAnalysis("Error generating handoff document.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnalysis = async () => {
    if (!draftInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Analyze the following business draft or website copy for "The Well Lived Citizen". 
        
        CONTEXT:
        - Founder: Dayna Brown (SVP Worldwide - Singer Viking Pfaff, Nordstrom, evo background).
        - Niche: High-touch operational rigor, "Legacy Catalog" (Inventory as a decision tool), Transition Support.
        - Target: High-net-worth seniors and their adult children.
        - Tone: Trusted, Professional, Operational, Human.
        - Operational Nuance: Night Owl (prefers late morning/evening client work, off-site research at night).
        - Tagline: Well Placed. Well Dressed (again). Transitions done Well.

        Please provide:
        1. STRATEGIC BRANDING AUDIT: Does the messaging capture the "Inventory as a Decision Tool" value?
        2. STRATEGIC GUARDRAILS: Identify potential "Terrible Decisions" (requests to say NO to) based on the operational model (e.g., construction, legal, low-value bulk liquidation).
        3. MARKET CORRELATIONS: How this draft resonates with current post-pandemic consumer behavior (Hyper-transparency, "Safe Stranger").
        4. COLOR & UX ADVICE: Does the messaging match the preferred Sage/Navy/Taupe palette?
        5. ACTIONABLE MESSAGING: 3 specific hooks for the "Legacy Catalog" that focus on family harmony and "Storytelling to Sale".

        Draft Content:
        ${draftInput}`,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      setValidatorAnalysis(response.text || "Analysis failed.");
    } catch (error: any) {
      console.error("Analysis error:", error);
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        setValidatorAnalysis("⚠️ API Quota Exceeded. Please select your Paid API Key in the sidebar to run this analysis.");
      } else {
        setValidatorAnalysis("Error running analysis. Please try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    generateMarketReport();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">The Well Lived Citizen</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Intelligence Suite</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem 
            icon={TrendingUp} 
            label="Market Trends" 
            active={activeTab === 'market'} 
            onClick={() => setActiveTab('market')} 
          />
          <SidebarItem 
            icon={Home} 
            label="Home Organization" 
            active={activeTab === 'home-org'} 
            onClick={() => setActiveTab('home-org')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Service Catalog" 
            active={activeTab === 'catalog'} 
            onClick={() => setActiveTab('catalog')} 
          />
          <SidebarItem 
            icon={Wallet} 
            label="Spending & Fears" 
            active={activeTab === 'spending'} 
            onClick={() => setActiveTab('spending')} 
          />
          <SidebarItem 
            icon={ShieldCheck} 
            label="Business Validator" 
            active={activeTab === 'validator'} 
            onClick={() => setActiveTab('validator')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Site Component Audit" 
            active={activeTab === 'site-audit'} 
            onClick={() => setActiveTab('site-audit')} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Project Scoping Tool" 
            active={activeTab === 'scope-tool'} 
            onClick={() => setActiveTab('scope-tool')} 
          />
          <SidebarItem 
            icon={TrendingUp} 
            label="Launch Strategy" 
            active={activeTab === 'launch-strategy'} 
            onClick={() => setActiveTab('launch-strategy')} 
          />
          <SidebarItem 
            icon={Database} 
            label="Logistics & CRM" 
            active={activeTab === 'logistics-crm'} 
            onClick={() => setActiveTab('logistics-crm')} 
          />
          <SidebarItem 
            icon={Target} 
            label="Success Planner" 
            active={activeTab === 'success-planner'} 
            onClick={() => setActiveTab('success-planner')} 
          />
          <SidebarItem 
            icon={Search} 
            label="SEO & Growth" 
            active={activeTab === 'seo-growth'} 
            onClick={() => setActiveTab('seo-growth')} 
          />
          <SidebarItem 
            icon={Send} 
            label="Manus Handoff" 
            active={activeTab === 'handoff'} 
            onClick={() => setActiveTab('handoff')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
          {!hasApiKey && (
            <button 
              onClick={handleSelectKey}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-xl transition-colors border border-amber-200"
            >
              <Key size={18} />
              <span>Select Paid API Key</span>
            </button>
          )}
          <div className="bg-indigo-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">System Status</p>
            <div className="flex items-center gap-2 text-sm text-indigo-900 font-medium">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", hasApiKey ? "bg-emerald-500" : "bg-blue-500")} />
              {hasApiKey ? "Pro Engine (Paid Key)" : "Pro Engine (Shared Key)"}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'market' && "Market Intelligence Dashboard"}
              {activeTab === 'home-org' && "Home Organization Deep Dive"}
              {activeTab === 'spending' && "Consumer Spending & Psychology"}
              {activeTab === 'validator' && "Strategic Business Validator"}
              {activeTab === 'site-audit' && "Website Component Audit"}
              {activeTab === 'scope-tool' && "Project Scoping & Value Tool"}
              {activeTab === 'launch-strategy' && "The Well Lived Citizen: Launch Strategy"}
              {activeTab === 'catalog' && "Full Service Catalog & Pricing"}
              {activeTab === 'seo-growth' && "SEO & Growth Strategy"}
              {activeTab === 'handoff' && "Developer Handoff Tool (Manus)"}
              {activeTab === 'success-planner' && "Success Planner & Revenue Projections"}
              {activeTab === 'logistics-crm' && "Logistics & CRM Strategy"}
            </h2>
            <p className="text-slate-500 italic">
              {activeTab === 'market' ? "A will divides the assets. It does not decide what happens to the things that made a life feel like home." : "Well Placed. Well Dressed (again). Transitions done Well."}
            </p>
          </div>
          
          <button 
            onClick={generateMarketReport}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isGeneratingReport ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Refresh Data
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'market' && (
            <motion.div 
              key="market"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card title="Inheritance & Wills (Parents of Millennials)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={INITIAL_MARKET_DATA.inheritanceTrends}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {INITIAL_MARKET_DATA.inheritanceTrends.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-indigo-600">Insight:</span> Over 58% of parents of Millennials currently do not have a formal will, creating a massive "Business Gap" for legacy planning and organizational services.
                  </p>
                </div>
              </Card>

              <Card title="Geographic Proximity (Parents vs. GROWN Children)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INITIAL_MARKET_DATA.proximityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-indigo-600">Insight:</span> 65% live in the same state, but the 35% who live in different states represent a high-demand segment for remote management and professional downsizing assistance.
                  </p>
                </div>
              </Card>

              <Card title="Detailed AI Market Report" className="lg:col-span-2">
                {isGeneratingReport ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={40} className="text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Digging up the latest stats...</p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <Markdown>{marketReport}</Markdown>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'home-org' && (
            <motion.div 
              key="home-org"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <Card title={SERVICES_DATA.homeOrg.title} className="lg:col-span-2">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-indigo-600">{SERVICES_DATA.homeOrg.tagline}</h4>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{SERVICES_DATA.homeOrg.price}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Maybe you just moved and the boxes are winning. Maybe you have been staring at the same mess for three years and something finally snapped. I focus on what is actually not working in your space and what the real solution is for how you live.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICES_DATA.homeOrg.subServices.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                        <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <h5 className="text-xs font-bold text-amber-800 uppercase mb-1">ADHD & Sensory-Sensitive Spaces *</h5>
                  <p className="text-[10px] text-amber-700 leading-tight">
                    Over three years of personal, hands-on experience supporting organization for childhood ADHD and sensory-specific needs. Real-world experience applied to making spaces work for how someone's brain actually operates. *Not medical or clinical guidance.
                  </p>
                </div>
              </Card>

              <Card title="Curated Resale">
                <h4 className="text-lg font-bold text-indigo-600 mb-1">{SERVICES_DATA.resale.tagline}</h4>
                <p className="text-xs text-slate-500 mb-4">For anyone, anytime. I reduce the burden of finding value in your items.</p>
                <ul className="space-y-3">
                  {SERVICES_DATA.resale.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <ShieldCheck size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[11px] text-indigo-700 font-medium italic">
                    "I build relationships — I do not set minimums or charge to come take photos and research items for clients."
                  </p>
                </div>
              </Card>

              <Card title="Top Reasons for Hiring" className="lg:col-span-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={INITIAL_MARKET_DATA.homeOrgReasons}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="reason" type="category" axisLine={false} tickLine={false} width={120} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="percent" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Regional Nuances">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Los Angeles</h4>
                      <p className="text-xs text-slate-500">Aesthetic-driven, luxury focus, "Instagrammable" pantries.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Washington</h4>
                      <p className="text-xs text-slate-500">Functional, outdoor gear management, sustainable systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Florida</h4>
                      <p className="text-xs text-slate-500">Downsizing specialists, humidity-safe storage, senior living transitions.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'spending' && (
            <motion.div 
              key="spending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Generational Fear Index">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={INITIAL_MARKET_DATA.generationalFears}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="gen" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 6, fill: '#6366f1' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Post-Pandemic Relationship Trends">
                  <div className="space-y-4">
                    {INITIAL_MARKET_DATA.consumerBehavior.postPandemicTrends.map((t, i) => (
                      <div key={i} className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                          <ShieldCheck size={18} /> {t.trend}
                        </h4>
                        <p className="text-sm text-indigo-800 mt-1">{t.detail}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Website Color Psychology (Niche Specific)">
                  <div className="grid grid-cols-2 gap-4">
                    {INITIAL_MARKET_DATA.consumerBehavior.preferredColors.map((c, i) => (
                      <div key={i} className="p-3 border border-slate-100 rounded-xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full mb-2 shadow-inner" style={{ backgroundColor: 
                          c.color === 'Sage/Olive' ? '#84a98c' : 
                          c.color === 'Navy/Indigo' ? '#1d3557' : 
                          c.color === 'Warm Taupe' ? '#b5a4a3' : '#333533' 
                        }} />
                        <h5 className="font-bold text-xs text-slate-800">{c.color}</h5>
                        <p className="text-[10px] text-slate-500 italic">{c.sentiment}</p>
                        <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${c.match}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Meeting Time Preferences">
                  <div className="space-y-4">
                    {INITIAL_MARKET_DATA.consumerBehavior.meetingPreferences.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                            {m.icon === 'Sun' ? <Sun size={18} /> : m.icon === 'Coffee' ? <Coffee size={18} /> : <Moon size={18} />}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-slate-800">{m.time}</h5>
                            <p className="text-[10px] text-slate-500">{m.preference}</p>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-indigo-600">Optimal</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card title="Spending Behavior Profiles" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <h4 className="font-bold text-emerald-800 flex items-center justify-between">
                      The "Normal" Spenders <span className="text-xs bg-emerald-200 px-2 py-1 rounded text-emerald-900">Stable</span>
                    </h4>
                    <p className="text-sm text-emerald-700 mt-1">High-earning Gen X and Boomers. Spending on travel, health, and home improvements.</p>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                    <h4 className="font-bold text-rose-800 flex items-center justify-between">
                      The "Scared" Savers <span className="text-xs bg-rose-200 px-2 py-1 rounded text-rose-900">Retracting</span>
                    </h4>
                    <p className="text-sm text-rose-700 mt-1">Lower-middle income Millennials and Gen Z. Cutting back on dining and non-essentials.</p>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <h4 className="font-bold text-indigo-800 flex items-center justify-between">
                      The "Service" Shift <span className="text-xs bg-indigo-200 px-2 py-1 rounded text-indigo-900">Growing</span>
                    </h4>
                    <p className="text-sm text-indigo-700 mt-1">Millennials spending on "Time-Saving" services (Home Org, Delivery) over physical goods.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'validator' && (
            <motion.div 
              key="validator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card title="Website Draft & Business Brief Analysis">
                <p className="text-sm text-slate-500 mb-4">
                  Paste your website drafts, business names, or domains below. Our AI will validate them against the market data above.
                </p>
                <div className="relative">
                  <textarea
                    value={draftInput}
                    onChange={(e) => setDraftInput(e.target.value)}
                    placeholder="Paste your draft here... e.g., 'Legacy Organizers - Helping parents downsize in LA...'"
                    className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                  <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing || !draftInput.trim()}
                    className="absolute bottom-4 right-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Run Validation
                  </button>
                </div>
              </Card>

              {validatorAnalysis && (
                <Card title="AI Strategic Validation Report" className="border-indigo-200 bg-indigo-50/30">
                  <div className="prose prose-indigo max-w-none">
                    <Markdown>{validatorAnalysis}</Markdown>
                  </div>
                </Card>
              )}
              {pricingPulseAnalysis && (
                <Card title="Market Pricing Pulse Results" className="border-emerald-200 bg-emerald-50/30 mt-6">
                  <div className="prose prose-emerald max-w-none">
                    <Markdown>{pricingPulseAnalysis}</Markdown>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'site-audit' && (
            <motion.div 
              key="site-audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card title="Upload Website Content or URL">
                <p className="text-sm text-slate-500 mb-4">
                  Provide your current website URL or paste the full text content. I'll identify missing components, strategic tabs, and UI elements necessary for your niche.
                </p>
                <div className="relative">
                  <textarea
                    value={draftInput}
                    onChange={(e) => setDraftInput(e.target.value)}
                    placeholder="Paste website text or URL here..."
                    className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                  <button
                    onClick={async () => {
                      setIsAnalyzing(true);
                      try {
                        const response = await ai.models.generateContent({
                          model: "gemini-3.1-pro-preview",
                          contents: `Act as a Senior Product Designer and Business Strategist. Analyze this website content/URL for a niche home organization and legacy business. Suggest specific new components, navigation tabs, and interactive tools that are missing but necessary for long-term growth and complex project management. \n\nContent:\n${draftInput}`,
                          config: { tools: [{ googleSearch: {} }] }
                        });
                        setAuditAnalysis(response.text || "Audit failed.");
                      } catch (e) {
                        setAuditAnalysis("Error running audit.");
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    disabled={isAnalyzing || !draftInput.trim()}
                    className="absolute bottom-4 right-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    Analyze Components
                  </button>
                </div>
              </Card>

              {auditAnalysis && (
                <Card title="Component & Strategic Roadmap" className="border-indigo-200 bg-indigo-50/30">
                  <div className="prose prose-indigo max-w-none">
                    <Markdown>{auditAnalysis}</Markdown>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'scope-tool' && (
            <motion.div 
              key="scope-tool"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <Card title="Project Scoping Form" className="lg:col-span-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Service Type</label>
                    <select 
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Home Organization (Bucket 1)</option>
                      <option>Legacy Planning & Catalog (Bucket 2)</option>
                      <option>Special Delivery (Bucket 3)</option>
                      <option>Curated Personal Resale (Bucket 4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Scope Description</label>
                    <textarea 
                      value={scopeDescription}
                      onChange={(e) => setScopeDescription(e.target.value)}
                      placeholder="Describe the project details..."
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Est. Hours</label>
                      <input 
                        type="number" 
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="e.g. 40" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Proposed Revenue ($)</label>
                      <input 
                        type="number" 
                        value={proposedRevenue}
                        onChange={(e) => setProposedRevenue(e.target.value)}
                        placeholder="e.g. 2500" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Los Angeles, CA" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Complexity (1-10): {complexity}</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                      className="w-full accent-indigo-600" 
                    />
                  </div>
                  <button 
                    onClick={async () => {
                      setIsAnalyzing(true);
                      try {
                        const response = await ai.models.generateContent({
                          model: "gemini-3.1-pro-preview",
                          contents: `Perform a detailed comparative analysis for the following project scope against market averages for professional organizers and estate managers in ${location}. 
                          
                          CONTEXT:
                          - Home Organization is $150/hr.
                          - ALL Transition Support, Legacy Planning, & Elder Company work is $175/hr.
                          - Legacy Catalog output is a physical Leather Book with on-the-spot prints and detailed research.
                          - Curated Resale has no minimums and focuses on vintage/high-end.
                          - ADHD/Sensory-sensitive focus is a premium niche.
                          - Tagline: Well placed. Worn well. Well lived.

                          Project Details:
                          - Service Type: ${serviceType}
                          - Description: ${scopeDescription}
                          - Estimated Effort: ${hours} hours
                          - Proposed Revenue: $${proposedRevenue}
                          - Complexity: ${complexity}/10
                          
                          Please provide:
                          1. Market Average Revenue for this scope in ${location}.
                          2. Effort Analysis (Is the hour estimate realistic?).
                          3. Value Score (1-100) based on hourly rate vs. market value.
                          4. Strategic Recommendation (Should I take this? How to increase value?).`,
                          config: { tools: [{ googleSearch: {} }] }
                        });
                        setScopingAnalysis(response.text || "Scoping failed.");
                      } catch (e) {
                        setScopingAnalysis("Error running scope analysis.");
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    disabled={isAnalyzing || !scopeDescription.trim()}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 size={18} className="animate-spin inline mr-2" /> : null}
                    Analyze Revenue & Effort
                  </button>
                </div>
              </Card>

              <Card title="Market Comparison & Value Analysis" className="lg:col-span-2">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={40} className="text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Running market comparison...</p>
                  </div>
                ) : scopingAnalysis ? (
                  <div className="prose prose-slate max-w-none">
                    <Markdown>{scopingAnalysis}</Markdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <BarChart3 size={48} className="mb-4 opacity-20" />
                    <p>Enter project details to see market comparison.</p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pb-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Legacy Planning */}
                <Card title="Bucket 2: Legacy Planning & Catalog" className="border-indigo-100">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-indigo-600 italic">"{SERVICES_DATA.legacy.tagline}"</h4>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{SERVICES_DATA.legacy.hourly}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Includes on-site life-story walkthroughs and off-site detailed research/valuation for art, furniture, and collectibles. 
                    Output is a **Physical Leather Book** with on-the-spot prints, vendor plans, dump estimates, and resale projections.
                  </p>
                  <div className="space-y-4 mb-6">
                    {SERVICES_DATA.legacy.packages.map((p, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between font-bold text-sm mb-1">
                          <span>{p.name}</span>
                          <span className="text-indigo-600">{p.price}</span>
                        </div>
                        <p className="text-xs text-slate-500">{p.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <h5 className="text-xs font-bold text-indigo-800 uppercase mb-2">The "Elder Company" Value</h5>
                    <p className="text-xs text-indigo-700">This is emotionally heavy, high-touch work. I am letting them walk me through their life while I handle the practicals (like fixing showerheads).</p>
                  </div>
                </Card>

                {/* Special Delivery */}
                <Card title="Bucket 3: Special Delivery (Transition Support)" className="border-emerald-100">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-emerald-600 italic">"{SERVICES_DATA.specialDelivery.tagline}"</h4>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{SERVICES_DATA.specialDelivery.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Trusted presence for seniors when family is away. Practical continuity paired with emotional support.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {SERVICES_DATA.specialDelivery.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase mb-2">Home Readiness Bundle</h5>
                    <p className="text-xs text-emerald-700">Optional ~$150. Batteries, flashlights, fire extinguishers, bedside remotes, fire-safe grab-and-go briefcase. Critical for CA fire season.</p>
                  </div>
                </Card>

                {/* Resale Splits */}
                <Card title="Bucket 4: Curated Resale Splits" className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <h5 className="font-bold text-slate-800 mb-2">Clothing & Accessories</h5>
                      <p className="text-2xl font-bold text-indigo-600">55 / 45</p>
                      <p className="text-xs text-slate-500 mt-1">10-item minimum. Zip bags provided.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <h5 className="font-bold text-slate-800 mb-2">Designer ($300+)</h5>
                      <p className="text-2xl font-bold text-indigo-600">50 / 50</p>
                      <p className="text-xs text-slate-500 mt-1">Per item. High-value research included.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <h5 className="font-bold text-slate-800 mb-2">Furniture ($150+)</h5>
                      <p className="text-2xl font-bold text-indigo-600">50 / 50</p>
                      <p className="text-xs text-slate-500 mt-1">I list, manage, and coordinate pickup.</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 bg-indigo-50 p-4 rounded-xl">
                    <AlertCircle size={20} className="text-indigo-600 shrink-0" />
                    <p>I absorb all platform fees, shipping, photography, and listing management. Your share is clean — no deductions after the split.</p>
                  </div>
                </Card>

                {/* Add-ons & Disclaimers */}
                <Card title="Add-ons & Operational Scope" className="lg:col-span-2 bg-slate-900 text-white border-none shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">Included Add-ons</h5>
                      <ul className="space-y-3">
                        <li className="flex justify-between text-sm border-b border-slate-800 pb-2">
                          <span>Furniture Assembly (IKEA, West Elm)</span>
                          <span className="text-emerald-400 font-bold">Included</span>
                        </li>
                        <li className="flex justify-between text-sm border-b border-slate-800 pb-2">
                          <span>Hands-on Home Improvements</span>
                          <span className="text-emerald-400 font-bold">Included</span>
                        </li>
                        <li className="flex justify-between text-sm border-b border-slate-800 pb-2">
                          <span>Electronics Wipe & Recycling</span>
                          <span className="text-emerald-400 font-bold">Included</span>
                        </li>
                        <li className="flex justify-between text-sm border-b border-slate-800 pb-2">
                          <span>Vendor Coordination (Haulers, Movers)</span>
                          <span className="text-indigo-400 font-bold">$150/hr</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2">The "Operator" Disclaimer</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        I am not an interior designer, lawyer, or certified appraiser. I do not perform construction or electrical work that requires a license. 
                        My assessments come from years of professional retail experience. I am an operational and organizational partner, not a legal one.
                      </p>
                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <p className="text-[10px] text-slate-300 italic">
                          "I believe the investment and time I put into people will lead to only good things... I look forward to helping you unpack your story in this chapter so you can keep turning the page."
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'launch-strategy' && (
            <motion.div 
              key="launch-strategy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Bucket 1</h4>
                  <p className="font-bold text-slate-800">Home Org</p>
                  <p className="text-xs text-slate-500 mt-1">The "Entry Point" - High competition, high visibility.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Bucket 2</h4>
                  <p className="font-bold text-slate-800">Legacy Catalog</p>
                  <p className="text-xs text-slate-500 mt-1">The "Blue Ocean" - High ticket, low competition.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Bucket 3</h4>
                  <p className="font-bold text-slate-800">Special Delivery</p>
                  <p className="text-xs text-slate-500 mt-1">The "Retention" - Recurring trust and presence.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Bucket 4</h4>
                  <p className="font-bold text-slate-800">Curated Resale</p>
                  <p className="text-xs text-slate-500 mt-1">The "ROI" - Offsets client costs, proves value.</p>
                </div>
              </div>

              <Card title="Launch Week Strategic Audit">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <BrainCircuit className="text-indigo-600 shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-indigo-900">Leveraging your Operations & Retail Background</h4>
                      <p className="text-sm text-indigo-800 mt-1">
                        Your retail background at **SVP Worldwide (Singer Viking Pfaff)**, Nordstrom, and evo is your secret weapon. Most organizers are "stylists"; you are an "Operator." 
                        Use the **Project Scoping Tool** to track your margins specifically on Bucket 4 (Resale) vs. Bucket 1 (Hourly). 
                        Your ability to value inventory (Bucket 2) is a retail skill that most organizers lack.
                        **Tagline**: Well placed. Worn well. Well lived.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800">Critical Data for Launch</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          **Generational Fears**: Use the "Spending & Fears" data to market Bucket 3 to Boomers who fear healthcare costs/isolation.
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          **Inheritance Stats**: Use the "Market Trends" data to prove the need for Bucket 2 (58% have no will).
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          **Regional Nuances**: In LA, lead with "Aesthetic" (Bucket 1) but upsell "Operational Efficiency" (Bucket 2/4).
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800">Quarterly Pricing Pulse</h4>
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-xs text-slate-500 mb-3">Check if your LA market rates are still competitive for high-touch inventory & resale services.</p>
                        <button 
                          onClick={async () => {
                            setIsAnalyzing(true);
                            try {
                              const response = await ai.models.generateContent({
                                model: "gemini-3.1-pro-preview",
                                contents: "Perform a Q2 2026 market pricing audit for professional organizers, estate managers, and inventory specialists in Los Angeles. What are the current hourly rates and commission structures for high-end curated resale?",
                                config: { tools: [{ googleSearch: {} }] }
                              });
                              setPricingPulseAnalysis(response.text || "Pricing pulse failed.");
                              // Results shown below
                            } catch (e) {
                              setPricingPulseAnalysis("Error running pricing pulse.");
                            } finally {
                              setIsAnalyzing(false);
                            }
                          }}
                          className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                          {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                          Run Market Pricing Pulse
                        </button>
                      </div>
                      {pricingPulseAnalysis && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                          <h5 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                            <TrendingUp size={14} />
                            Market Pricing Pulse Results
                          </h5>
                          <div className="prose prose-emerald prose-sm max-w-none">
                            <Markdown>{pricingPulseAnalysis}</Markdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
                    <div className="space-y-4">
                      <h4 className="font-bold text-rose-600 flex items-center gap-2">
                        <AlertTriangle size={18} /> Strategic Guardrails (Say "NO" to these)
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                          <h5 className="font-bold text-xs text-rose-800">Low-Value Bulk Liquidation</h5>
                          <p className="text-[10px] text-rose-700">"Can you just clear out this garage of junk?" - NO. You are an inventory specialist, not a junk hauler. Refer to a hauler.</p>
                        </div>
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                          <h5 className="font-bold text-xs text-rose-800">Legal/Financial Advice</h5>
                          <p className="text-[10px] text-rose-700">"Should I put this in a trust?" - NO. You are operational. Refer to an attorney.</p>
                        </div>
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                          <h5 className="font-bold text-xs text-rose-800">Unscoped "Emergency" Moves</h5>
                          <p className="text-[10px] text-rose-700">"I need to move tomorrow." - NO. Without a walkthrough and inventory, you lose your operational rigor.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-indigo-600 flex items-center gap-2">
                        <Moon size={18} /> Operational Nuances (Night Owl Strategy)
                      </h4>
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-xs text-indigo-800">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1 shrink-0" />
                            **Client Facing**: Schedule 10am-12pm or 5pm-7pm. These are peak decision-making and "adult child" availability windows.
                          </li>
                          <li className="flex items-start gap-2 text-xs text-indigo-800">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1 shrink-0" />
                            **Deep Work**: Use 9pm-1am for the "Leather Book" research and resale listing. This is when your "Operations Rigor" shines.
                          </li>
                          <li className="flex items-start gap-2 text-xs text-indigo-800">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1 shrink-0" />
                            **The "Unpack" Habit**: Market your "Night Owl Unpacking" as a premium service for move-ins—clients wake up to a finished home.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
                    <Card title="April Cash Flow Sprint (Immediate Revenue)" className="lg:col-span-2 bg-emerald-50/50 border-emerald-100">
                      <div className="space-y-4">
                        <p className="text-xs text-emerald-800">
                          Goal: Generate $5k–$8k in April to secure your May 1st move. Focus on high-velocity, low-friction services.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                            <h5 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                              <Zap size={16} /> The "Closet Reset" Blitz
                            </h5>
                            <p className="text-[10px] text-emerald-700 mt-1">
                              Target your existing SVP-level network. Offer a 4-hour "Season Swap & Resale Audit." 
                              **Revenue**: $600/session + immediate resale inventory for May cash flow.
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                            <h5 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                              <Search size={16} /> The "Legacy Audit" Intro
                            </h5>
                            <p className="text-[10px] text-emerald-700 mt-1">
                              Offer a $500 "2-Hour Valuation Walkthrough." You identify the top 5 high-value items in their home. 
                              **Revenue**: $500/session. Upsell to the full $3,500 Catalog.
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-900 text-white rounded-xl">
                          <h5 className="font-bold text-xs">April Action: "The 20-Contact Outreach"</h5>
                          <p className="text-[10px] opacity-80 mt-1">
                            Send 20 personalized texts/emails to your top former colleagues. "I've launched my own operational inventory firm. I'm doing 5 'Legacy Audits' this month for my inner circle before I open to the public."
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card title="High-Trust Networking Map" className="bg-indigo-50/50 border-indigo-100">
                      <div className="space-y-4">
                        <p className="text-[10px] text-indigo-800 italic">
                          Avoid the "Kardashian" vibe. Focus on established wealth and operational partners.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                              <ShieldCheck size={16} />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-indigo-900">Estate Attorneys</h5>
                              <p className="text-[10px] text-indigo-700">They deal with the "Silver Tsunami" daily. You are their "Clean Close" partner who handles the physical inventory they can't.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                              <MapPin size={16} />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-indigo-900">Pasadena/Palisades Realtors</h5>
                              <p className="text-[10px] text-indigo-700">Focus on established neighborhoods, not flashy ones. Target realtors selling 30+ year family homes.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                              <Users size={16} />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-indigo-900">Geriatric Care Managers</h5>
                              <p className="text-[10px] text-indigo-700">The ultimate high-trust referral. They manage transitions for seniors and need your "Safe Stranger" rigor.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          {activeTab === 'logistics-crm' && (
            <motion.div 
              key="logistics-crm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Short-Term CRM Strategy (The 'Lead-to-Legacy' Pipeline)" className="lg:col-span-2">
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500">
                      Until you build a custom CRM, use this manual pipeline to ensure no high-net-worth lead is dropped. Focus on "Operational Rigor" from the first touch.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <h5 className="font-bold text-xs text-slate-400 uppercase mb-2">1. Discovery (The Hook)</h5>
                        <ul className="text-xs space-y-2 text-slate-600">
                          <li>• Source (Referral/Web)</li>
                          <li>• Initial "Pain Point"</li>
                          <li>• Family Dynamics Note</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h5 className="font-bold text-xs text-indigo-400 uppercase mb-2">2. Scoping (The Rigor)</h5>
                        <ul className="text-xs space-y-2 text-indigo-700">
                          <li>• Walkthrough Date</li>
                          <li>• Estimated "Buckets"</li>
                          <li>• Proposal Sent Date</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h5 className="font-bold text-xs text-emerald-400 uppercase mb-2">3. Active (The Legacy)</h5>
                        <ul className="text-xs space-y-2 text-emerald-700">
                          <li>• Inventory Progress %</li>
                          <li>• Resale Value Found</li>
                          <li>• Next Family Report</li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <h4 className="font-bold text-sm mb-2">Recommended Tracking Fields (Excel/Notion):</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['Client Name', 'Key Contact (Child)', 'Address/Radius', 'Last Touch', 'Est. Project Value', 'Resale Potential', 'Emotional State', 'Next Action'].map((f, i) => (
                          <div key={i} className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-600 font-medium">{f}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Travel & Logistics Policy">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <Car size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">Driving Radius</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          **30 Miles Included**: Your hourly rate ($150-$175) includes travel within 30 miles of your home base.
                        </p>
                        <p className="text-xs text-slate-500 mt-2 italic">
                          **Beyond 30 Miles**: $1.00/mile or a flat $75 "Travel Premium" per session. This keeps it consistent and professional.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                        <Plane size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">National/Global Travel</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          **Anywhere for the Right Contact**: For "Legacy Catalog" projects (Bucket 2) or Full Estate transitions.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          **Policy**: Client pays for Airfare (Premium/Business for 6+ hrs) + Lodging + $100/day Per Diem + Full Hourly Rate for on-site work.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="First Year Revenue Potential" className="lg:col-span-3">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-indigo-600 flex items-center gap-2">
                        <Briefcase size={18} /> The "Whale" Project
                      </h4>
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase">Est. Payout</span>
                          <span className="text-xl font-black text-indigo-700">$25,000 - $45,000</span>
                        </div>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                          **Scope**: Full Estate Legacy Catalog (80 hrs) + Multi-room Organization (40 hrs) + High-end Resale Management ($100k+ inventory).
                        </p>
                        <ul className="mt-3 space-y-1 text-[10px] text-indigo-600">
                          <li>• Catalog Fee: $14,000</li>
                          <li>• Org Services: $6,000</li>
                          <li>• Resale Commission: $15,000+</li>
                        </ul>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <h4 className="font-bold text-slate-800 mb-4">Conservative vs. Aggressive Projections (Year 1)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-200 rounded-2xl">
                          <h5 className="font-bold text-sm text-slate-700">The "Steady Builder"</h5>
                          <div className="text-2xl font-black text-slate-900 mt-1">$120,000 - $160,000</div>
                          <p className="text-[10px] text-slate-500 mt-2">
                            Focus on Bucket 1 (Home Org) and Bucket 4 (Resale). 15-20 billable hours/week + steady resale churn.
                          </p>
                        </div>
                        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                          <h5 className="font-bold text-sm text-slate-300">The "Legacy Specialist"</h5>
                          <div className="text-2xl font-black text-white mt-1">$220,000 - $310,000</div>
                          <p className="text-[10px] text-slate-400 mt-2">
                            Landing 4-6 "Whale" projects per year + high-value art/furniture resale. Leveraging your executive-level operational rigor.
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-[11px] text-amber-800 italic">
                          "Your background at Nordstrom and evo means you aren't just 'organizing'—you are managing a high-value supply chain of personal history. Your 'largest payout' will likely come from a single estate where the resale commission alone exceeds your annual hourly billings."
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          {activeTab === 'success-planner' && (
            <motion.div 
              key="success-planner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="The 'Old Income' Monthly Mix ($25k/mo Goal)" className="lg:col-span-2">
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500">
                      To replace your previous executive-level income ($300k/yr) while maintaining balance, you don't need to work 60 hours a week. You need to manage **Project Variety** and **High-Margin Services**.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-xs text-indigo-400 uppercase">1. The Anchor</h5>
                          <Target size={14} className="text-indigo-400" />
                        </div>
                        <div className="text-lg font-black text-indigo-700">Legacy Catalog</div>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => setLegacyCount(Math.max(0, legacyCount - 1))} className="w-6 h-6 flex items-center justify-center bg-white border border-indigo-200 rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">-</button>
                          <span className="font-bold text-indigo-900">{legacyCount}</span>
                          <button onClick={() => setLegacyCount(legacyCount + 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-indigo-200 rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">+</button>
                        </div>
                        <p className="text-[10px] text-indigo-600 mt-2">**${(legacyCount * 7000).toLocaleString()} Payout**</p>
                        <p className="text-[10px] text-indigo-500 mt-1">{legacyCount * 40} hrs/mo (Standard Project avg).</p>
                      </div>
                      
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-xs text-emerald-400 uppercase">2. The Flow</h5>
                          <Clock size={14} className="text-emerald-400" />
                        </div>
                        <div className="text-lg font-black text-emerald-700">Home Org Resets</div>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => setHomeOrgCount(Math.max(0, homeOrgCount - 1))} className="w-6 h-6 flex items-center justify-center bg-white border border-emerald-200 rounded-full text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">-</button>
                          <span className="font-bold text-emerald-900">{homeOrgCount}</span>
                          <button onClick={() => setHomeOrgCount(homeOrgCount + 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-emerald-200 rounded-full text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">+</button>
                        </div>
                        <p className="text-[10px] text-emerald-600 mt-2">**${(homeOrgCount * 3000).toLocaleString()} Payout**</p>
                        <p className="text-[10px] text-emerald-500 mt-1">{homeOrgCount * 20} hrs/mo (Hands-on, active).</p>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-xs text-amber-400 uppercase">3. The Passive</h5>
                          <Zap size={14} className="text-amber-400" />
                        </div>
                        <div className="text-lg font-black text-amber-700">Resale Churn</div>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-600">Hours:</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setResaleHours(Math.max(0, resaleHours - 5))} className="w-5 h-5 flex items-center justify-center bg-white border border-amber-200 rounded-full text-amber-600 hover:bg-amber-600 hover:text-white transition-all">-</button>
                              <span className="text-xs font-bold text-amber-900">{resaleHours}</span>
                              <button onClick={() => setResaleHours(resaleHours + 5)} className="w-5 h-5 flex items-center justify-center bg-white border border-amber-200 rounded-full text-amber-600 hover:bg-amber-600 hover:text-white transition-all">+</button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-600">Comm:</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setResaleCommission(Math.max(0, resaleCommission - 1000))} className="w-5 h-5 flex items-center justify-center bg-white border border-amber-200 rounded-full text-amber-600 hover:bg-amber-600 hover:text-white transition-all">-</button>
                              <span className="text-xs font-bold text-amber-900">${resaleCommission/1000}k</span>
                              <button onClick={() => setResaleCommission(resaleCommission + 1000)} className="w-5 h-5 flex items-center justify-center bg-white border border-amber-200 rounded-full text-amber-600 hover:bg-amber-600 hover:text-white transition-all">+</button>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-amber-600 mt-2">**${resaleCommission.toLocaleString()}+ Commission**</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <h4 className="font-bold text-lg">Monthly Totals</h4>
                          <p className="text-xs text-slate-400">Balanced for a 4-day work week</p>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-3xl font-black transition-all",
                            (legacyCount * 14000 + homeOrgCount * 3000 + resaleCommission) >= 25000 ? "text-emerald-400" : "text-indigo-400"
                          )}>
                            ${(legacyCount * 14000 + homeOrgCount * 3000 + resaleCommission).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest">Revenue Goal</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Billable Hours</div>
                          <div className="text-xl font-bold">{(legacyCount * 20 + homeOrgCount * 20 + resaleHours)} hrs / mo</div>
                          <div className="text-[10px] text-slate-400 italic">~{((legacyCount * 20 + homeOrgCount * 20 + resaleHours) / 4).toFixed(1)} hrs / week</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Work-Life Balance</div>
                          <div className={cn(
                            "text-xl font-bold",
                            (legacyCount * 20 + homeOrgCount * 20 + resaleHours) <= 80 ? "text-emerald-400" : "text-amber-400"
                          )}>
                            {(legacyCount * 20 + homeOrgCount * 20 + resaleHours) <= 80 ? "High" : "Moderate"}
                          </div>
                          <div className="text-[10px] text-slate-400 italic">
                            {(legacyCount * 20 + homeOrgCount * 20 + resaleHours) <= 80 ? "3-day weekends possible" : "Full 5-day week"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Founder's Edge & Encouragement">
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={20} />
                        <h4 className="font-bold">Why You'll Crush This</h4>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">
                        "You aren't just an organizer. You are a **Strategic Inventory Asset Manager**. Your background at **SVP Worldwide**, Nordstrom, and evo means you understand **Scale, Luxury, and Operational Rigor** in a way that 99% of this niche does not."
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <Heart size={18} className="text-rose-500" /> The Niche Validation
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-xs text-slate-600">**The "Silver Tsunami"**: 10,000 people turn 65 every day. They have the assets, the clutter, and the fear. You have the solution.</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-xs text-slate-600">**The "Decision Fatigue" Gap**: High-net-worth families are paralyzed by their belongings. Your "Operational Rigor" removes the paralysis.</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-xs text-slate-600">**The "Safe Stranger"**: Once you earn the key to one house in a gated community, you've earned the key to the whole street.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <h4 className="font-bold text-sm mb-2 italic">"Don't change your rate every year. Change your project variety."</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        As you build, move from Bucket 1 (Home Org) to Bucket 2 (Legacy Cataloging). The hours stay the same, but the value—and the payout—triples.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card title="Strategic Blindspots (What you might be missing)" className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-500" /> Referral Leakage
                      </h5>
                      <p className="text-xs text-slate-500">
                        You are doing the heavy lifting for estate attorneys and realtors. Ensure you have a **formal referral fee** or reciprocal agreement. Your inventory is their "clean close."
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" /> Intellectual Property
                      </h5>
                      <p className="text-xs text-slate-500">
                        The "Leather Book" is your IP. Ensure your contract specifies that the *format* and *system* are yours, even if the data belongs to the client. This prevents copycats.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users size={16} className="text-purple-500" /> The "Emotional Tax"
                      </h5>
                      <p className="text-xs text-slate-500">
                        Elder company is heavy. Budget for "Recovery Days" in your schedule. If you do a 4-hour Legacy Cataloging session, you need 2 hours of "Quiet Ops" (research) to reset.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          {activeTab === 'seo-growth' && (
            <motion.div 
              key="seo-growth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Local SEO Strategy" className="md:col-span-1">
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 rounded-xl">
                      <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Neighborhood Focus
                      </h4>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        <li>• Beverly Hills (Luxury/Estate)</li>
                        <li>• Santa Monica (Eco/Sustainable)</li>
                        <li>• West Hollywood (Design/Art)</li>
                        <li>• Silver Lake (Vintage/Boutique)</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                        <Search size={16} /> High-Intent Keywords
                      </h4>
                      <ul className="text-sm text-emerald-800 space-y-1">
                        <li>• "Luxury closet cleanout LA"</li>
                        <li>• "Designer resale pickup service"</li>
                        <li>• "ADHD home organization LA"</li>
                        <li>• "Estate wardrobe management"</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card title="SEO Launch Roadmap" className="md:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-500 text-sm">Generate a customized 30-day SEO & Growth roadmap for your LA launch.</p>
                    <button 
                      onClick={generateSeoStrategy}
                      disabled={isAnalyzing}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      Generate SEO Strategy
                    </button>
                  </div>

                  {seoAnalysis ? (
                    <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <Markdown>{seoAnalysis}</Markdown>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-100 rounded-xl">
                        <h5 className="font-bold text-slate-800 mb-2">Content Pillars</h5>
                        <p className="text-sm text-slate-600">Focus on "The Value of Resale" and "Sensory-Aware Design" to build authority in both niches simultaneously.</p>
                      </div>
                      <div className="p-4 border border-slate-100 rounded-xl">
                        <h5 className="font-bold text-slate-800 mb-2">Visual SEO</h5>
                        <p className="text-sm text-slate-600">Optimize Pinterest alt-text for "Minimalist Home Organization Los Angeles" to capture high-intent traffic.</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <Card title="SEO Quick Wins for Launch">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin size={20} />
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Google Business</h5>
                    <p className="text-xs text-slate-500">Claim your profile for local map visibility in LA.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText size={20} />
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Meta Titles</h5>
                    <p className="text-xs text-slate-500">Include "Los Angeles" in every page title.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users size={20} />
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Local Backlinks</h5>
                    <p className="text-xs text-slate-500">Partner with LA lifestyle bloggers for features.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 size={20} />
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Schema Markup</h5>
                    <p className="text-xs text-slate-500">Add LocalBusiness schema to your website code.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          {activeTab === 'handoff' && (
            <motion.div 
              key="handoff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Manus Handoff Instructions" className="lg:col-span-1">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Enter the raw changes or branding ideas you want Manus to implement. I will convert them into a structured, data-backed handoff document to minimize his billable hours.
                    </p>
                    <textarea 
                      value={draftInput}
                      onChange={(e) => setDraftInput(e.target.value)}
                      placeholder="e.g., I want the homepage to feel more like a luxury estate manager's site, and we need to emphasize the 'no minimums' for resale pickup..."
                      className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setDraftInput('')}
                        className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={generateManusHandoff}
                        disabled={isAnalyzing || !draftInput.trim()}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        Generate Manus Handoff
                      </button>
                    </div>
                  </div>
                </Card>

                <Card title="The Handoff Document" className="lg:col-span-2">
                  {handoffAnalysis ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Ready for Manus</span>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => {
                              const blob = new Blob([handoffAnalysis || ''], { type: 'text/markdown' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `manus-handoff-${new Date().toISOString().split('T')[0]}.md`;
                              a.click();
                            }}
                            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                          >
                            <Database size={12} /> Download .md
                          </button>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(handoffAnalysis || '');
                              alert("Handoff copied to clipboard!");
                            }}
                            className="text-xs text-indigo-600 hover:underline font-medium"
                          >
                            Copy to Clipboard
                          </button>
                        </div>
                      </div>
                      <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100 max-h-[600px] overflow-y-auto">
                        <Markdown>{handoffAnalysis}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-100 rounded-2xl">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} />
                      </div>
                      <h4 className="font-bold text-slate-400">No Handoff Generated Yet</h4>
                      <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">
                        Input your ideas on the left and click generate to create a clear instruction set for your developer.
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-indigo-900 rounded-3xl text-white">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <BrainCircuit size={20} className="text-indigo-300" />
                    Why this saves you money
                  </h4>
                  <ul className="space-y-3 text-sm opacity-90">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 shrink-0" />
                      <span>**Eliminates Ambiguity**: Manus won't have to guess your "vibe." He gets specific copy and layout logic.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 shrink-0" />
                      <span>**Market-Validated**: Every edit is cross-referenced with your LA market data before it reaches him.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 shrink-0" />
                      <span>**SEO-First**: We bake the keywords into the instructions so he doesn't have to go back and fix them later.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-900 rounded-3xl text-white">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Target size={20} className="text-emerald-400" />
                    The "Manus Workflow"
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">1</div>
                      <p className="text-xs opacity-80">You have an idea or see a site change you want.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                      <p className="text-xs opacity-80">Input it here to "Strategic Filter" it through the AI.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">3</div>
                      <p className="text-xs opacity-80">Copy the generated Markdown and send it to Manus.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">4</div>
                      <p className="text-xs opacity-80">Manus executes once, correctly. No re-work billing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
