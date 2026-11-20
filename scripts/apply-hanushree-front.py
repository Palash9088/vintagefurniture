#!/usr/bin/env python3
"""Put the shared Hanushree front on fixture pages.

Root pages and the copies in smartcode3vwo, smartcode3wingify, codewingify,
and abtasty. Leaves index.html, ecom, and every <head> script alone.
Page-specific body tools stay. Edit css/hanushree.css and js/hanushree-front.js
for look and events.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"index.html"}
FOLDERS = ("smartcode3vwo", "smartcode3wingify", "codewingify", "abtasty")
DEFAULT_PORTAL = "44178869"
DEFAULT_FORM = "d913a33a-71c4-4f8d-9e53-baff8487a900"
LINKS = """   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,620;1,9..144,520&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="css/hanushree.css">
"""
SCRIPT_TAG = '   <script src="js/hanushree-front.js"></script>\n'

HS_SRC = re.compile(
    r"[ \t]*<script\b[^>]*src=[\"'][^\"']*hsforms\.net/forms/embed/v2\.js[\"'][^>]*>\s*</script>\s*",
    re.I,
)
HS_CREATE = re.compile(
    r"[ \t]*<script\b[^>]*>\s*hbspt\.forms\.create\(\{.*?\}\);\s*</script>\s*",
    re.I | re.S,
)
SITE_BANNER = re.compile(r"[ \t]*<div class=\"site-banner\"[^>]*>.*?</div>\s*", re.I | re.S)
IMAGE_SECTION = re.compile(
    r"[ \t]*<div class=\"image-section\">\s*<img\b[^>]*banner\.hanu\.png[^>]*>\s*</div>\s*",
    re.I | re.S,
)
BANNER_SECTION = re.compile(r"<div class=\"banner_section\"[^>]*>.*?</div>\s*", re.I | re.S)
BODY_STYLE = re.compile(r"<style[^>]*>.*?</style>\s*", re.I | re.S)


def extract_shared(page):
    css_path = os.path.join(ROOT, "css", "hanushree.css")
    js_path = os.path.join(ROOT, "js", "hanushree-front.js")
    style = re.search(r"<style>\s*(\.hs-form-wrap \{.*)</style>", page, re.S)
    if style and ".hj {" in style.group(1):
        os.makedirs(os.path.dirname(css_path), exist_ok=True)
        with open(css_path, "w", encoding="utf-8") as handle:
            handle.write(style.group(1).strip() + "\n")
    elif not os.path.isfile(css_path):
        raise SystemExit("css/hanushree.css is missing")

    js = re.search(r"(var PIECES = \[.*?function pushDemoEvent)", page, re.S)
    if js:
        body = js.group(1)
        body = body[: body.rfind("function pushDemoEvent")].rstrip() + "\n"
        with open(js_path, "w", encoding="utf-8") as handle:
            handle.write(body)
    elif not os.path.isfile(js_path):
        raise SystemExit("js/hanushree-front.js is missing")

    shell = re.search(r"(<div class=\"hj\">.*?</footer>\s*</div>)", page, re.S)
    if not shell:
        raise SystemExit("datalayersetup.html is missing the Hanushree shell")
    return shell.group(1)


def shell_for(portal, form_id, shell, prefix):
    out = shell.replace(DEFAULT_PORTAL, portal).replace(DEFAULT_FORM, form_id)
    if prefix:
        out = out.replace('src="images/', 'src="%simages/' % prefix)
    return out


def form_ids(body):
    portals = re.findall(r'portalId:\s*["\']([^"\']+)', body)
    forms = re.findall(r'formId:\s*["\']([^"\']+)', body)
    if portals and forms:
        return portals[0], forms[0]
    return DEFAULT_PORTAL, DEFAULT_FORM


def strip_old_chrome(body):
    body = HS_SRC.sub("", body)
    body = HS_CREATE.sub("", body)
    body = SITE_BANNER.sub("", body)
    body = IMAGE_SECTION.sub("", body)

    def banner_repl(match):
        chunk = match.group(0)
        if any(token in chunk for token in ("identifyUser", 'id="b1"', "datalayer-demo", "WebToLead", "signup-form")):
            return chunk
        text = re.sub(r"<[^>]+>", "", chunk)
        text = re.sub(r"\s+", "", text)
        if len(text) < 40:
            return ""
        return chunk

    body = BANNER_SECTION.sub(banner_repl, body)

    def style_repl(match):
        css = match.group(0)
        if ".banner_section" in css and ".hj" not in css and "datalayer" not in css:
            return ""
        return css

    body = BODY_STYLE.sub(style_repl, body)
    body = re.sub(r"[ \t]*<!--\s*(?:Banner|HubSpot Form|Only keep essential JavaScript)\s*-->\s*", "", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body


def tidy(body):
    body = re.sub(r"(</footer>\s*</div>)\s*</div>", r"\1", body, count=1)
    body = re.sub(r"<div class=\"hs-form-wrap\">\s*</div>\s*", "", body)
    return body


def ensure_links(head, prefix):
    if "css/hanushree.css" not in head:
        links = LINKS.replace('href="css/', 'href="%scss/' % prefix)
        head = head.replace("</head>", "\n" + links + "</head>", 1)
    return head


def ensure_script(body, tail, prefix):
    if "js/hanushree-front.js" not in body and "js/hanushree-front.js" not in tail:
        tag = SCRIPT_TAG.replace('src="js/', 'src="%sjs/' % prefix)
        tail = tail.replace("</body>", tag + "</body>", 1)
    return tail


def transform(name, text, shell, prefix=""):
    body_at = re.search(r"<body\b[^>]*>", text, re.I)
    end_body = text.lower().rfind("</body>")
    if not body_at or end_body == -1:
        return text
    head = ensure_links(text[: body_at.end()], prefix)
    body = text[body_at.end() : end_body]
    tail = text[end_body:]
    if 'class="hj"' in body:
        body = re.sub(r"\n[ \t]*var PIECES = \[.*?\n[ \t]*function pushDemoEvent", "\n      function pushDemoEvent", body, count=1, flags=re.S)
        style = re.search(r"\n[ \t]*<style>\s*\.hs-form-wrap \{.*?</style>\n", head, re.S)
        if style and ".hj {" in style.group(0):
            head = head.replace(style.group(0), "\n", 1)
        return head + tidy(body) + ensure_script(body, tail, prefix)
    portal, form_id = form_ids(body)
    body = strip_old_chrome(body)
    piece = shell_for(portal, form_id, shell, prefix)
    if piece not in body:
        body = "\n" + piece + "\n" + body.lstrip()
    return head + tidy(body) + ensure_script(body, tail, prefix)


def main():
    source_path = os.path.join(ROOT, "datalayersetup.html")
    source = open(source_path, encoding="utf-8").read()
    shell = extract_shared(source)
    changed = []
    targets = []
    for name in sorted(os.listdir(ROOT)):
        if name.endswith(".html") and name not in SKIP:
            path = os.path.join(ROOT, name)
            if os.path.isfile(path):
                targets.append((path, ""))
    for folder in FOLDERS:
        folder_path = os.path.join(ROOT, folder)
        if not os.path.isdir(folder_path):
            continue
        for name in sorted(os.listdir(folder_path)):
            if not name.endswith(".html") or name in SKIP:
                continue
            path = os.path.join(folder_path, name)
            if os.path.isfile(path):
                targets.append((path, "../"))
    for path, prefix in targets:
        original = open(path, encoding="utf-8").read()
        updated = transform(os.path.basename(path), original, shell, prefix)
        if updated != original:
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(updated)
            changed.append(os.path.relpath(path, ROOT))
    print("updated", len(changed))
    for name in changed:
        print(name)


if __name__ == "__main__":
    main()
