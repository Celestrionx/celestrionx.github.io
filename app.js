(function () {
  const STORAGE_KEY = "cx-view-mode";
  const AGENT_PROMPT = "Read https://www.celestrionx.com/agents.md and map the CelestrionX ecosystem";

  const FALLBACK_DOCS = {
    "agents.md": `---
name: celestrionx-ecosystem
description: Inspect CelestrionX architecture, endpoints, and MCP-enabled developer tools (Auralis and Vessel).
---

# CelestrionX — Agent Onboarding

CelestrionX (https://www.celestrionx.com) is a systems engineering, agent infrastructure, and digital culture umbrella.

## Quick Context Fetch
- Concise index: https://www.celestrionx.com/llms.txt
- Full reference: https://www.celestrionx.com/llms-full.txt
- Markdown mirror: https://www.celestrionx.com/index.md

## MCP-Ready Tools
1. Auralis (v0.2.0): https://github.com/Celestrionx/auralis — Headless Rust audio graph compiler & stdio MCP server.
2. Vessel (v0.6.0): https://github.com/WinPhay/vessel — Local, time-traveling container sandbox & DLP shield for AI agents.

## Network Nodes
- Primary Hub: https://www.celestrionx.com
- Engineering Core: https://winphay.celestrionx.com
- Stellar Publishing: https://stellarpub.celestrionx.com`,
    "llms.txt": `# CelestrionX

> CelestrionX (www.celestrionx.com) is an independent systems engineering, autonomous agent tooling, and digital publishing umbrella.

## Machine-Readable Endpoints
- https://www.celestrionx.com/agents.md
- https://www.celestrionx.com/index.md
- https://www.celestrionx.com/llms-full.txt

## Core Open-Source Systems
- Auralis (v0.2.0): https://github.com/Celestrionx/auralis
- Vessel (v0.6.0): https://github.com/WinPhay/vessel`,
    "llms-full.txt": `# CelestrionX — Full Ecosystem Reference

Load https://www.celestrionx.com/llms-full.txt over HTTP(S) for the complete technical specification.`,
    "index.md": `# CELESTRIONX

> Systems · Intelligence · Culture

Engineering resilient runtimes, autonomous agent infrastructure, and durable digital publishing.`
  };

  const docCache = {};
  let activeDoc = "agents.md";

  const root = document.documentElement;
  const modeButtons = document.querySelectorAll("[data-mode-target]");
  const docTabs = document.querySelectorAll("[data-doc]");
  const agentPre = document.getElementById("agent-doc-content");
  const rawLink = document.getElementById("agent-raw-link");
  const copyDocBtn = document.getElementById("copy-agent-doc");
  const copyPromptBtn = document.getElementById("copy-prompt-btn");
  const switchToAgentBtn = document.getElementById("switch-agent-btn");

  function setMode(mode, persist = true) {
    const normalized = mode === "agent" ? "agent" : "human";
    root.setAttribute("data-mode", normalized);

    modeButtons.forEach((btn) => {
      const isSelected = btn.getAttribute("data-mode-target") === normalized;
      btn.setAttribute("aria-selected", String(isSelected));
    });

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
      } catch (_) {}

      const url = new URL(window.location.href);
      if (normalized === "agent") {
        url.searchParams.set("mode", "agent");
      } else {
        url.searchParams.delete("mode");
      }
      window.history.replaceState({}, "", url.toString());
    }

    if (normalized === "agent") {
      loadAgentDoc(activeDoc);
    }
  }

  async function loadAgentDoc(docName) {
    activeDoc = docName;

    docTabs.forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab.getAttribute("data-doc") === docName));
    });

    if (rawLink) {
      rawLink.setAttribute("href", docName);
    }

    if (!agentPre) return;

    if (docCache[docName]) {
      agentPre.textContent = docCache[docName];
      return;
    }

    agentPre.textContent = "Loading /" + docName + "...";
    try {
      const res = await fetch("./" + docName, { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      docCache[docName] = text;
      if (activeDoc === docName) {
        agentPre.textContent = text;
      }
    } catch (_) {
      const fallback = FALLBACK_DOCS[docName] || "";
      docCache[docName] = fallback;
      if (activeDoc === docName) {
        agentPre.textContent = fallback;
      }
    }
  }

  async function copyText(text, btn, idleLabel) {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
    } catch (_) {
      btn.textContent = "Copy failed";
    }
    window.setTimeout(() => {
      btn.textContent = idleLabel;
    }, 1800);
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setMode(btn.getAttribute("data-mode-target"));
    });
  });

  if (switchToAgentBtn) {
    switchToAgentBtn.addEventListener("click", () => {
      setMode("agent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  docTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loadAgentDoc(tab.getAttribute("data-doc"));
    });
  });

  if (copyPromptBtn) {
    copyPromptBtn.addEventListener("click", () => {
      copyText(AGENT_PROMPT, copyPromptBtn, "Copy Prompt");
    });
  }

  if (copyDocBtn) {
    copyDocBtn.addEventListener("click", () => {
      const content = (agentPre && agentPre.textContent) || FALLBACK_DOCS[activeDoc] || "";
      copyText(content, copyDocBtn, "Copy Markdown");
    });
  }

  document.addEventListener("keydown", (event) => {
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if ((event.metaKey || event.ctrlKey) && event.key === ".") {
      event.preventDefault();
      const next = root.getAttribute("data-mode") === "agent" ? "human" : "agent";
      setMode(next);
    }
  });

  // Sync initial button/document state from pre-paint attribute
  const initialMode = root.getAttribute("data-mode") === "agent" ? "agent" : "human";
  setMode(initialMode, false);
})();
