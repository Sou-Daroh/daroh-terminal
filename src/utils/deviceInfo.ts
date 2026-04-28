interface UserAgentData {
  platform?: string;
}

export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  
  
  let platform = "Unknown";
  
  if ('userAgentData' in navigator) {
    const userAgentData = (navigator as { userAgentData?: UserAgentData }).userAgentData;
    if (userAgentData && userAgentData.platform) {
      platform = userAgentData.platform;
    }
  }
  
  if (platform === "Unknown") {
    if (userAgent.includes("Windows")) {
      platform = "Windows";
    } else if (userAgent.includes("Mac")) {
      platform = "macOS";
    } else if (userAgent.includes("Linux") && !userAgent.includes("Android")) {
      platform = "Linux";
    } else if (userAgent.includes("Android")) {
      platform = "Android";
    } else if (userAgent.includes("iPhone")) {
      platform = "iPhone";
    } else if (userAgent.includes("iPad")) {
      platform = "iPad";
    }
  }
  
  let os = "Unknown OS";
  let kernel = "Unknown";
  let deviceType = "Desktop";
  
  if (userAgent.includes("Windows")) {
    os = "Windows";
    kernel = "NT";
  } else if (userAgent.includes("Mac OS X")) {
    os = "macOS";
    kernel = "Darwin";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
    kernel = "Linux";
    if (userAgent.includes("Ubuntu")) os = "Ubuntu";
    else if (userAgent.includes("Fedora")) os = "Fedora";
    else if (userAgent.includes("CentOS")) os = "CentOS";
  } else if (userAgent.includes("Android")) {
    deviceType = "Mobile";
    os = "Android";
    kernel = "Linux";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    deviceType = userAgent.includes("iPad") ? "Tablet" : "Mobile";
    os = "iOS";
    kernel = "XNU";
  }

  let shell = "Unknown Browser";
  let terminal = "Web Browser";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    shell = "Chrome";
    terminal = "Chromium Engine";
  } else if (userAgent.includes("Firefox")) {
    shell = "Firefox";
    terminal = "Gecko Engine";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    shell = "Safari";
    terminal = "WebKit Engine";
  } else if (userAgent.includes("Edg")) {
    shell = "Edge";
    terminal = "Chromium Engine";
  }

  const resolution = `${screen.width}x${screen.height}`;
  const colorDepth = `${screen.colorDepth}-bit`;
  const pixelRatio = window.devicePixelRatio || 1;
  
  const memory = "Available";
  const memoryUsed = "Available";

  const cores = navigator.hardwareConcurrency || "Unknown";
  const cpu = cores !== "Unknown" ? `${cores} cores` : "Unknown CPU";

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const languages = navigator.languages ? navigator.languages.join(', ') : language;

  const uptime = Math.floor(performance.now() / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  let gpu = "Unknown GPU";
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && 'getExtension' in gl && 'getParameter' in gl) {
      const webglContext = gl as WebGLRenderingContext;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer) {
          
          const rendererStr = renderer.toString();
          if (rendererStr.includes('Intel') && rendererStr.includes('Graphics')) {
            gpu = 'Intel Graphics [Integrated]';
          } else if (rendererStr.includes('NVIDIA') || rendererStr.includes('RTX') || rendererStr.includes('GTX')) {
            gpu = 'NVIDIA Graphics [Discrete]';
          } else if (rendererStr.includes('AMD') || rendererStr.includes('Radeon')) {
            gpu = 'AMD Graphics [Discrete]';
          } else {
            gpu = 'Graphics Card Available';
          }
        }
      }
    }
  } catch {
    gpu = "Unknown GPU";
  }

  return {
    os,
    kernel,
    deviceType,
    shell,
    terminal,
    platform,
    resolution,
    colorDepth,
    pixelRatio,
    memory,
    memoryUsed,
    cpu,
    cores,
    gpu,
    timezone,
    language,
    languages,
    uptime: uptimeStr,
    userAgent: "Browser"
  };
};
