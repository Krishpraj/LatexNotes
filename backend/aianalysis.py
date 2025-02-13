from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google import genai
from PIL import Image
import io
import os
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS

# Use an environment variable for security
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBro6NN2uS-6QM79dlxEKXAV9ORTsdtTc8")
client = genai.Client(api_key=API_KEY)

@app.route('/generate-latex-notes', methods=['POST'])
def generate_latex_notes():
    try:
        # Check if an image is provided
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        # Read and process image
        image_file = request.files['image']
        image = Image.open(io.BytesIO(image_file.read()))
        print("Image received and opened successfully")

        # Get the optional prompt
        prompt = r"""Convert this image to LaTeX notes for Overleaf. The LaTeX text below is the basic template I want to format my notes. Make sure formatting is readable and correct. Do accordingly: start with \documentclass[a4paper,12pt]{article}. You can use nodes for diagrams and circuits. This is the basic template. DO NOT USE ALL OF IT. Only use what's necessary from the image. Ensure diagrams and text are unchanged from the image, just formatted better, neater, for university publication. ONLY INCLUDE CODE, NO COMMENTS:
\documentclass[a4paper,12pt]{article}
\usepackage{xcolor, amsmath, amssymb, amsthm, graphicx, hyperref, fancyhdr, titlesec}

% Define colors
\definecolor{titlecolor}{RGB}{0, 102, 204} % Dark blue for title
\definecolor{sectioncolor}{RGB}{204, 51, 0} % Dark red for sections
\definecolor{examplecolor}{RGB}{0, 153, 76} % Dark green for examples
\definecolor{headercolor}{RGB}{50, 50, 50} % Dark gray for headers

% Page setup
\usepackage[a4paper, margin=1in]{geometry}
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{1pt}
\lhead{\color{headercolor} \textbf{Project Notes}}
\rhead{\color{headercolor} \textbf{\thepage}}
\cfoot{\color{headercolor} \textbf{\thepage}}

% Section formatting
\titleformat{\section}{\color{sectioncolor}\Large\bfseries}{\thesection}{1em}{}
\titleformat{\subsection}{\color{examplecolor}\large\bfseries}{\thesubsection}{1em}{}

\begin{document}

% Title
{\color{titlecolor} \huge \textbf{Project Title}} \\
{\large \textit{Author Name}} \\
{\today}\\
\hrule \vspace{1em}

\tableofcontents
\newpage

\section*{Abstract}
Write a brief summary of your project here.

\section{Introduction}
Introduce the main topics and objectives of your project.

\section{Main Concepts}

\subsection{Definitions}
\textbf{Definition.} A formal definition of a concept relevant to your project. 

\subsection{Examples}
{\color{examplecolor} \textbf{Example.}} Here is an illustrative example.

\begin{center}
    \includegraphics[width=0.4\textwidth]{example.png}
\end{center}

\subsection{Theorems and Proofs}
\textbf{Theorem 1.} A key theorem related to your topic.

\textbf{Proof.} The proof of the theorem goes here. \qed

\section{Results and Discussion}
Discuss findings, observations, and interpretations.

\section{Conclusion}
Summarize key points and potential future directions.

\section*{References}
List any references here using \textbackslash cite if necessary.

\end{document}
""" 
        print(f"Prompt received: {prompt}")

        # Generate content using Gemini AI
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt, image]
        )
        print("Content generated successfully")

        # Extract response text
        ai_response = response.text if hasattr(response, "text") else "No response generated."
        print(f"AI Response: {ai_response}")

        # Remove the first line of the AI response
        ai_response_lines = ai_response.split('\n')
        ai_response = '\n'.join(ai_response_lines[1:])

        # Save LaTeX content to a .tex file
        tex_file_path = "output.tex"
        with open(tex_file_path, "w") as tex_file:
            tex_file.write(ai_response)

        # Compile the .tex file to PDF using Tectonic
        try:
            result = subprocess.run(["tectonic", tex_file_path], check=True, capture_output=True, text=True)
            print(f"Tectonic output: {result.stdout}")
            pdf_file_path = "output.pdf"
            return jsonify({"latex_code": ai_response, "pdf_url": pdf_file_path})
        except FileNotFoundError:
            print("Tectonic is not installed or not found in the system PATH.")
            return jsonify({"error": "Tectonic is not installed or not found in the system PATH."}), 500
        except subprocess.CalledProcessError as e:
            print(f"Error compiling LaTeX: {e.stderr}")
            return jsonify({"error": "Error compiling LaTeX", "details": e.stderr}), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/pdf/<path:filename>', methods=['GET'])
def get_pdf(filename):
    try:
        return send_file(filename, as_attachment=False)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)