# Lead Scorer Backend

A backend service that accepts product/offer information and a CSV of leads, then scores each lead's buying intent (High / Medium / Low) using **rule-based logic + AI reasoning**.

---

## 🚀 Features

- Upload product offers and leads
- Rule-based scoring (role, industry, data completeness)
- AI-based scoring with explanations
- Combined scoring with intent labels
- JSON & CSV export of results
- Dockerized for deployment
- Unit tests for rule layer scoring

---

## ⚙️ Setup Steps

1. **Clone the repo**

```bash
git clone https://github.com/NandishM0618/lead-scorer.git
cd lead-scorer
```

2. **Install dependencies**

```bash
npm install
```

3. **Set environment variables**

Create a `.env` file:

```
PORT=4000
GEMINI_API_KEY=your_openai_or_gemini_api_key
```

4. **Run the server**

```bash
npm run dev
```

Server will start on **[http://localhost:4000](http://localhost:4000)**

---

## 📌 API Usage Examples

### 1. Add Product/Offer

`POST /offer`

```bash
curl -X POST http://localhost:4000/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Outreach Automation",
    "value_props": ["24/7 outreach", "6x more meetings"],
    "ideal_use_cases": ["B2B SaaS mid-market"]
  }'
```

### 2. Upload Leads CSV

`POST /leads/upload`

```bash
curl -X POST http://localhost:4000/leads/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@leads.csv"
```

CSV format:

```
name,role,company,industry,location,linkedin_bio
Ava Patel,Head of Growth,FlowMetrics,SaaS,NY,"10+ yrs in SaaS growth"
```

### 3. Run Scoring

`POST /score`

```bash
curl -X POST http://localhost:4000/score
```

### 4. Get Results (JSON)

`GET /results`

```bash
curl http://localhost:4000/results
```

Response:

```json
[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 85,
    "reasoning": "Fits ICP SaaS mid-market and role is decision maker."
  }
]
```

### 5. Export Results (CSV)

`GET /results/csv`

```bash
curl -o results.csv http://localhost:4000/results/csv
```

---

## 🧮 Rule Logic

- **Role relevance**

  - Decision maker → +20
  - Influencer → +10
  - Else → 0

- **Industry match**

  - Exact ICP → +20
  - Adjacent → +10
  - Else → 0

- **Data completeness**

  - All fields present → +10

➡️ **Max Rule Score = 50**

---

## 🤖 AI Layer

We send the **offer details** + **lead details** to AI (OpenAI GPT-4o-mini or Gemini).
Prompt used:

```
You are a B2B sales assistant.

Product offer:
{offer}

Lead:
{lead}

Task:
Classify buying intent as High, Medium, or Low and explain in 1 - 2 short sentences.
Return ONLY a single, raw JSON object. DO NOT include ANY text, markdown formatting (like triple backticks), or conversational filler outside of the JSON object itself.
The values for 'intent' and 'explanation' must be contained on a single line.
JSON schema: {"intent" : "High|Medium|Low", "explanation":"..."}
```

- High → 50
- Medium → 30
- Low → 10

➡️ **Final Score = Rule Score + AI Points (0–100)**

---

## 🧪 Bonus Features

- ✅ Exported results as CSV
- ✅ Unit tests for rule layer (Jest)
- ✅ Dockerized service

### Docker commands

```bash
docker build -t lead-scorer .
docker run -p 4000:4000 --env-file .env lead-scorer
```

## 📹 Loom Demo
[Demo video](https://www.loom.com/share/4c469b10c17a44ada0d101dd79538a1b?sid=803cb5de-a989-4590-a54a-d969006707b2)

## 🌐 Public Web URL
[Live URL](https://backend-lead-scorer-5q5x.onrender.com/)
