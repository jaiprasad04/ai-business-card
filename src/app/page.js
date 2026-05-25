"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { generateCardDocument } from "@/lib/templates";
import { FaIdCard, FaMagic, FaSave, FaPlus, FaCheck, FaGlobe, FaQrcode, FaArrowRight, FaLock, FaTrashAlt, FaRobot } from "react-icons/fa";

export default function Home() {
  const { data: session, status } = useSession();
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"
  const [aiStatus, setAiStatus] = useState(""); // "", "generating", "polling", "completed", "error"
  const [aiError, setAiError] = useState("");
  const [aiTimer, setAiTimer] = useState(15);
  const [urlHash, setUrlHash] = useState("");
  
  // Card Form State
  const [formData, setFormData] = useState({
    name: "John Doe",
    title: "Senior Product Designer",
    company: "Acme Corporation",
    bio: "Passionate about creating modern user interfaces, leveraging artificial intelligence, and building scalable design systems.",
    phone: "+1 (555) 019-2834",
    email: "john.doe@example.com",
    website: "https://johndoe.design",
    address: "San Francisco, CA",
    avatar: "",
    backgroundImage: "",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    showAiAssistant: true,
    templateId: "classic",
    htmlContent: "",
    userPrompt: ""
  });


  // Fetch user's cards
  useEffect(() => {
    if (session?.user) {
      fetchCards();
    }
  }, [session]);

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/cards");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
        if (data.length > 0 && !selectedCardId) {
          loadCard(data[0]);
        }
      }
    } catch (e) {
      console.error("Error fetching cards:", e);
    }
  };

  const loadCard = (card) => {
    setSelectedCardId(card.id);
    setUrlHash(card.urlHash);
    let socials = { github: "", linkedin: "", twitter: "" };
    try {
      socials = typeof card.socialLinks === "string" ? JSON.parse(card.socialLinks) : (card.socialLinks || {});
    } catch (e) {}

    setFormData({
      name: card.name,
      title: card.title,
      company: card.company,
      bio: card.bio || "",
      phone: card.phone || "",
      email: card.email || "",
      website: card.website || "",
      address: card.address || "",
      avatar: card.avatar || "",
      backgroundImage: card.backgroundImage || "",
      socialLinks: socials,
      showAiAssistant: card.showAiAssistant !== false,
      templateId: card.templateId,
      htmlContent: card.htmlContent || "",
      userPrompt: card.userPrompt || ""
    });
  };

  const handleCreateNew = () => {
    setSelectedCardId("");
    setUrlHash("");
    setFormData({
      name: "Your Name",
      title: "Your Title",
      company: "Your Company",
      bio: "Your professional bio goes here.",
      phone: "",
      email: "",
      website: "",
      address: "",
      avatar: "",
      backgroundImage: "",
      socialLinks: { github: "", linkedin: "", twitter: "" },
      showAiAssistant: true,
      templateId: "classic",
      htmlContent: "",
      userPrompt: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  // Base64 file converter for image uploads
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveCard = async () => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCardId || undefined,
          ...formData
        })
      });

      if (res.ok) {
        const savedCard = await res.json();
        setSaveStatus("saved");
        setSelectedCardId(savedCard.id);
        setUrlHash(savedCard.urlHash);
        fetchCards();
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (e) {
      setSaveStatus("error");
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCardId) return;
    if (!confirm("Are you sure you want to delete this business card?")) return;

    try {
      const res = await fetch(`/api/cards?id=${selectedCardId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        handleCreateNew();
        fetchCards();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Generation Polling
  const handleGenerateAI = async () => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    if (session.user.credits < 5) {
      alert("You need at least 5 credits to generate a custom card styling layout.");
      return;
    }

    // Save first to ensure the backend has the latest profile data
    let currentId = selectedCardId;
    setAiStatus("generating");
    setAiError("");

    try {
      // 1. Persist the current form values first
      const saveRes = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCardId || undefined,
          ...formData
        })
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save card before generating AI styling");
      }

      const savedCard = await saveRes.json();
      currentId = savedCard.id;
      setSelectedCardId(savedCard.id);
      setUrlHash(savedCard.urlHash);

      // 2. Start AI layout generation
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentId,
          userPrompt: formData.userPrompt
        })
      });

      if (!genRes.ok) {
        const txt = await genRes.text();
        throw new Error(txt || "AI submission failed");
      }

      const { requestId } = await genRes.json();
      setAiStatus("polling");
      setAiTimer(15);

      // 3. Poll for result status
      let timerInterval = setInterval(() => {
        setAiTimer(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > 20) {
          clearInterval(pollInterval);
          clearInterval(timerInterval);
          setAiStatus("error");
          setAiError("Generation timed out. Please try checking status again or reload.");
          return;
        }

        try {
          const statusRes = await fetch(`/api/generate/status?cardId=${currentId}&requestId=${requestId}`);
          if (statusRes.ok) {
            const data = await statusRes.json();
            if (data.status === "completed") {
              clearInterval(pollInterval);
              clearInterval(timerInterval);
              setAiStatus("completed");
              
              // Load the newly generated custom html
              loadCard(data.card);
              
              // Refresh credits display by refreshing the browser router or fetching cards
              fetchCards();
              setTimeout(() => setAiStatus(""), 4000);
            } else if (data.status === "failed") {
              clearInterval(pollInterval);
              clearInterval(timerInterval);
              setAiStatus("error");
              setAiError(data.error || "AI generation failed");
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);

    } catch (err) {
      setAiStatus("error");
      setAiError(err.message || "Failed to trigger AI generation");
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-900 text-slate-100">
      
      {/* Sidebar: Form Controls */}
      <div className="w-full md:w-[450px] flex flex-col border-r border-slate-800 bg-slate-950 overflow-y-auto p-6 space-y-6">
        
        {/* Card Load / Switch Selector */}
        {session?.user && cards.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Saved Card</label>
            <div className="flex gap-2">
              <select
                value={selectedCardId}
                onChange={(e) => {
                  const card = cards.find(c => c.id === e.target.value);
                  if (card) loadCard(card);
                }}
                className="flex-1 bg-slate-950 text-sm border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
                ))}
              </select>
              <button
                onClick={handleCreateNew}
                className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1 active:scale-[0.98] transition-all"
                title="Create New Card"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <FaIdCard className="text-violet-500" />
            <span>Card Designer</span>
          </h2>
          {selectedCardId && (
            <button
              onClick={handleDeleteCard}
              className="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1 bg-red-950/20 border border-red-900/30 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <FaTrashAlt />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Section 1: Templates Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">1. Style Template</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "classic", name: "Classic Blue" },
              { id: "dark-tech", name: "Tech Dark" },
              { id: "gradient", name: "Gradient Glass" },
              { id: "serif", name: "Vintage Serif" },
              { id: "gold", name: "Elegant Gold" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setFormData(prev => ({ ...prev, templateId: t.id }))}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  formData.templateId === t.id
                    ? "border-violet-500 bg-violet-600/10 text-violet-400"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900"
                }`}
              >
                {t.name}
              </button>
            ))}
            {formData.templateId === "custom" && (
              <button
                className="col-span-2 py-2 px-3 rounded-xl border border-violet-500 bg-violet-600/20 text-violet-300 text-xs font-semibold text-center"
                disabled
              >
                Custom AI Layout Enabled ✨
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">2. Contact Details</label>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Job Title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="Title"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Company</span>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Bio / Description</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
              placeholder="Short bio details..."
            />
          </div>

          {/* Base64 Avatar Upload */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Upload Profile Picture</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-slate-500">
                {formData.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.avatar} alt="Preview" class="w-full h-full object-cover" />
                ) : "+"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="Email Address"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Phone</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Website</span>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Location / City</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="Location"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social Media Links */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">3. Social Links</label>
          <div className="grid grid-cols-3 gap-2">
            {["github", "linkedin", "twitter"].map(field => (
              <div key={field} className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase">{field} URL</span>
                <input
                  type="text"
                  name={field}
                  value={formData.socialLinks[field] || ""}
                  onChange={handleSocialChange}
                  placeholder="https://..."
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Chatbot Assistant Toggle */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaRobot className="text-violet-500 text-lg" />
            <div>
              <span className="text-xs font-semibold block text-white">Enable AI Visitor Assistant</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Allow card visitors to chat with your clone</span>
            </div>
          </div>
          <input
            type="checkbox"
            name="showAiAssistant"
            checked={formData.showAiAssistant}
            onChange={handleInputChange}
            className="w-4 h-4 text-violet-600 bg-slate-900 rounded border-slate-800 focus:ring-violet-500 cursor-pointer"
          />
        </div>

        {/* Section 5: AI Prompt generation */}
        <div className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FaMagic className="text-indigo-400" />
              <span>4. AI Custom Styling</span>
            </label>
            <span className="text-[9px] font-extrabold text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-900/50">Costs 5 Credits</span>
          </div>
          
          <span className="text-[10px] text-slate-400 block leading-relaxed">
            Write styling keywords (e.g., <i>"cyberpunk neon themed with high-contrast"</i> or <i>"vintage terminal code styling"</i>) to let AI write custom card CSS/HTML templates.
          </span>

          <textarea
            name="userPrompt"
            value={formData.userPrompt}
            onChange={handleInputChange}
            rows="2"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="E.g., neon purple, dark futuristic cyberpunk layout, large elegant fonts..."
          />

          <button
            onClick={handleGenerateAI}
            disabled={aiStatus === "generating" || aiStatus === "polling"}
            className="w-full bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiStatus === "generating" || aiStatus === "polling" ? (
              <span>Polled AI Response ({aiTimer}s)...</span>
            ) : (
              <>
                <FaMagic />
                <span>Generate Custom AI Card Layout</span>
              </>
            )}
          </button>

          {aiStatus === "error" && (
            <div className="text-[10px] text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl">
              Error: {aiError}
            </div>
          )}
        </div>

        {/* Footer Actions: Save Card */}
        <div className="pt-2">
          <button
            onClick={handleSaveCard}
            disabled={saveStatus === "saving"}
            className="w-full bg-violet-600 hover:bg-violet-750 text-white rounded-xl py-3 px-4 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === "saving" ? (
              <span>Saving Changes...</span>
            ) : saveStatus === "saved" ? (
              <>
                <FaCheck />
                <span>Business Card Saved!</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Business Card</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Main Panel: Preview & Share */}
      <div className="flex-1 flex flex-col bg-slate-900">
        
        {/* Top Header / Info bar */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Live Workspace Preview</h1>
            <p className="text-xs text-slate-400">See your digital business card update in real-time</p>
          </div>

          {urlHash && (
            <div className="flex items-center gap-3">
              <a
                href={`/card/${urlHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-950/30 border border-indigo-900/40 px-3.5 py-2 rounded-xl transition-all"
              >
                <FaGlobe />
                <span>Open Shared Card</span>
                <FaArrowRight className="text-[10px]" />
              </a>
            </div>
          )}
        </div>

        {/* Preview Frame Area */}
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-950 relative">
          
          {/* Transparent Overlay when AI is generating */}
          {(aiStatus === "generating" || aiStatus === "polling") && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-sm font-bold text-white tracking-wide">AI Custom Card Styling</h3>
              <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
                Gemini LLM is engineering your custom Tailwind layout. This takes up to 15 seconds. Please wait...
              </p>
            </div>
          )}

          {/* Device Mock Frame */}
          <div className="w-full max-w-md aspect-[9/16] max-h-[700px] bg-slate-900 rounded-[40px] border-[12px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
            {/* Top Speaker/Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full z-30"></div>
            
            {/* Iframe for card layout */}
            <iframe
              title="Card Live Preview"
              className="w-full h-full border-none bg-slate-900 z-10"
              srcDoc={generateCardDocument(formData)}
              sandbox="allow-scripts"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
