from pypdf import PdfReader

def parse_pdf(file_name):
    reader = PdfReader(file_name)
    parsed = ''

    for page in reader.pages:
        text = page.extract_text()
        parsed += text
    
    return parsed

