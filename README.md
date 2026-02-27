🌱 Sustainable Commerce AI
==========================

**Applied AI for Sustainable E-Commerce Automation**

🚀 Executive Summary
--------------------

Sustainable Commerce AI is a full-stack AI-powered platform designed to automate catalog management and environmental impact communication for eco-friendly e-commerce brands.

The system combines deterministic business logic with structured AI outputs to reduce manual effort, ensure consistent sustainability tagging, and generate measurable impact reporting — all within a clean, production-ready architecture.

### ✅ Implemented Modules

*   Module 1 – AI Auto-Category & Tag Generator
    
*   Module 3 – AI Impact Reporting Generator
    

The remaining modules are architected and outlined for scalable future implementation.

🧩 Business Problem
-------------------

Sustainable e-commerce platforms face three major operational challenges:

1.  Manual product categorization is slow and inconsistent.
    
2.  Sustainability filters and SEO tags lack standardization.
    
3.  Environmental impact communication is often vague or not quantified.
    

These inefficiencies reduce scalability, hurt search visibility, and weaken customer trust.

💡 Solution Overview
--------------------

This project integrates structured AI with deterministic backend logic to automate catalog intelligence and impact reporting.

### Core Design Principles

*   AI outputs must be structured JSON.
    
*   Business logic must remain deterministic and auditable.
    
*   AI is used only where probabilistic reasoning adds value.
    
*   Every AI interaction must be logged for transparency.
    

This ensures production safety, scalability, and reliability.

🏗 System Architecture
----------------------
```
[ React + Vite Frontend ]
            ↓
[ Express Controller Layer ]
            ↓
[ Business Logic Services ]
            ↓
[ AI Service (Google Gemini) ]
            ↓
[ JSON Validation Layer ]
            ↓
[ Firebase Firestore ]
            ↓
[ Structured Response to Client ]
```

🔹 Frontend
-----------

*   React + Vite Single Page Application
    
*   Tailwind CSS responsive UI
    
*   REST API communication with backend
    

🔹 Backend
----------

*   Node.js + Express
    
*   Modular architecture (controllers, services, routes)
    
*   Centralized error middleware
    
*   Stateless design for horizontal scalability
    

🔹 AI Integration
-----------------

*   Google Gemini via @google/genai
    
*   Strict responseSchema enforcement
    
*   Automatic retry (up to 2 attempts)
    
*   Deterministic validation before database persistence
    

🔹 Database
-----------

*   Firebase Firestore
    

Collections:

*   products
    
*   impact\_reports
    
*   ai\_logs
    

🧠 Implemented Modules
======================

✅ Module 1: AI Auto-Category & Tag Generator
--------------------------------------------

### Input

*   Product name
    
*   Product description
    

### Structured Output Example
```json
{
  "primary_category": "Kitchenware",
  "sub_category": "Reusable Cutlery",
  "seo_tags": [
    "bamboo cutlery",
    "plastic free dining",
    "eco travel utensils",
    "zero waste kitchen",
    "sustainable utensils"
  ],
  "sustainability_filters": [
    "plastic-free",
    "compostable",
    "reusable"
  ],
  "eco_score": 8
} 
```

### Features

*   Predefined allowed categories
    
*   Sustainability filter validation
    
*   Schema-level AI constraints
    
*   Automatic retry for malformed responses
    
*   Firestore persistence
    
*   Complete AI prompt and response logging
    

This module reduces manual catalog effort and improves SEO consistency.

✅ Module 3: AI Impact Reporting Generator
-----------------------------------------

### Deterministic Business Logic

*   Plastic saved = quantity × predefined material savings
    
*   Carbon avoided = rule-based emissions calculation
    
*   Local sourcing multiplier applied
    

All numeric calculations are performed in backend services.

### AI Role

AI converts calculated sustainability metrics into a clear, human-readable impact statement.

### Structured Output Example
```json
{
  "plastic_saved_grams": 240,
  "carbon_avoided_kg": 1.2,
  "local_sourcing_bonus": true,
  "impact_statement": "By choosing this reusable bamboo cutlery set, you prevented 240 grams of plastic waste and avoided 1.2 kg of carbon emissions."
}
```

### Design Philosophy

Numeric metrics remain deterministic and verifiable.AI is used only for contextual storytelling.

🔎 JSON Validation Strategy
---------------------------

Before storing AI output:

*   Validate primary\_category against allowed list
    
*   Validate sustainability\_filters
    
*   Validate eco\_score range
    
*   Retry up to 2 times if invalid
    
*   Return structured error if validation fails
    

This prevents corrupted or hallucinated data from entering the database.

📝 Logging Strategy
-------------------

Each AI interaction logs:

*   Module name
    
*   Prompt sent
    
*   Raw AI response
    
*   Timestamp
    
*   Status (success or failed)
    

Logs are stored in the ai\_logs collection to enable:

*   Debugging
    
*   Monitoring AI reliability
    
*   Auditability
    
*   Future analytics
    

🔐 Security & Environment Management
------------------------------------

*   dotenv for environment configuration
    
*   GEMINI\_API\_KEY stored securely in environment variables
    
*   FIREBASE\_CONFIG stored as environment JSON
    
*   Centralized error handling middleware
    
*   Input validation before AI calls
    
*   CORS configuration
    

Sensitive credentials are never committed to source code.

📈 Scalability Considerations
-----------------------------

*   Stateless backend architecture
    
*   Clear separation of concerns
    
*   Modular service design
    
*   Non-blocking asynchronous AI calls
    
*   Easily deployable to cloud platforms
    

The system is designed to scale horizontally as usage increases.

🧱 Remaining Modules Architecture Outline
=========================================

🟦 Module 2: AI B2B Proposal Generator
--------------------------------------

**Objective:** Generate sustainable bulk purchase proposals within a provided budget.

### Planned Architecture Flow

1.  Input: budget + sustainability preference
    
2.  Filter catalog for eligible sustainable products
    
3.  Allocate budget proportionally
    
4.  Calculate estimated cost breakdown
    
5.  AI generates impact positioning summary
    
6.  Return structured JSON output
    
7.  Store proposal in Firestore
    

AI generates positioning language, while pricing logic remains deterministic.

🟦 Module 4: AI WhatsApp Support Bot
------------------------------------

**Objective:** Automate customer queries via WhatsApp.

### Planned Architecture Flow

1.  WhatsApp webhook (e.g., Twilio) receives message
    
2.  Intent classification (order status / return / refund)
    
3.  Query Firestore for order details
    
4.  AI generates contextual response
    
5.  Escalate high-priority cases
    
6.  Log conversation in ai\_logs
    

AI handles language generation, while order logic remains database-driven.

🛠 Installation
===============
```
git clone <repository-url>
npm install
```

▶ Run Locally
=============

1.  Create .env file with required variables:
    
    *   GEMINI\_API\_KEY
        
    *   FIREBASE\_CONFIG
        
    *   PORT (optional)
        
2.  Start development server:
    
```
npm run dev   
```

Access the application at:

[http://localhost:3000](http://localhost:3000)

🚀 Deployment
=============

```  
npm run build
npm start
```
Set environment variable:

NODE\_ENV=production

The server automatically serves the built frontend from the dist folder.

🎬 Demo Walkthrough
===================

1.  Navigate to **Product AI**
    
2.  Enter product name and description
    
3.  Generate structured metadata
    
4.  Verify Firestore product entry
    
5.  Navigate to **Impact AI**
    
6.  Enter order quantity and sourcing preference
    
7.  Generate calculated metrics and AI statement
    
8.  Verify logged AI interaction in database
    

🏆 Why This Project Stands Out
==============================

*   Structured AI outputs (not free-text prompting)
    
*   Deterministic sustainability calculations
    
*   Production-grade validation layer
    
*   AI retry and error handling system
    
*   Prompt and response logging
    
*   Clean, scalable architecture
    
*   Clear separation of AI and business logic
    

This project demonstrates practical AI integration grounded in real business logic — purpose-built for sustainable commerce platforms operating at scale.