
# PDF to LaTeX Converter

## Overview
The **PDF to LaTeX Converter** is a web application that allows users to upload images and PDFs, converting them into LaTeX code. The tool also compiles the LaTeX code into a downloadable or previewable PDF. It is designed for researchers, students, and professionals who work with LaTeX and need an efficient way to digitize or edit existing documents.

## Features
- Upload images or PDFs for conversion
- Extracts text and preserves formatting
- Converts mathematical equations into LaTeX syntax
- Supports tables and lists
- Generates a `.tex` file for easy editing
- Compiles LaTeX code into a PDF for download or preview

## Technologies Used
### Frontend:
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **HTML**
- **Node.js**

### Backend:
- **Python**
- **Flask**
- **Tectonic** (for LaTeX compilation)
- **Gemini AI API** (for text and equation recognition)

## Requirements
- Python 3.x
- `pdfminer.six` for text extraction
- `pytesseract` and `Pillow` for OCR (if needed)
- `Flask` for backend services
- `Tectonic` for LaTeX compilation
- `Gemini AI API` for AI-powered text extraction

### Install dependencies
```bash
pip install flask pdfminer.six pytesseract pillow tectonic
```

## Installation
### Clone the repository
```bash
git clone https://github.com/yourusername/pdf-to-latex.git
cd pdf-to-latex
```

## Usage
### Start Backend
```bash
python app.py
```

### Start Frontend
```bash
npm install
npm run dev
```

## Optional Flags
- `--ocr` : Enables OCR for scanned PDFs
- `--no-math` : Disables equation conversion
- `--verbose` : Enables detailed logging

## Output Format
The generated `.tex` file will include:
- Section headings
- Paragraphs with proper indentation
- Inline and block equations
- Tables formatted in LaTeX
- Figures with placeholders for manual insertion

Users can preview or download the compiled PDF.

## Limitations
- Complex layouts may not be perfectly converted
- Handwritten equations require OCR tuning
- Embedded images are not extracted

## Contribution
Feel free to contribute by submitting issues or pull requests.

## License
This project is licensed under the MIT License.

## Contact
For any issues or suggestions, reach out via GitHub or email at `your.email@example.com`.


