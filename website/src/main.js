// Architecture Diagram Data
const architectureNodes = [
  { id: 'llm', label: 'AI Agent' },
  { id: 'server', label: 'MCP Server (Java)' },
  { id: 'controller', label: 'JS Controller' },
  { id: 'bitwig', label: 'Bitwig Studio' },
];

function renderDiagram() {
  const container = document.getElementById('diagram-container');
  if (!container) return;

  let html = '';
  architectureNodes.forEach((node, index) => {
    html += `<div class="node" id="node-${node.id}">${node.label}</div>`;

    if (index < architectureNodes.length - 1) {
      const protocol = index === 0 ? 'MCP' : index === 1 ? 'TCP :8888' : 'API';
      html += `
        <div class="arrow" id="arrow-${index}">
          <span>${protocol}</span>
          <div class="arrow-line"></div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

// Animate Data Flow
function animateFlow() {
  let step = 0;
  const nodes = document.querySelectorAll('.node');
  const arrows = document.querySelectorAll('.arrow');

  setInterval(() => {
    // Reset all
    nodes.forEach(n => n.classList.remove('highlight'));
    arrows.forEach(a => a.classList.remove('arrow-active'));

    // Highlight current step
    if (step < nodes.length) {
      nodes[step].classList.add('highlight');
      if (step < arrows.length) {
        arrows[step].classList.add('arrow-active');
      }
    }

    step = (step + 1) % (nodes.length + 1);
  }, 1000);
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});

// Event Listeners
document.getElementById('start-tour')?.addEventListener('click', () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('open-docs')?.addEventListener('click', () => {
  window.open('https://github.com/taenia/beat-twin/tree/main/docs', '_blank');
});

// Terminal Simulation Logic
const demoScript = [
  { type: 'command', text: 'Call tool "transport_play"' },
  { type: 'response', text: '{"status": "success", "message": "Playback started"}' },
  { type: 'command', text: 'Call tool "track_bank_get_status"' },
  {
    type: 'response',
    text: '{"tracks": [{"name": "808 Bass", "volume": 0.8}, {"name": "Lead Synth", "volume": 0.6}]}',
  },
  { type: 'command', text: 'Call tool "track_selected_set_volume" {"volume": 0.9}' },
  { type: 'response', text: '{"status": "success", "message": "Volume set to 0.9 on Lead Synth"}' },
];

async function runTerminalDemo() {
  const output = document.getElementById('terminal-output');
  const btn = document.getElementById('run-demo-btn');
  if (!output || !btn) return;

  btn.disabled = true;
  btn.innerText = 'Running...';
  output.innerHTML = '';

  for (const step of demoScript) {
    const line = document.createElement('div');
    output.appendChild(line);

    if (step.type === 'command') {
      line.className = 'command';
      line.textContent = '> ';
      await typeText(line, step.text, 50);
    } else {
      line.className = 'response';
      await new Promise(r => setTimeout(r, 600)); // Simulate processing delay
      line.textContent = step.text;

      // Trigger side-effects on the Mixer Mockup
      handleMixerEffects(demoScript[demoScript.indexOf(step) - 1].text);
    }

    output.scrollTop = output.scrollHeight;
    await new Promise(r => setTimeout(r, 400));
  }

  btn.disabled = false;
  btn.textContent = 'Run Auto-Demo';
}

function handleMixerEffects(commandText) {
  if (commandText.includes('transport_play')) {
    const indicator = document.getElementById('play-indicator');
    if (indicator) indicator.classList.add('active');
  }

  if (commandText.includes('track_selected_set_volume')) {
    const fader = document.getElementById('fader-synth');
    const knob = document.getElementById('knob-synth');
    const level = document.getElementById('level-synth');

    if (fader && knob && level) {
      fader.style.height = '90%';
      knob.style.bottom = '90%';
      level.textContent = '0.9';
    }
  }
}

function typeText(element, text, speed) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

document.getElementById('run-demo-btn')?.addEventListener('click', runTerminalDemo);

// Init
renderDiagram();
animateFlow();
