import { CalendarCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";

// Extremely basic inline "bar chart" component for the server side
function SeverityChart({ reportContent }: { reportContent: string }) {
  // Try to parse the Total Findings table numbers
  const counts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  
  try {
     const matchHigh = reportContent.match(/\|\s*High\s*\|\s*(\d+)\s*\|/i);
     if (matchHigh) counts.High = parseInt(matchHigh[1], 10);
     
     const matchMedium = reportContent.match(/\|\s*Medium\s*\|\s*(\d+)\s*\|/i);
     if (matchMedium) counts.Medium = parseInt(matchMedium[1], 10);
     
     const matchLow = reportContent.match(/\|\s*Low\s*\|\s*(\d+)\s*\|/i);
     if (matchLow) counts.Low = parseInt(matchLow[1], 10);
     
     const matchCritical = reportContent.match(/\|\s*Critical\s*\|\s*(\d+)\s*\|/i);
     if (matchCritical) counts.Critical = parseInt(matchCritical[1], 10);
  } catch (e) {
     // Ignore parsing errors
  }

  const maxVal = Math.max(counts.Critical, counts.High, counts.Medium, counts.Low, 1);

  return (
    <div className="mb-10 p-6 bg-slate-50 border rounded-2xl">
      <h3 className="text-title text-lg text-slate-800 mb-4">Issues by Severity</h3>
      <div className="space-y-3">
        {Object.entries(counts).map(([label, val]) => {
          const percentage = (val / maxVal) * 100;
          let colorClass = "bg-slate-300";
          if (label === "Critical") colorClass = "bg-red-600";
          if (label === "High") colorClass = "bg-red-500";
          if (label === "Medium") colorClass = "bg-amber-400";
          if (label === "Low") colorClass = "bg-emerald-400";
          
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-16 text-sm font-semibold text-slate-600">{label}</span>
              <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden flex items-center">
                <div 
                   className={`h-full ${colorClass} transition-all duration-1000`} 
                   style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-sm font-bold font-mono tabular-nums text-slate-700 text-right">{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CodeReviewPage() {
  let content = "";
  try {
    const filePath = path.join(process.cwd(), "CODE_REVIEW_REPORT.md");
    content = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    content = "# Error\nCould not load the code review report.";
  }

  // A very basic markdown to HTML parser for our specific report format
  const parseMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900 border-b pb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-4 mb-6 text-primary">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm text-pink-600">$1</code>')
      // Tables
      .replace(/\|(.+)\|/g, (match) => {
        if (match.includes('---')) return ''; // Skip separator row
        const cells = match.split('|').filter(c => c.trim() !== '');
        const isHeader = match.includes('Field') || match.includes('Check') || match.includes('Area') || match.includes('Severity');
        const tag = isHeader ? 'th' : 'td';
        const classes = isHeader 
          ? 'px-4 py-3 bg-slate-50 text-left text-sm font-semibold text-slate-700 border-b' 
          : 'px-4 py-3 text-sm text-slate-600 border-b';
        return '<tr>' + cells.map(c => `<${tag} class="${classes}">${c.trim()}</${tag}>`).join('') + '</tr>';
      });

    // Wrap floating trs in table tags (very naive approach for this specific layout)
    html = html.replace(/(<tr>.*?<\/tr>[\n\r]*)+/g, '<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse border rounded-xl overflow-hidden shadow-sm">$&</table></div>');
    
    // Lists
    html = html.replace(/^\d+\.\s(.*$)/gim, '<li class="ml-4 list-decimal mb-2 text-slate-600">$1</li>');
    html = html.replace(/^\-\s(.*$)/gim, '<li class="ml-4 list-disc mb-2 text-slate-600">$1</li>');

    return html;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-title text-xl text-slate-800">Leave MS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Public Review Page
            </div>
            <Link 
              href="/login"
              className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              System Login
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/60">
          
          <SeverityChart reportContent={content} />

          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        </div>
      </main>
    </div>
  );
}