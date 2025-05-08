document.getElementById("extract").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: extractPolicyText,
      },
      (results) => {
        if (!results || !results[0] || !results[0].result) {
          document.getElementById("output").textContent =
            "❌ No privacy-related content found.";
          return;
        }
  
        const extracted = results[0].result;
        document.getElementById("output").textContent =
          extracted.slice(0, 1500000) + (extracted.length > 1500000 ? "..." : "");
      }
    );
  });
  
  document.getElementById("copyBtn").addEventListener("click", () => {
    const text = document.getElementById("output").textContent;
    if (!text) return;
  
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Text copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy:", err);
    });
  });
  
  // This function is injected into the current web page
  function extractPolicyText() {
    const keywords = ["privacy", "policy", "terms", "service", "data", "consent"];
    const matches = [];
  
    const elements = document.querySelectorAll("p, div, section, article");
  
    elements.forEach((el) => {
      const text = el.innerText.trim();
      const lower = text.toLowerCase();
  
      if (
        text.length > 80 &&
        keywords.some((word) => lower.includes(word))
      ) {
        matches.push(text);
      }
    });
  
    return matches.slice(0, 10).join("\n\n");
  }
  