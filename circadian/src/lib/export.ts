import { format } from 'date-fns';
import type { Session } from '../types';

/**
 * Generates and downloads a markdown file containing all completed focus sessions.
 * Sessions are grouped by date (newest first) and sorted inside each day.
 * 
 * @param sessions The list of session items to export.
 */
export function downloadSessionsMarkdown(sessions: Session[]) {
  if (sessions.length === 0) {
    return;
  }

  // 1. Sort sessions by endTime descending
  const sorted = [...sessions].sort((a, b) => b.endTime - a.endTime);

  // 2. Group sessions by date string: yyyy-MM-dd
  const groups: { [key: string]: Session[] } = {};
  sorted.forEach((session) => {
    const dateStr = format(new Date(session.endTime), 'yyyy-MM-dd');
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(session);
  });

  // 3. Build markdown string
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  let md = `# >circadian_ session log\n`;
  md += `exported: ${todayStr}\n\n`;

  // We sort group dates descending (newest day first)
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  sortedDates.forEach((dateStr) => {
    md += `---\n\n## ${dateStr}\n\n`;
    groups[dateStr].forEach((session) => {
      const modeStr = session.mode.toUpperCase();
      
      // Calculate duration parts
      const mins = Math.floor(session.durationSeconds / 60);
      const secs = session.durationSeconds % 60;
      const durationStr = `${mins}m ${secs.toString().padStart(2, '0')}s`;
      
      // Local time in 24h format (HH:mm)
      const timeStr = format(new Date(session.endTime), 'HH:mm');
      
      if (session.tag) {
        md += `- [${modeStr}] ${session.tag.toUpperCase()} — ${durationStr} — ${timeStr}\n`;
      } else {
        md += `- [${modeStr}] ${durationStr} — ${timeStr}\n`;
      }
    });
    md += `\n`;
  });

  // 4. Download file using client Blob anchors
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  link.setAttribute('download', `circadian-sessions-${todayStr}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
