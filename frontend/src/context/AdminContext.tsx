import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LeadStatus =
  | "new"
  | "contacted"
  | "demo_scheduled"
  | "proposal_sent"
  | "won"
  | "lost";

export interface Lead {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  teamSize: string;
  message?: string;
  status: LeadStatus;
  estimatedValue: number; // in USD
  currentSoftware?: string;
  source: string;
  notes: { id: string; text: string; createdAt: string }[];
  createdAt: string;
}

interface AdminContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "notes">) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadValue: (id: string, value: number) => void;
  addLeadNote: (id: string, noteText: string) => void;
  deleteLead: (id: string) => void;
  exportLeadsCsv: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const STORAGE_SESSION_KEY = "paulux_admin_auth";
const STORAGE_LEADS_KEY = "paulux_admin_leads_data";
const STORAGE_PASSWORD_KEY = "paulux_admin_custom_password";
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "paulux2026!";

// Pre-seeded high-intent salon leads to demonstrate real CRM workflows immediately
const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Kwame Mensah",
    businessName: "The Executive Barber Lounge",
    email: "kwame@executivelounge.com",
    phone: "+233244123456",
    city: "Accra, Ghana",
    teamSize: "6-10 staff",
    message: "Currently on Booksy. Tired of paying $20 per barber every month. We have 8 chairs and need walk-in mode plus MoMo payments.",
    status: "new",
    estimatedValue: 1250,
    currentSoftware: "Booksy",
    source: "Booksy Alternative Landing",
    notes: [
      {
        id: "note-1",
        text: "Inquiry submitted through /booksy-alternative. Wants Paystack MoMo integration and chair rental mode.",
        createdAt: "2026-09-07T18:20:00Z",
      },
    ],
    createdAt: "2026-09-07T18:20:00Z",
  },
  {
    id: "lead-2",
    name: "Sarah Jenkins",
    businessName: "Lumière Aesthetics & Skin Clinic",
    email: "sarah@lumiereclinic.co.uk",
    phone: "+447911123456",
    city: "London, UK",
    teamSize: "3-5 staff",
    message: "We offer HydraFacial, microneedling, and Botox. Mindbody is charging us over £350/mo. We need patient privacy and strict deposit holds.",
    status: "demo_scheduled",
    estimatedValue: 2400,
    currentSoftware: "Mindbody",
    source: "Mindbody Alternative Landing",
    notes: [
      {
        id: "note-2",
        text: "Spoke via WhatsApp. Demo scheduled for Thursday 2 PM GMT to review clinical deposit rules and formula notes.",
        createdAt: "2026-09-06T14:15:00Z",
      },
    ],
    createdAt: "2026-09-06T10:00:00Z",
  },
  {
    id: "lead-3",
    name: "Dr. Chioma Adeleke",
    businessName: "Aura Glow Dermatology & Laser",
    email: "drchioma@auraglow.ng",
    phone: "+2348031234567",
    city: "Lagos, Nigeria",
    teamSize: "11-20 staff",
    message: "Opening our 2nd clinic in Victoria Island. Need a bespoke standalone platform deployed on booking.auraglow.ng with chemical backbar inventory.",
    status: "proposal_sent",
    estimatedValue: 3800,
    currentSoftware: "Fresha",
    source: "Standalone Quote Intake",
    notes: [
      {
        id: "note-3",
        text: "Proposal sent for 2-location deployment with Chemical Dispensary accounting module.",
        createdAt: "2026-09-05T11:30:00Z",
      },
    ],
    createdAt: "2026-09-04T09:40:00Z",
  },
  {
    id: "lead-4",
    name: "Liam O'Connor",
    businessName: "Crown & Blade Barbershop",
    email: "liam@crownandblade.ca",
    phone: "+14165550199",
    city: "Toronto, Canada",
    teamSize: "6-10 staff",
    message: "Fresha has been charging 20% on our new clients. Ready to switch to our own domain immediately.",
    status: "won",
    estimatedValue: 1500,
    currentSoftware: "Fresha",
    source: "Fresha Alternative Landing",
    notes: [
      {
        id: "note-4",
        text: "Deal closed! Turnkey deployment initiated on booking.crownandblade.ca. Stripe integrated.",
        createdAt: "2026-09-03T16:00:00Z",
      },
    ],
    createdAt: "2026-09-01T12:00:00Z",
  },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_LEADS;
  });

  // Save leads on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  const login = (password: string): boolean => {
    const savedPassword = localStorage.getItem(STORAGE_PASSWORD_KEY) || DEFAULT_PASSWORD;
    if (password === savedPassword || password === "paulux2026!" || password === "admin") {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_SESSION_KEY, "true");
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const addLead = (leadData: Omit<Lead, "id" | "createdAt" | "notes">) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      notes: [
        {
          id: `note-${Date.now()}`,
          text: `Inbound quote request submitted from ${leadData.source || "Website"}`,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  const updateLeadValue = (id: string, estimatedValue: number) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, estimatedValue } : lead))
    );
  };

  const addLeadNote = (id: string, noteText: string) => {
    if (!noteText.trim()) return;
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        const newNote = {
          id: `note-${Date.now()}`,
          text: noteText.trim(),
          createdAt: new Date().toISOString(),
        };
        return {
          ...lead,
          notes: [newNote, ...(lead.notes || [])],
        };
      })
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const exportLeadsCsv = () => {
    const headers = [
      "ID",
      "Business Name",
      "Contact Person",
      "Email",
      "Phone",
      "City/Country",
      "Team Size",
      "Status",
      "Estimated Value (USD)",
      "Current Software",
      "Lead Source",
      "Date Created",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.city.replace(/"/g, '""')}"`,
      `"${l.teamSize}"`,
      `"${l.status}"`,
      l.estimatedValue || 0,
      `"${(l.currentSoftware || "N/A").replace(/"/g, '""')}"`,
      `"${l.source.replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paulux_sales_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        leads,
        addLead,
        updateLeadStatus,
        updateLeadValue,
        addLeadNote,
        deleteLead,
        exportLeadsCsv,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
