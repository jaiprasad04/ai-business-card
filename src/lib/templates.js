export const templates = {
  classic: (card) => `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
        <div class="h-28 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div class="px-6 pb-6 relative">
          <div class="flex justify-between items-end -mt-10 mb-4">
            <div class="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-bold text-indigo-600">
              ${card.avatar ? `<img src="${card.avatar}" alt="${card.name}" class="w-full h-full object-cover" />` : card.name?.charAt(0) || "U"}
            </div>
            <div class="flex gap-2">
              ${getSocialIcons(card.socialLinks)}
            </div>
          </div>
          
          <h2 class="text-xl font-bold text-slate-800">${card.name || "Your Name"}</h2>
          <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">${card.title || "Job Title"}</p>
          <p class="text-xs text-slate-500 font-medium mb-4">${card.company || "Company Name"}</p>
          
          <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-5">${card.bio || "Write a brief description of yourself and what you do."}</p>
          
          <div class="space-y-3">
            ${card.email ? `
            <div class="flex items-center gap-3 text-slate-700">
              <span class="text-xs text-indigo-500">✉</span>
              <a href="mailto:${card.email}" class="text-xs hover:underline">${card.email}</a>
            </div>` : ""}
            ${card.phone ? `
            <div class="flex items-center gap-3 text-slate-700">
              <span class="text-xs text-indigo-500">📞</span>
              <a href="tel:${card.phone}" class="text-xs hover:underline">${card.phone}</a>
            </div>` : ""}
            ${card.website ? `
            <div class="flex items-center gap-3 text-slate-700">
              <span class="text-xs text-indigo-500">🌐</span>
              <a href="${card.website}" target="_blank" class="text-xs hover:underline">${card.website}</a>
            </div>` : ""}
            ${card.address ? `
            <div class="flex items-center gap-3 text-slate-700">
              <span class="text-xs text-indigo-500">📍</span>
              <span class="text-xs">${card.address}</span>
            </div>` : ""}
          </div>
        </div>
      </div>
    </div>
  `,

  "dark-tech": (card) => `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-mono text-slate-300">
      <div class="w-full max-w-sm bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-xl border border-emerald-500/30 overflow-hidden flex items-center justify-center text-2xl font-bold text-emerald-400 bg-slate-950">
            ${card.avatar ? `<img src="${card.avatar}" alt="${card.name}" class="w-full h-full object-cover" />` : card.name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 class="text-lg font-bold text-white tracking-tight">${card.name || "Your Name"}</h2>
            <p class="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">${card.title || "Job Title"}</p>
            <p class="text-xs text-slate-500">${card.company || "Company Name"}</p>
          </div>
        </div>

        <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-xl mb-6 text-xs leading-relaxed">
          <span class="text-emerald-500 font-bold block mb-1">&gt; PROFILE_INFO:</span>
          ${card.bio || "No bio loaded. Initializing profile."}
        </div>

        <div class="space-y-2 mb-6">
          ${card.email ? `
          <div class="flex items-center gap-3 text-[11px] hover:text-white transition-colors">
            <span class="text-emerald-500">✉</span>
            <a href="mailto:${card.email}" class="hover:underline">${card.email}</a>
          </div>` : ""}
          ${card.phone ? `
          <div class="flex items-center gap-3 text-[11px] hover:text-white transition-colors">
            <span class="text-emerald-500">☎</span>
            <a href="tel:${card.phone}" class="hover:underline">${card.phone}</a>
          </div>` : ""}
          ${card.website ? `
          <div class="flex items-center gap-3 text-[11px] hover:text-white transition-colors">
            <span class="text-emerald-500">⎋</span>
            <a href="${card.website}" target="_blank" class="hover:underline">${card.website}</a>
          </div>` : ""}
        </div>

        <div class="flex gap-3 justify-center border-t border-slate-800/80 pt-4">
          ${getSocialIcons(card.socialLinks)}
        </div>
      </div>
    </div>
  `,

  gradient: (card) => `
    <div class="min-h-screen bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4 font-sans">
      <div class="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-20 h-20 rounded-full border-2 border-white/30 overflow-hidden flex items-center justify-center text-3xl font-bold bg-white/5 mb-3 shadow-inner">
            ${card.avatar ? `<img src="${card.avatar}" alt="${card.name}" class="w-full h-full object-cover" />` : card.name?.charAt(0) || "U"}
          </div>
          <h2 class="text-xl font-extrabold tracking-tight">${card.name || "Your Name"}</h2>
          <p class="text-xs text-pink-300 font-semibold tracking-wider uppercase">${card.title || "Job Title"}</p>
          <p class="text-xs text-white/60">${card.company || "Company Name"}</p>
        </div>

        <p class="text-xs text-white/80 bg-white/5 border border-white/10 p-3 rounded-2xl text-center leading-relaxed mb-6">
          ${card.bio || "Describe your skills, business card info, or background details."}
        </p>

        <div class="space-y-3 mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          ${card.email ? `
          <div class="flex items-center gap-3 text-xs">
            <span class="text-pink-300">✉</span>
            <a href="mailto:${card.email}" class="hover:underline">${card.email}</a>
          </div>` : ""}
          ${card.phone ? `
          <div class="flex items-center gap-3 text-xs">
            <span class="text-pink-300">📞</span>
            <a href="tel:${card.phone}" class="hover:underline">${card.phone}</a>
          </div>` : ""}
          ${card.website ? `
          <div class="flex items-center gap-3 text-xs">
            <span class="text-pink-300">🌐</span>
            <a href="${card.website}" target="_blank" class="hover:underline">${card.website}</a>
          </div>` : ""}
        </div>

        <div class="flex gap-4 justify-center">
          ${getSocialIcons(card.socialLinks, true)}
        </div>
      </div>
    </div>
  `,

  serif: (card) => `
    <div class="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 font-serif text-[#2c3e2e]">
      <div class="w-full max-w-sm bg-[#f3efe8] border border-[#d6cfbe] rounded-2xl p-6 shadow-md relative">
        <div class="absolute top-4 right-4 text-xs font-semibold text-[#8a7f66] uppercase tracking-widest border-b border-[#d6cfbe] pb-0.5">Est. ${new Date().getFullYear()}</div>
        
        <div class="mb-6 mt-4">
          <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold bg-[#faf8f5] border border-[#d6cfbe] mb-3 shadow-inner">
            ${card.avatar ? `<img src="${card.avatar}" alt="${card.name}" class="w-full h-full object-cover" />` : card.name?.charAt(0) || "U"}
          </div>
          <h2 class="text-xl font-bold text-[#1b2b1e] tracking-tight leading-tight">${card.name || "Your Name"}</h2>
          <p class="text-xs italic text-[#5c6e5f] mt-0.5">${card.title || "Job Title"} &mdash; ${card.company || "Company"}</p>
        </div>

        <p class="text-xs text-[#4b584e] leading-relaxed border-t border-b border-[#d6cfbe] py-4 my-4 font-sans">
          ${card.bio || "A short paragraph describing your experience, values, and professional philosophy."}
        </p>

        <div class="space-y-2 mb-6 font-sans text-xs">
          ${card.email ? `<div><span class="text-[#8a7f66]">email:</span> <a href="mailto:${card.email}" class="hover:underline text-[#2c3e2e]">${card.email}</a></div>` : ""}
          ${card.phone ? `<div><span class="text-[#8a7f66]">phone:</span> <a href="tel:${card.phone}" class="hover:underline text-[#2c3e2e]">${card.phone}</a></div>` : ""}
          ${card.website ? `<div><span class="text-[#8a7f66]">web:</span> <a href="${card.website}" target="_blank" class="hover:underline text-[#2c3e2e]">${card.website}</a></div>` : ""}
          ${card.address ? `<div><span class="text-[#8a7f66]">office:</span> <span class="text-[#2c3e2e]">${card.address}</span></div>` : ""}
        </div>

        <div class="flex gap-4 justify-start border-t border-[#d6cfbe] pt-4 font-sans">
          ${getSocialIcons(card.socialLinks)}
        </div>
      </div>
    </div>
  `,

  gold: (card) => `
    <div class="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-serif text-neutral-300">
      <div class="w-full max-w-sm bg-neutral-900 border-2 border-amber-500/30 rounded-3xl p-8 relative shadow-2xl overflow-hidden">
        <div class="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
        
        <div class="flex flex-col items-center text-center mb-6 border-b border-amber-500/10 pb-6">
          <div class="w-20 h-20 rounded-full border-2 border-amber-500/40 overflow-hidden flex items-center justify-center text-3xl font-bold bg-neutral-950 text-amber-500 mb-4 shadow-xl">
            ${card.avatar ? `<img src="${card.avatar}" alt="${card.name}" class="w-full h-full object-cover" />` : card.name?.charAt(0) || "U"}
          </div>
          <h2 class="text-2xl font-semibold tracking-wide text-amber-500">${card.name || "Your Name"}</h2>
          <p class="text-xs text-neutral-400 tracking-widest uppercase mt-1">${card.title || "Job Title"}</p>
          <p class="text-[10px] text-amber-500/60 uppercase tracking-widest mt-0.5">${card.company || "Company"}</p>
        </div>

        <p class="text-xs italic text-neutral-400 leading-relaxed text-center mb-6">
          "${card.bio || "Crafting premium experiences with precision and luxury craftsmanship."}"
        </p>

        <div class="space-y-3 mb-6 bg-neutral-950/40 border border-amber-500/5 rounded-2xl p-4 font-sans text-xs">
          ${card.email ? `
          <div class="flex items-center gap-3 text-neutral-400">
            <span class="text-amber-500">✉</span>
            <a href="mailto:${card.email}" class="hover:text-amber-400 hover:underline transition-colors">${card.email}</a>
          </div>` : ""}
          ${card.phone ? `
          <div class="flex items-center gap-3 text-neutral-400">
            <span class="text-amber-500">📞</span>
            <a href="tel:${card.phone}" class="hover:text-amber-400 hover:underline transition-colors">${card.phone}</a>
          </div>` : ""}
          ${card.website ? `
          <div class="flex items-center gap-3 text-neutral-400">
            <span class="text-amber-500">🌐</span>
            <a href="${card.website}" target="_blank" class="hover:text-amber-400 hover:underline transition-colors">${card.website}</a>
          </div>` : ""}
        </div>

        <div class="flex gap-4 justify-center border-t border-amber-500/10 pt-6">
          ${getSocialIcons(card.socialLinks, false, true)}
        </div>
      </div>
    </div>
  `
};

function getSocialIcons(socialLinksJson, isLight = false, isGold = false) {
  let links = {};
  try {
    links = typeof socialLinksJson === "string" ? JSON.parse(socialLinksJson || "{}") : (socialLinksJson || {});
  } catch (e) {
    links = {};
  }

  const keys = Object.keys(links).filter(k => links[k] && links[k].trim() !== "");
  if (keys.length === 0) {
    return `<span class="text-slate-400 text-xs italic">No social links</span>`;
  }

  return keys.map(k => {
    let icon = k.toUpperCase().substring(0, 2);
    let colorClass = isLight ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-indigo-600";
    if (isGold) {
      colorClass = "text-neutral-500 hover:text-amber-500";
    }
    return `
      <a href="${links[k]}" target="_blank" class="text-xs font-bold tracking-wider hover:underline transition-colors uppercase ${colorClass}">
        ${icon}
      </a>
    `;
  }).join(" ");
}

export function generateCardDocument(card) {
  const templateId = card.templateId || "classic";
  
  // If custom template and htmlContent exists, render it directly
  if (templateId === "custom" && card.htmlContent) {
    // Return full HTML wrapper with Tailwind support
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: transparent;
          }
        </style>
      </head>
      <body>
        ${card.htmlContent}
      </body>
      </html>
    `;
  }

  // Predefined templates
  const templateFn = templates[templateId] || templates.classic;
  const bodyContent = templateFn(card);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: transparent;
        }
      </style>
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `;
}
