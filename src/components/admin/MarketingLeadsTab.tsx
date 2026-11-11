import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText, 
  MessageCircle, 
  TrendingUp, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Filter,
  Shield,
  Clock,
  Sparkles,
  Award,
  Globe2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface LeadItem {
  id: number;
  lead_id: string;
  lead_type: string;
  full_name: string;
  company: string;
  email: string;
  phone: string;
  service_interest: string;
  industry: string;
  preferred_time: string;
  message: string;
  traffic_channel: string;
  utm_source: string;
  utm_campaign: string;
  status: string;
  created_at_ist: string;
  metadata?: any;
}

interface LeadsSummary {
  totalLeads: number;
  chatbotLeads: number;
  formLeads: number;
  bookingLeads: number;
  sessionLeads: number;
  whatsappLeads: number;
  linkedinLeads: number;
}

export const MarketingLeadsTab: React.FC<{ totalVisitors?: number }> = ({ totalVisitors = 12450 }) => {
  const [summary, setSummary] = useState<LeadsSummary>({
    totalLeads: 0,
    chatbotLeads: 0,
    formLeads: 0,
    bookingLeads: 0,
    sessionLeads: 0,
    whatsappLeads: 0,
    linkedinLeads: 0
  });

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setLeads(data.leads || []);
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.warn('Failed to fetch leads from API, using cached data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(item => {
    const matchesFilter = filterType === 'all' || item.lead_type.toLowerCase() === filterType.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      item.full_name?.toLowerCase().includes(query) ||
      item.company?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.phone?.toLowerCase().includes(query) ||
      item.lead_id?.toLowerCase().includes(query) ||
      item.service_interest?.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  // Calculate Conversion Rate
  const conversionRate = totalVisitors > 0 
    ? ((summary.totalLeads / totalVisitors) * 100).toFixed(2)
    : '0.00';

  const exportCsv = () => {
    if (leads.length === 0) {
      toast.info('No leads to export yet');
      return;
    }
    const headers = ['Lead ID', 'Channel', 'Name', 'Company', 'Email', 'Phone', 'Service', 'UTM Source', 'UTM Campaign', 'Date (IST)'];
    const rows = leads.map(l => [
      l.lead_id,
      l.lead_type,
      `"${l.full_name}"`,
      `"${l.company || ''}"`,
      l.email,
      l.phone,
      `"${l.service_interest || ''}"`,
      l.utm_source || '(direct)',
      l.utm_campaign || '(none)',
      l.created_at_ist
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ISI-Marketing-Leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads exported as CSV');
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide">Multi-Channel Public Marketing Hub</h2>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-0.5 rounded-full">
              Live Conversion Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time attribution across Standalone Chat, Booking, Quick Sessions, Forms, WhatsApp, and LinkedIn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Total Visitors</div>
          <div className="text-xl font-bold text-white mt-1">{totalVisitors.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Global Audience</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Total Leads</div>
          <div className="text-xl font-bold text-blue-400 mt-1">{summary.totalLeads}</div>
          <div className="text-[10px] text-blue-300 mt-0.5">All Touchpoints</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Chatbot Leads</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">{summary.chatbotLeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">/chat</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Booking Leads</div>
          <div className="text-xl font-bold text-purple-400 mt-1">{summary.bookingLeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">/booking</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Session Requests</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{summary.sessionLeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">/session-request</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Form Leads</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{summary.formLeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">/forms</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">WhatsApp Leads</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{summary.whatsappLeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">/whatsapp</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Conversion Rate</div>
          <div className="text-xl font-bold text-rose-400 mt-1">{conversionRate}%</div>
          <div className="text-[10px] text-rose-300 mt-0.5">Visitors to Leads</div>
        </div>
      </div>

      {/* Campaign Performance & Channel Attribution Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Campaign Performance</h3>
            <span className="text-[10px] text-slate-400">Top UTM Campaigns</span>
          </div>

          <div className="space-y-2.5">
            {campaigns.length > 0 ? (
              campaigns.slice(0, 6).map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-200">{c.utm_campaign}</div>
                    <div className="text-[10px] text-slate-400">Source: <span className="text-blue-400">{c.utm_source}</span></div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800">
                    {c.lead_count} Leads
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Campaign performance data will populate as marketing URLs receive traffic.
              </div>
            )}
          </div>

          {/* Quick Production URLs Directory */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">Live Marketing Touchpoints:</h4>
            <div className="space-y-1.5 text-xs text-slate-400 font-mono">
              <div className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>/chat</span>
                <a href="/chat" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-[11px]">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>/booking</span>
                <a href="/booking" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-[11px]">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>/session-request</span>
                <a href="/session-request" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-[11px]">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>/forms</span>
                <a href="/forms" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-[11px]">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>/whatsapp</span>
                <a href="/whatsapp" target="_blank" className="text-emerald-400 hover:underline flex items-center gap-1 font-sans text-[11px]">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>/linkedin</span>
                <a href="/linkedin" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-[11px]">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Real-time Inquiries Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">Incoming Leads Dossier ({filteredLeads.length})</h3>

            <div className="flex items-center gap-2">
              {/* Channel Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Channels</option>
                <option value="chatbot">Chatbot</option>
                <option value="booking">Booking</option>
                <option value="session_request">Session Request</option>
                <option value="general_form">General Form</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="linkedin">LinkedIn</option>
              </select>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, company..."
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-2.5">Lead ID</th>
                  <th className="px-3.5 py-2.5">Channel</th>
                  <th className="px-3.5 py-2.5">Contact Details</th>
                  <th className="px-3.5 py-2.5">Service / Requirement</th>
                  <th className="px-3.5 py-2.5">UTM Attribution</th>
                  <th className="px-3.5 py-2.5">Timestamp (IST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-3.5 py-3 font-mono text-blue-400 text-[11px] font-semibold whitespace-nowrap">
                        {item.lead_id}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          item.lead_type === 'chatbot' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800' :
                          item.lead_type === 'booking' ? 'bg-purple-950/80 text-purple-300 border-purple-800' :
                          item.lead_type === 'session_request' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
                          item.lead_type === 'whatsapp' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' :
                          item.lead_type === 'linkedin' ? 'bg-blue-950/80 text-blue-300 border-blue-800' :
                          'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                        }`}>
                          {item.lead_type}
                        </span>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="font-semibold text-slate-100">{item.full_name}</div>
                        <div className="text-[11px] text-slate-400">{item.company || 'N/A'}</div>
                        <div className="text-[10px] text-slate-500">{item.email} • {item.phone}</div>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="text-slate-200 line-clamp-1">{item.service_interest || 'General'}</div>
                        {item.preferred_time && (
                          <div className="text-[10px] text-slate-400">Slot: {item.preferred_time}</div>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-[11px] whitespace-nowrap">
                        <div className="text-slate-300">{item.utm_source || '(direct)'}</div>
                        <div className="text-[10px] text-slate-500">{item.utm_campaign || '(none)'}</div>
                      </td>
                      <td className="px-3.5 py-3 text-[11px] text-slate-400 whitespace-nowrap">
                        {item.created_at_ist}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No lead records found for current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

