import fitz
import urllib.request
import os

pdf_url = "https://www.mlit.go.jp/road/sign/sign/douro/ichiran.pdf"
pdf_path = "ichiran.pdf"
images_dir = "images"

if not os.path.exists(images_dir):
    os.makedirs(images_dir)

print("Downloading PDF...")
urllib.request.urlretrieve(pdf_url, pdf_path)

print("Opening PDF...")
doc = fitz.open(pdf_path)

# 規制標識 (Regulatory signs) are usually on page 2 or 3 of this MLIT PDF.
# Let's render the first 4 pages and save them to see where the signs are.
for i in range(min(4, len(doc))):
    page = doc.load_page(i)
    pix = page.get_pixmap(dpi=150)
    pix.save(f"{images_dir}/page_{i}.png")
    
print("Saved pages as images.")
doc.close()
