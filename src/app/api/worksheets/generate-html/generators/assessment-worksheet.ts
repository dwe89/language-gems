
export function generateAssessmentWorksheetHTML(worksheet: any, options: any = {}): string {
    console.log('🎨 [ASSESSMENT GENERATOR] Generating assessment worksheet HTML for:', worksheet.title);

    const { title, subject, topic, difficulty, content } = worksheet;
    const { task, questions } = content || {};

    // Fallback if content is missing
    if (!task || !questions) {
        return createFallbackHTML(worksheet);
    }

    const instructions = 'Read the text and answer the questions below.';

    // CSS from the template
    const css = `
    :root {
        --primary-color: #6b21a8; /* Purple */
        --border-radius: 20px;
        --padding: 15px;
        --font-family: 'Nunito', sans-serif;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: var(--font-family);
        margin: 0;
        padding: 0;
        background: #f0f0f0;
        color: #333;
    }

    .page {
        width: 210mm;
        height: 297mm;
        padding: 15mm;
        background: white;
        margin: 20px auto;
        position: relative;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        page-break-after: always;
        display: flex;
        flex-direction: column;
    }

    /* Header */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .logo img {
        height: 55px;
        width: auto;
    }

    .main-title {
        font-size: 28px;
        font-weight: 800;
        text-align: center;
        flex-grow: 1;
        color: var(--primary-color);
        line-height: 1.2;
    }

    .student-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        gap: 20px;
    }

    .info-box {
        border: 2px solid var(--primary-color);
        border-radius: 50px;
        padding: 5px 20px;
        flex: 1;
        display: flex;
        align-items: center;
        font-weight: 700;
        height: 40px;
        background: white;
    }

    .info-label {
        margin-right: 10px;
        color: var(--primary-color);
    }

    /* Section Styling */
    .section-container {
        border: 2px solid var(--primary-color);
        border-radius: var(--border-radius);
        padding: var(--padding);
        margin-bottom: 25px;
        position: relative;
        margin-top: 20px;
        background: #f9f5ff; /* Light purple tint */
    }

    .section-header {
        position: absolute;
        top: -20px;
        left: 20px;
        background: transparent; 
        padding: 0;
        z-index: 10;
    }

    .pill-header {
        background: white;
        border: 2px solid var(--primary-color);
        color: #000;
        padding: 5px 20px;
        border-radius: 50px;
        font-weight: 800;
        font-size: 16px;
        display: inline-block;
    }

    /* Reading Passage */
    .reading-passage {
        font-size: 14px;
        line-height: 1.6;
        text-align: justify;
    }
    
    .reading-passage p {
        margin-bottom: 10px;
    }
    
    .reading-passage p:last-child {
        margin-bottom: 0;
    }

    /* Questions */
    .questions-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .question-item {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px;
    }

    .question-text {
        font-weight: 700;
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .question-meta {
        font-size: 11px;
        color: #6b7280;
        text-align: right;
        margin-top: 5px;
    }

    /* Multiple Choice */
    .mc-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }

    .mc-option {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        padding: 4px;
        border: 1px solid transparent;
        border-radius: 6px;
    }
    
    .mc-checkbox {
        width: 16px;
        height: 16px;
        border: 2px solid var(--primary-color);
        border-radius: 4px;
        display: inline-block;
    }

    /* Answer Space */
    .answer-lines {
        border-bottom: 1px solid #d1d5db;
        height: 20px;
        margin-top: 5px;
        width: 100%;
    }

    .footer {
        text-align: center;
        margin-top: auto;
        padding-top: 10px;
        font-size: 10px;
        color: #666;
    }

    @media print {
        body {
            background: white;
        }

        .page {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
            width: 100%;
            height: 100%;
        }
    }
  `;

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        ${css}
    </style>
</head>
<body>
    <!-- Worksheet Page -->
    <div class="page">
        <div class="header">
            <div class="logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAMAAADHTy5XAAADAFBMVEX///99aP4JIEcJH0cJIUgKIUj9
/f5+av79/f1+af4LIkl9av57aP7Qyv8KIEf5+vsMI0uQmKgLI0rx8vQQJ036+/sVKU/v7f/P0tq7s/8O
JUv7+/zw7v8MIkkhNFj5+foTKE9qdo4eMlf29/gZLVP6+f/u6/8IH0gNJEoQJkuQgP8wQmMpPF/19ff7
/PyOfv/8+//r6P8sP2AjNlr7+v+Bbv+WiP+Mff/p5v+zucXt7vG8wMtndIwWK1Df4ecZLlLN0dk1Rman
mv/Q1NtdaoTm6OyLe/9aZ4I8TGyKeP/s7fDk5uru8PJDUnDi5OnW2uB+iJyOl6hhb4jy8/VFVHKKk6aJ
d/8dMFWZiv+2u8fa3OLr7O9OXHnz9Pby8P9ve5IOJEwMIUkaL1ScpLTg4udmc4vi3//IzdXw8fS+w82j
qrl3gZfV2N+8s/7Szf+Ccf+bjf85SWno6+7c3+SDjaC4vMiEcv+FjqJseJCGdP/o5f+hqLdpdI3T1t1k
cIg0RWZLWXassr9fbIbm4/8pO12dkf+utcFRX3pTYX2/xM6Sg/9/bf6aobE6Smm9ws33+Pn08v+wtsLB
xc/19vefprbKzteRmatgbofEyNGAbf/OyP+TnK0/T26Uh//BxtDd2f8dMVafqLeThP9UYn2Xn69/i574
+PmShv/Y0/+ekv4yRGVWZH94g5jAt/+ilf/t7P+iqbh8hpv+/v+pr70nOVyYif9zfpRIV3WBip7Jwv/u
7/KyqP/h4+gJHkWMlaepnf7e2v/49/8UKU/h3f/Fvf/GytOmrbu0q/+yt8TMxf8lOFuHkKSVna6psb5X
ZYDCu/+Uhf+rn/7d4OVLW3a/w87S1dy8tP/Uz/97hZv19P/s6f8+TmzV0f+7sf+5sf7j4f6DjaK3rv+q
sb7a1v/Tzv57Z/8mOFvo6u1reI+eprWRf/+mmf6vpf7At/6Aav729f+6v8qPl6mlrLvGvv6pnv+wpf61
usVyfZOXiv6wqP7c1v65sv62rf5da4WPgv6uo/9kujpYAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE62lU
WHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhp
SHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6
UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+
CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5h
dHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxy
ZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTEx
LTI1PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmFjNDg2MzZhLTZkZDAtNDg2OC05
Yzc3LWI5YmJmMmQ3NDJjZjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQx
Nzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5
cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2Ny
aXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9w
dXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJk
ZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCAoMjUwIHggNDAwIHB4KSAoNDAwIHggMjUw
IHB4KSAoNDAwIHggMTUwIHB4KSAtIDE8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+
CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5z
OnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+RGFuIEV0aWVu
bmU8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjph
Ym91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpD
cmVhdG9yVG9vbD5DYW52YSAoUmVuZGVyZXIpIGRvYz1EQUc1dTZMUUtRbyB1c2VyPVVBRnV0M1V2c0xn
IGJyYW5kPURhbiBFdGllbm5lJiMzOTtzIFRlYW0gdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8
L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/
Pi8ohJIAACvnSURBVHic7X0JYBTV/X8yO29mdjbOpkkE/lk2CUkgCSFLDAQwGAhyhYQQyimBQBZEkFgh
3CiBIDdyKMgRoYCC1HIJDxREfijxRoqUllpA67/aNqj91atqL+vvXTPzZnYSbSuSxv0GNtl9s29m3ud9
7+97ExERpjCFKUzfc4LX+wLCZKEbB4YRaVJUfdYXRqTpEITv7ZssXe+rCJNBUJlY2EO53lcRJoNg8cLk
39: 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" alt="SecondaryMFL">
            </div>
            <div class="main-title">${title}</div>
        </div>

        <div class="student-info">
            <div class="info-box"><span class="info-label">Name:</span></div>
            <div class="info-box"><span class="info-label">Date:</span></div>
        </div>

        <div class="section-container">
            <div class="section-header"><div class="pill-header">Reading Passage</div></div>
            <div class="reading-passage">
                ${formatReadingText(task.content)}
            </div>
        </div>

        <div class="section-container" style="flex-grow: 1;">
            <div class="section-header"><div class="pill-header">Questions</div></div>
            <div class="questions-list">
                ${generateQuestionsHTML(questions)}
            </div>
        </div>

        <div class="footer">
            © LanguageGems - Premium Language Resources
        </div>
    </div>

    <!-- Answer Key Page -->
    <div class="page">
        <div class="header">
            <div class="logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAMAAADHTy5XAAADAFBMVEX///99aP4JIEcJH0cJIUgKIUj9
/f5+av79/f1+af4LIkl9av57aP7Qyv8KIEf5+vsMI0uQmKgLI0rx8vQQJ036+/sVKU/v7f/P0tq7s/8O
JUv7+/zw7v8MIkkhNFj5+foTKE9qdo4eMlf29/gZLVP6+f/u6/8IH0gNJEoQJkuQgP8wQmMpPF/19ff7
/PyOfv/8+//r6P8sP2AjNlr7+v+Bbv+WiP+Mff/p5v+zucXt7vG8wMtndIwWK1Df4ecZLlLN0dk1Rman
mv/Q1NtdaoTm6OyLe/9aZ4I8TGyKeP/s7fDk5uru8PJDUnDi5OnW2uB+iJyOl6hhb4jy8/VFVHKKk6aJ
d/8dMFWZiv+2u8fa3OLr7O9OXHnz9Pby8P9ve5IOJEwMIUkaL1ScpLTg4udmc4vi3//IzdXw8fS+w82j
qrl3gZfV2N+8s/7Szf+Ccf+bjf85SWno6+7c3+SDjaC4vMiEcv+FjqJseJCGdP/o5f+hqLdpdI3T1t1k
cIg0RWZLWXassr9fbIbm4/8pO12dkf+utcFRX3pTYX2/xM6Sg/9/bf6aobE6Smm9ws33+Pn08v+wtsLB
xc/19vefprbKzteRmatgbofEyNGAbf/OyP+TnK0/T26Uh//BxtDd2f8dMVafqLeThP9UYn2Xn69/i574
+PmShv/Y0/+ekv4yRGVWZH94g5jAt/+ilf/t7P+iqbh8hpv+/v+pr70nOVyYif9zfpRIV3WBip7Jwv/u
7/KyqP/h4+gJHkWMlaepnf7e2v/49/8UKU/h3f/Fvf/GytOmrbu0q/+yt8TMxf8lOFuHkKSVna6psb5X
ZYDCu/+Uhf+rn/7d4OVLW3a/w87S1dy8tP/Uz/97hZv19P/s6f8+TmzV0f+7sf+5sf7j4f6DjaK3rv+q
sb7a1v/Tzv57Z/8mOFvo6u1reI+eprWRf/+mmf6vpf7At/6Aav729f+6v8qPl6mlrLvGvv6pnv+wpf61
usVyfZOXiv6wqP7c1v65sv62rf5da4WPgv6uo/9kujpYAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE62lU
WHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhp
SHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6
UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+
CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5h
dHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxy
ZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTEx
LTI1PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmFjNDg2MzZhLTZkZDAtNDg2OC05
Yzc3LWI5YmJmMmQ3NDJjZjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQx
Nzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5
cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2Ny
aXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9w
dXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJk
ZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCAoMjUwIHggNDAwIHB4KSAoNDAwIHggMjUw
IHB4KSAoNDAwIHggMTUwIHB4KSAtIDE8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+
CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5z
OnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+RGFuIEV0aWVu
bmU8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjph
Ym91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpD
cmVhdG9yVG9vbD5DYW52YSAoUmVuZGVyZXIpIGRvYz1EQUc1dTZMUUtRbyB1c2VyPVVBRnV0M1V2c0xn
IGJyYW5kPURhbiBFdGllbm5lJiMzOTtzIFRlYW0gdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8
L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/
Pi8ohJIAACvnSURBVHic7X0JYBTV/X8yO29mdjbOpkkE/lk2CUkgCSFLDAQwGAhyhYQQyimBQBZEkFgh
3CiBIDdyKMgRoYCC1HIJDxREfijxRoqUllpA67/aNqj91atqL+vvXTPzZnYSbSuSxv0GNtl9s29m3ud9
7+97ExERpjCFKUzfc4LX+wLCZKEbB4YRaVJUfdYXRqTpEITv7ZssXe+rCJNBUJlY2EO53lcRJoNg8cLk
39: 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" alt="SecondaryMFL">
            </div>
            <div class="main-title">${title} (ANSWERS)</div>
        </div>

        <div class="section-container">
            <div class="section-header"><div class="pill-header">Answer Key</div></div>
            <div class="questions-list">
                ${generateAnswerKeyHTML(questions)}
            </div>
        </div>

        <div class="footer">
            © LanguageGems - Premium Language Resources
        </div>
    </div>
</body>
</html>`;

    return html;
}

function formatReadingText(text: string): string {
    if (!text) return '';
    return text.split('\n').filter(line => line.trim() !== '').map(para => `<p>${para}</p>`).join('');
}

function generateQuestionsHTML(questions: any[]): string {
    if (!questions || questions.length === 0) return '';

    // Sort questions by number
    const sortedQuestions = [...questions].sort((a, b) => a.question_number - b.question_number);

    return sortedQuestions.map((q, index) => {
        let questionHtml = `
        <div class="question-item">
            <div class="question-text">${q.question_number}. ${q.question}</div>
    `;

        if (q.type === 'multiple-choice' && q.options) {
            questionHtml += `<div class="mc-options">`;
            q.options.forEach((option: string, optIndex: number) => {
                const letter = String.fromCharCode(65 + optIndex);
                questionHtml += `
            <div class="mc-option">
                <div class="mc-checkbox"></div>
                <strong>${letter}.</strong> ${option}
            </div>
        `;
            });
            questionHtml += `</div>`;
        } else {
            // Short answer / Open response
            questionHtml += `<div class="answer-lines"></div>`;
            if (q.points > 1) {
                questionHtml += `<div class="answer-lines"></div>`;
            }
        }

        questionHtml += `
            <div class="question-meta">[${q.points} mark${q.points !== 1 ? 's' : ''}]</div>
        </div>
    `;

        return questionHtml;
    }).join('');
}

function generateAnswerKeyHTML(questions: any[]): string {
    if (!questions || questions.length === 0) return '';

    const sortedQuestions = [...questions].sort((a, b) => a.question_number - b.question_number);

    return sortedQuestions.map(q => {
        let answerText = '';
        if (typeof q.correct_answer === 'string') {
            answerText = q.correct_answer;
        } else if (Array.isArray(q.correct_answer)) {
            answerText = q.correct_answer.join(' OR ');
        } else {
            answerText = JSON.stringify(q.correct_answer);
        }

        return `
            <div class="question-item" style="background: #fef2f2; border-color: #fee2e2;">
                <div class="question-text" style="color: #991b1b;">${q.question_number}. ${answerText}</div>
                ${q.explanation ? `<div style="font-size: 12px; color: #666; font-style: italic;">Note: ${q.explanation}</div>` : ''}
            </div>
        `;
    }).join('');
}

function createFallbackHTML(worksheet: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${worksheet.title}</title>
</head>
<body>
    <h1>Error generating worksheet</h1>
    <p>Could not load content.</p>
</body>
</html>`;
}
