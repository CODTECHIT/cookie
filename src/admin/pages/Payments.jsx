import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";
import {
  CreditCard,
  Search,
  Filter,
  Loader2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Calendar,
  Landmark,
  Info,
  PieChart,
} from "lucide-react";

const PaymentsManagement = () => {
  const { API_URL, token } = useAdmin();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [historyMode, setHistoryMode] = useState("all");

  // Dashboard Metrics
  const [summary, setSummary] = useState({ online: 0, pending: 0, failed: 0 });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/payments`, {
        params: { status: statusFilter, search: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setPayments(data.data.payments);

        // Calculate quick summary metrics from list
        const metrics = data.data.payments.reduce(
          (acc, curr) => {
            if (curr.status === "Captured") acc.online += curr.amount;
            else if (curr.status === "Pending") acc.pending += curr.amount;
            else if (curr.status === "Failed") acc.failed += curr.amount;
            return acc;
          },
          { online: 0, pending: 0, failed: 0 },
        );
        setSummary(metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, statusFilter, searchTerm]);

  const fetchPaymentReport = useCallback(async () => {
    try {
      const fromDate = new Date();
      if (historyMode === "6m") {
        fromDate.setMonth(fromDate.getMonth() - 6);
      } else {
        fromDate.setFullYear(2000);
      }

      const { data } = await axios.get(`${API_URL}/payments/report`, {
        params: {
          from: fromDate.toISOString().split("T")[0],
          to: new Date().toISOString().split("T")[0],
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setReportData(data.data);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL, token, historyMode]);

  useEffect(() => {
    fetchPayments();
    fetchPaymentReport();
  }, [fetchPayments, fetchPaymentReport]);

  const handleExportReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/export-csv`, {
        params: {
          status: statusFilter || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payments-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export report. Please try again.");
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "UPI":
        return <Smartphone className="w-4 h-4" />;
      case "CARD":
        return <CreditCard className="w-4 h-4" />;
      case "NETBANKING":
        return <Landmark className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Captured":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Failed":
        return "text-red-600 bg-red-50 border-red-100";
      case "Refunded":
        return "text-blue-600 bg-blue-50 border-blue-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Payments & Financials
          </h1>
          <p className="text-gray-500 font-medium">
            Detailed tracking of all gateway transactions and settlements.
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center"
        >
          <Download className="w-5 h-5 mr-2" /> Export Report
        </button>
      </div>

      {/* Financial Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Online Revenue
            </p>
            <p className="text-2xl font-black text-emerald-600 leading-none tracking-tight">
              ₹{summary.online.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
              Captured Payments
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Failed Amount
            </p>
            <p className="text-2xl font-black text-red-600 leading-none tracking-tight">
              ₹{summary.failed.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
              Failed Transactions
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Pending Amount
            </p>
            <p className="text-2xl font-black text-amber-600 leading-none tracking-tight">
              ₹{summary.pending.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
              Uncaptured Funds
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by Transaction ID or Order #..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPayments()}
          />
        </div>
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button
            onClick={() => setStatusFilter("")}
            className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === "" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("Captured")}
            className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === "Captured" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
          >
            Captured
          </button>
          <button
            onClick={() => setStatusFilter("Failed")}
            className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === "Failed" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Transaction Details
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order Ref
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    Method
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2.5 rounded-xl ${p.status === "Captured" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"} flex-shrink-0`}
                        >
                          {getMethodIcon(p.method)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 leading-none truncate uppercase tracking-tighter">
                            {p.gatewayPaymentId || p._id.substring(0, 10)}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                            {p.gatewayName || "MANUAL"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-primary leading-none uppercase tracking-widest">
                        {p.orderId?.orderNumber || "DFA-2024-XXXX"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 truncate max-w-[120px] uppercase">
                        BY {p.customerId?.name || "GUEST"}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest py-1 px-3 bg-gray-100 rounded-full border border-gray-200">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-900 leading-none tracking-tight">
                        ₹{p.amount?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
                        CURRENCY: {p.currency}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div
                        className={`inline-flex items-center py-1 px-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(p.status)}`}
                      >
                        {p.status === "Captured" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1.5" />
                        )}
                        {p.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-gray-400 text-[10px] uppercase tracking-tighter">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Breakdown Report */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-primary" /> Gateway
            Performance
          </h2>
          <div className="space-y-4">
            {reportData.map((rpt, idx) => (
              <div
                key={idx}
                className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 group hover:border-primary/20 transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white text-primary rounded-2xl shadow-sm">
                      {getMethodIcon(rpt._id)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none uppercase tracking-tight">
                        {rpt._id}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase uppercase tracking-widest">
                        {rpt.count} Transactions
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-black text-gray-900 tracking-tight">
                    ₹{rpt.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(rpt.totalAmount / (summary.online + summary.pending + summary.failed)) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() =>
                  setHistoryMode((prev) => (prev === "6m" ? "all" : "6m"))
                }
                className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-primary cursor-pointer flex items-center justify-center group mx-auto"
              >
                View 6 Month History{" "}
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                {historyMode === "6m"
                  ? "Showing last 6 months"
                  : "Showing all-time data"}
              </p>
            </div>
          </div>
        </div>

        {/* Integration Status / Quick Info */}
        <div className="bg-primary text-white p-8 rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/2 -translate-y-1/2 rotate-12 transition-transform group-hover:rotate-45">
            <Landmark className="w-64 h-64" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Info className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1 rounded-full border border-white/20">
                Operational
              </span>
            </div>

            <h2 className="text-3xl font-black mb-2 tracking-tight">
              Gateway Integrity
            </h2>
            <p className="text-white/70 text-sm font-medium leading-relaxed max-w-sm">
              Your primary payment gateways (Razorpay/PhonePe) are performing
              optimally. Automatic reconciliations are scheduled daily at 00:00
              UTC.
            </p>
          </div>

          <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
            <div className="bg-white/10 border border-white/20 p-4 rounded-3xl backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
                Avg Settlement
              </p>
              <p className="text-lg font-black">48 Hours</p>
            </div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-3xl backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
                Error Rate
              </p>
              <p className="text-lg font-black">0.02%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsManagement;
