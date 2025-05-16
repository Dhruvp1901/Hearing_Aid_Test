let logs = []

export function newLog(toWrite){
    logs.push(toWrite);
}
export function downloadLogs() {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${month}-${day}-${year}|${hour}-${minutes}`;
    link.download = 'snrLog('+formattedDate+').txt';
    link.click();
    URL.revokeObjectURL(url);
    logs = []
  }