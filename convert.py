import re
import os

with open('legacy_html/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
body_html = body_match.group(1) if body_match else ''

body_html = re.sub(r'<script.*?</script>', '', body_html, flags=re.DOTALL)
body_html = body_html.replace('class=', 'className=')

def style_replacer(match):
    style_str = match.group(1)
    props = []
    for prop in style_str.split(';'):
        prop = prop.strip()
        if not prop: continue
        parts = prop.split(':', 1)
        if len(parts) == 2:
            key = parts[0].strip()
            val = parts[1].strip()
            key = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), key)
            if key.startswith('--'):
                props.append(f'"{key}": "{val}"')
            else:
                props.append(f'{key}: "{val}"')
    return f'style={{{{ { ", ".join(props) } }}}}'

body_html = re.sub(r'style="([^"]*)"', style_replacer, body_html)
body_html = re.sub(r'<(img|input|br|hr)([^>]*?)(?<!/)>', r'<\1\2 />', body_html)
body_html = body_html.replace('<!--', '{/*').replace('-->', '*/}')

jsx = f'''import React, {{ useEffect }} from "react";
import "../css/body.css";
import "../css/banners.css";
import "../css/rectangles.css";
import "../css/circles.css";

export default function Dashboard() {{
  useEffect(() => {{
    if (window.SiriWave) {{
      new window.SiriWave({{
        style: "ios9",
        container: document.getElementById("container-9"),
        speed: 0.05,
        amplitude: 0.7,
      }});
      new window.SiriWave({{
        style: "ios9",
        container: document.getElementById("container-8"),
        speed: 0.05,
        amplitude: 0.7,
      }});
    }}
  }}, []);

  return (
    <>
{body_html}
    </>
  );
}}
'''

os.makedirs('src/components', exist_ok=True)
with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx)

print('Dashboard.jsx created.')
