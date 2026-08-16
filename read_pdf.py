import pypdf
reader = pypdf.PdfReader(r'C:\Users\gmeov\.gemini\antigravity\brain\4a726506-c6b1-4835-af16-930b95ea821e\.tempmediaStorage\d076243d9dac6ff0.pdf')
with open('pdf_text.txt', 'w', encoding='utf-8') as f:
    for page in reader.pages:
        f.write(page.extract_text() + '\n')
