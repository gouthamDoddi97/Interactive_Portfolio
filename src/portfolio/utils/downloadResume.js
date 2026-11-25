export async function downloadResume() {
  const resumePath = `${process.env.PUBLIC_URL}/resume-ats.html?v=${Date.now()}`;
  const response = await fetch(resumePath, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Could not load ${resumePath} (${response.status})`);
  }
  const htmlContent = await response.text();

  const frame = document.createElement('iframe');
  frame.setAttribute('title', 'Resume print view');
  frame.style.cssText =
    'position:fixed;width:0;height:0;border:0;right:0;bottom:0';
  document.body.appendChild(frame);

  const frameDoc = frame.contentDocument || frame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(htmlContent);
  frameDoc.close();

  await new Promise((resolve) => {
    if (frameDoc.readyState === 'complete') {
      resolve();
    } else {
      frame.addEventListener('load', resolve, { once: true });
    }
  });

  if (frameDoc.fonts?.ready) {
    await frameDoc.fonts.ready;
  }

  const cleanup = () => {
    if (frame.parentNode) {
      document.body.removeChild(frame);
    }
  };
  frame.contentWindow.addEventListener('afterprint', cleanup, { once: true });
  setTimeout(cleanup, 60000);

  frame.contentWindow.focus();
  frame.contentWindow.print();
}
