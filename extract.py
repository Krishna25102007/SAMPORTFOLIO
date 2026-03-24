import re
import os

filepath = 'd:/Sam portfolio/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# match <style> ... </style>
css_match = re.search(r'(<style.*?)(</style>)', html, re.DOTALL)
if css_match:
    with open('d:/Sam portfolio/style.css', 'w', encoding='utf-8') as f:
        # We want to remove the <style> tags themselves from the CSS file
        inner_css = html[css_match.start(1)+len('<style>'):css_match.start(2)].strip()
        f.write(inner_css)
    html = html[:css_match.start(0)] + '<link rel="stylesheet" href="style.css" />' + html[css_match.end(0):]

# match <script> ... </script> at the end
js_match = re.search(r'(<script.*/script>)', html, re.DOTALL)
if js_match:
    with open('d:/Sam portfolio/script.js', 'w', encoding='utf-8') as f:
        inner_js = html[js_match.start(1)+len('<script>'):js_match.start(1)+len(js_match.group(1))-len('</script>')].strip()
        f.write(inner_js)
    html = html[:js_match.start(0)] + '<script src="script.js"></script>' + html[js_match.end(0):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Extraction complete.")
