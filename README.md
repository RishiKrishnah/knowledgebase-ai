# KnowledgeBase AI

### Intelligent Knowledge Management, Retrieval-Augmented Generation & Database Querying Platform

[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Language](https://img.shields.io/badge/Backend-Python%203.10+-3776AB?logo=python)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)](https://www.postgresql.org/)
[![Vector%20Database](https://img.shields.io/badge/Vector%20DB-Qdrant-8A2BE2)](https://qdrant.tech/)
[![LLM](https://img.shields.io/badge/LLM-OpenRouter-5A4FCF)](https://openrouter.ai/)
[![Embeddings](https://img.shields.io/badge/Embeddings-Hugging%20Face-FFB000?logo=huggingface)](https://huggingface.co/)
[![Deployment](https://img.shields.io/badge/Deployment-Render-46E3B7?logo=render)](https://render.com/)

> A production-oriented AI knowledge platform that combines conversational AI, document-grounded RAG, semantic search, and natural-language database querying through a unified interface.

**Live Application:** https://knowledgebase-frontend-4l5n.onrender.com/  
**Repository:** https://github.com/RishiKrishnah/knowledgebase-ai

---

## Overview

KnowledgeBase AI is an AI-powered knowledge management platform designed to provide a single conversational interface over both **unstructured knowledge** and **structured database information**.

Instead of forcing users to decide where information lives, the platform dynamically classifies each question into one of three execution paths:

- **CHAT** — general conversation, technical questions, writing assistance, and general knowledge.
- **DOCUMENT** — questions that should be answered using uploaded or indexed documents through semantic retrieval and RAG.
- **DATABASE** — questions requiring actual records, filtering, aggregation, calculations, or structured data retrieval from a connected PostgreSQL database.

This architecture allows the same conversational interface to answer questions such as:

```text
"Explain what machine learning is."
        ↓
      CHAT
```

```text
"What is the minimum attendance requirement?"
        ↓
    DOCUMENT
        ↓
Semantic retrieval → Relevant chunks → RAG → Grounded answer
```

```text
"Which students have attendance below 75%?"
        ↓
    DATABASE
        ↓
Schema retrieval → SQL generation → SQL validation → Query execution
```

The intent router explicitly distinguishes document-based policies and knowledge from questions requiring actual structured records.

---

# Key Capabilities

## 1. Intelligent Intent Routing

Every chat question is classified into exactly one of three intents:

| Intent | Purpose |
|---|---|
| `CHAT` | General conversation, explanations, coding, mathematics, writing, brainstorming, etc. |
| `DOCUMENT` | Questions answered from uploaded or indexed knowledge |
| `DATABASE` | Questions requiring structured database records or calculations |

The router uses explicit classification rules to distinguish:

> **"What is the attendance policy?"** → `DOCUMENT`

from:

> **"What is John's attendance?"** → `DATABASE`

This prevents every question from being treated as a generic LLM request and allows each question to follow the appropriate processing pipeline.

---

# 2. Retrieval-Augmented Generation

The document intelligence pipeline follows a standard RAG architecture:

```text
User Question
      │
      ▼
Intent Classification
      │
      ▼
DOCUMENT
      │
      ▼
Query Embedding
      │
      ▼
Qdrant Semantic Search
      │
      ▼
Relevant Document Chunks
      │
      ▼
Context Construction
      │
      ▼
RAG Prompt
      │
      ▼
LLM Generation
      │
      ▼
Grounded Answer
```

The retrieval layer generates an embedding for the user query and searches Qdrant for the highest-scoring chunks. Knowledge-base filtering can be applied during retrieval.

The RAG prompt explicitly instructs the model to use only supplied context and avoid inventing information.

---

# 3. Multi-Format Document Ingestion

The platform currently accepts:

- PDF
- DOCX
- TXT
- CSV
- XLSX

Uploaded files are validated before ingestion, with a maximum upload size of **20 MB**.

The ingestion pipeline is:

```text
Upload
  │
  ▼
File Validation
  │
  ▼
Text Extraction
  │
  ▼
Chunking
  │
  ▼
Embedding Generation
  │
  ▼
Qdrant Vector Storage
  │
  ▼
PostgreSQL Metadata Storage
  │
  ▼
Document Ready
```

The current parser contains dedicated extraction logic for PDF, DOCX, TXT, CSV, and XLSX files.

Documents are divided into overlapping chunks before embeddings are generated. The current chunker uses a 1200-character chunk size with 200-character overlap.

---

# 4. Semantic Search

Knowledge bases can be searched using semantic rather than purely lexical matching.

The search pipeline uses:

```text
Question
   │
   ▼
BAAI/bge-small-en-v1.5
   │
   ▼
384-dimensional embedding
   │
   ▼
Qdrant
   │
   ▼
Top matching chunks
```

The current embedding implementation uses the Hugging Face inference service with:

`BAAI/bge-small-en-v1.5`

The Qdrant collection used for document chunks is:

```text
knowledge_chunks
```

and supports filtering using `knowledge_base_id`.

---

# 5. Knowledge Base Management

Knowledge bases provide logical separation between different document collections.

Users can:

- Create knowledge bases
- List knowledge bases
- View individual knowledge bases
- Update knowledge base names and descriptions
- Delete non-default knowledge bases
- Upload documents into a selected knowledge base
- Search within a selected knowledge base

Each knowledge base exposes its associated document count.

The platform also maintains a protected:

```text
Default Knowledge Base
```

which cannot be deleted.

---

# 6. Document Lifecycle Management

Uploaded documents are represented in PostgreSQL and linked to their source knowledge base.

A document tracks:

```text
filename
file type
MIME type
file size
processing status
processing stage
creation timestamp
```

The document processing lifecycle includes:

```text
uploaded
   ↓
extracting
   ↓
chunking
   ↓
embedding
   ↓
storing
   ↓
completed
```

Failures are recorded as:

```text
status = failed
processing_stage = failed
```

The underlying Qdrant vectors are also associated with individual document chunks, allowing document-level cleanup.

Documents can be deleted through the API. Deletion removes:

1. Qdrant vectors
2. Any stored file
3. PostgreSQL document records
4. Associated chunks through relational cascading



---

# 7. Natural-Language Database Querying

KnowledgeBase AI also supports querying structured PostgreSQL data using natural language.

The architecture is:

```text
User Question
      │
      ▼
DATABASE Intent
      │
      ▼
Database Schema Retrieval
      │
      ▼
LLM SQL Generation
      │
      ▼
SQL Validation
      │
      ▼
PostgreSQL Execution
      │
      ▼
Result Rows
      │
      ▼
Natural-Language Response
```

The database agent performs these steps programmatically:

1. Retrieve relevant database schema information.
2. Generate SQL from the user's question and retrieved schema.
3. Validate the generated SQL.
4. Connect to the registered PostgreSQL database.
5. Execute the validated query.
6. Return the result for natural-language response generation.



---

# 8. SQL Safety Layer

Generated SQL is not executed blindly.

The platform uses `sqlglot` to parse and validate generated SQL.

The validator rejects dangerous operations including:

```text
INSERT
UPDATE
DELETE
DROP
ALTER
CREATE
TRUNCATE
MERGE
GRANT
REVOKE
```

Multiple SQL statements are also rejected, and only `SELECT` / `WITH` queries are accepted.

This creates an explicit safety boundary between LLM-generated SQL and database execution.

---

# 9. Database Connection Management

The platform provides a database connection management interface and backend service for registering PostgreSQL connections.

Supported connection attributes include:

```text
Name
Database Type
Host
Port
Database Name
Username
Password
Active Status
```

The database connection layer currently supports PostgreSQL connections and creates SQLAlchemy engines with connection health checks enabled.

---

# 10. Persistent Chat Sessions

Conversation history is persisted in PostgreSQL rather than relying only on in-memory state.

The backend stores:

```text
Chat Session
    │
    ├── User
    ├── Knowledge Base
    └── Messages
            ├── User message
            ├── Intent
            ├── Assistant response
            └── Timestamp
```

The current message model stores the detected intent for user messages.

The session API exposes historical messages, including their persisted intent metadata.

This means historical conversations can be reconstructed from the database rather than being dependent on a browser session.

---

# 11. Real-Time Dashboard

The frontend includes a dashboard backed by real API data.

Current dashboard statistics include:

- Knowledge bases
- Documents
- Database connections
- Chat sessions

The backend also aggregates recent activity across:

- Document uploads
- Knowledge base creation
- Chat sessions
- Database connections



---

# 12. Modern Web Interface

The frontend is built using Next.js and TypeScript, with the application organized into dedicated sections for:

```text
Dashboard
AI Chat
Knowledge Bases
Database Connections
Semantic Search
Upload Documents
Settings
```



The frontend uses:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- React Query
- React Markdown
- Radix UI / shadcn-style components
- Lucide icons

The current `package.json` confirms the frontend stack and package versions.

---

# Architecture

## High-Level Architecture

```text
                         ┌────────────────────────────┐
                         │        Next.js UI          │
                         │      TypeScript / React    │
                         └─────────────┬──────────────┘
                                       │
                                       │ HTTP / REST
                                       ▼
                         ┌────────────────────────────┐
                         │          FastAPI           │
                         │       Application API      │
                         └─────────────┬──────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             ┌─────────────┐   ┌──────────────┐   ┌─────────────┐
             │ PostgreSQL  │   │    Qdrant    │   │ OpenRouter  │
             │  Metadata   │   │ Vector Store │   │     LLM     │
             └─────────────┘   └──────────────┘   └─────────────┘
                    │                  │
                    │                  │
                    ▼                  ▼
             Sessions, KBs,      Semantic Retrieval
             Messages, Docs      & Schema Retrieval
                                       │
                                       ▼
                               ┌─────────────────┐
                               │ Hugging Face    │
                               │ Embeddings      │
                               │ BGE-small-en    │
                               └─────────────────┘
```

---

# Request Processing Architecture

## Chat Request

```text
                    ┌─────────────────┐
                    │   User Question │
                    └────────┬────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Intent Router     │
                  └──────────┬───────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
        CHAT             DOCUMENT          DATABASE
           │                 │                 │
           ▼                 ▼                 ▼
   Conversation LLM      Semantic RAG      Database Agent
                             │                 │
                             │                 ▼
                             │            Schema Retrieval
                             │                 │
                             │                 ▼
                             │            SQL Generation
                             │                 │
                             │                 ▼
                             │            SQL Validation
                             │                 │
                             │                 ▼
                             │          PostgreSQL Query
                             │                 │
                             └────────┬────────┘
                                      ▼
                             Natural-Language Answer
                                      │
                                      ▼
                              Persisted Chat Message
```

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js 16.2.9 | Web application framework |
| React 19.2.4 | UI framework |
| TypeScript | Type-safe frontend development |
| Tailwind CSS 4 | Styling |
| Zustand | Client-side state management |
| Axios | HTTP client |
| React Query | Server-state management |
| React Markdown | Markdown rendering |
| Lucide React | UI icons |
| Radix UI / shadcn | Interface components |



## Backend

| Technology | Purpose |
|---|---|
| Python | Application language |
| FastAPI | REST API framework |
| SQLAlchemy | ORM / database abstraction |
| Pydantic | Request and response validation |
| Alembic | Database migrations |
| Uvicorn | ASGI server |
| SQLGlot | SQL parsing and validation |

The current backend dependency set is defined in `backend/requirements.txt`.

## Data & AI Infrastructure

| Component | Technology |
|---|---|
| Relational database | PostgreSQL |
| Vector database | Qdrant |
| Embedding model | BAAI/bge-small-en-v1.5 |
| Embedding provider | Hugging Face Inference |
| LLM provider | OpenRouter |
| Current LLM | Google Gemini 2.5 Flash through OpenRouter |

The LLM provider implementation currently targets `google/gemini-2.5-flash`.

---

# Project Structure

```text
knowledgebase-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── chat.py
│   │   │       ├── connections.py
│   │   │       ├── dashboard.py
│   │   │       ├── documents.py
│   │   │       ├── knowledge_bases.py
│   │   │       ├── search.py
│   │   │       └── sessions.py
│   │   │
│   │   ├── models/
│   │   │   ├── chat_session.py
│   │   │   ├── chunk.py
│   │   │   ├── database_connection.py
│   │   │   ├── document.py
│   │   │   ├── knowledge_base.py
│   │   │   ├── message.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── chat/
│   │   │   ├── conversation/
│   │   │   ├── database/
│   │   │   ├── embeddings/
│   │   │   ├── ingestion/
│   │   │   ├── llm/
│   │   │   ├── retrieval/
│   │   │   ├── router/
│   │   │   └── sql/
│   │   │
│   │   ├── schemas/
│   │   └── core/
│   │
│   ├── alembic/
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── chat/
│   │   │   ├── connections/
│   │   │   ├── knowledge/
│   │   │   ├── search/
│   │   │   ├── settings/
│   │   │   └── upload/
│   │   └── ...
│   │
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   └── package.json
│
├── docker-compose.yml
├── render.yaml
├── import_schooldb.py
├── project_prompt_generator.py
└── README.md
```

The repository currently contains dedicated backend services for routing, retrieval, embeddings, document ingestion, SQL processing, database integration, and conversational AI.

---

# API Overview

## Chat

### `POST /chat`

Processes a user question through the intent router and returns the selected intent plus generated answer.

Example:

```json
{
  "session_id": "SESSION_UUID",
  "question": "How many students are enrolled in CS101?"
}
```

Response:

```json
{
  "intent": "DATABASE",
  "answer": "There are 42 students enrolled in CS101."
}
```

The current chat route performs intent classification, selects the appropriate execution path, persists the user message and generated response, and returns the classified intent.

---

## Sessions

### `POST /sessions`

Creates a chat session.

### `GET /sessions`

Returns historical sessions.

### `GET /sessions/{session_id}/messages`

Returns all messages associated with a session, including persisted intent metadata.

---

## Documents

### `POST /documents/upload`

Uploads and ingests:

```text
.pdf
.docx
.txt
.csv
.xlsx
```

### `GET /documents`

Lists uploaded documents.

### `DELETE /documents/{document_id}`

Deletes a document and associated vector data.

---

## Knowledge Bases

### `GET /knowledge-bases`

List knowledge bases.

### `GET /knowledge-bases/{knowledge_base_id}`

Retrieve a specific knowledge base.

### `POST /knowledge-bases`

Create a knowledge base.

### `PATCH /knowledge-bases/{knowledge_base_id}`

Update a knowledge base.

### `DELETE /knowledge-bases/{knowledge_base_id}`

Delete a non-default knowledge base.

---

## Semantic Search

### `POST /search`

Performs vector-based semantic search against the selected knowledge base.

Example:

```json
{
  "question": "What is the minimum attendance requirement?"
}
```

---

## Database Connections

### `GET /connections`

List registered connections.

### `POST /connections`

Register a PostgreSQL database.

### `PATCH /connections/{connection_id}`

Update a connection.

### `DELETE /connections/{connection_id}`

Delete a connection.

---

## Dashboard

### `GET /dashboard/summary`

Returns:

```text
Knowledge base count
Document count
Database connection count
Chat count
Recent activity
```

---

## Health

### `GET /health`

Returns backend service health information.

Example:

```json
{
  "status": "healthy",
  "service": "knowledgebase-backend"
}
```



---

# Local Development

## Prerequisites

Install:

- Python 3.10+
- Node.js
- npm
- PostgreSQL
- Qdrant
- Git

For local development, the repository also provides Docker Compose configuration for PostgreSQL, Redis, and Qdrant.

---

## 1. Clone the Repository

```bash
git clone https://github.com/RishiKrishnah/knowledgebase-ai.git

cd knowledgebase-ai
```

---

# 2. Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 3. Backend Environment Variables

Create:

```text
backend/.env
```

Required configuration:

```env
DATABASE_URL=your_postgresql_connection_string

QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key

OPENROUTER_API_KEY=your_openrouter_api_key

HF_TOKEN=your_huggingface_token

JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

FRONTEND_ORIGIN=http://localhost:3000

UPLOAD_DIRECTORY=/tmp/knowledgebase-uploads
```

The backend settings model defines database, Qdrant, OpenRouter, JWT, CORS, and upload configuration.

> Never commit `.env` files, API keys, database credentials, or other secrets to Git.

---

# 4. Start the Backend

From:

```text
backend/
```

run:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 5. Frontend Setup

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Set the backend URL:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

# Docker Development

The repository includes:

```text
docker-compose.yml
```

with local services for:

```text
PostgreSQL
Redis
Qdrant
```

Example:

```bash
docker compose up -d
```

The current Compose configuration exposes PostgreSQL on `5432`, Redis on `6379`, and Qdrant on `6333` / `6334`.

---

# Production Deployment

The repository contains a `render.yaml` configuration for deploying the frontend and backend to Render.

## Backend

Current production configuration includes:

```text
Runtime: Python
Region: Singapore
Plan: Free
Health Check: /health
Server: Uvicorn
```

The deployment expects externally configured:

```text
DATABASE_URL
QDRANT_URL
QDRANT_API_KEY
OPENROUTER_API_KEY
```

and generates a JWT secret through Render configuration.

## Frontend

The frontend is configured as a separate Render web service using:

```text
Runtime: Node
Build: npm ci --include=dev && npm run build
Start: npm start
```

and communicates with the deployed backend through:

```text
NEXT_PUBLIC_API_URL
```



---

# Data Model

At the relational layer, the platform currently models:

```text
User
 │
 ├── KnowledgeBase
 │      │
 │      ├── Document
 │      │      └── Chunk
 │      │
 │      └── ChatSession
 │             └── Message
 │
 └── ChatSession
```

A separate model represents registered database connections.

The current Alembic schema includes:

```text
users
knowledge_bases
chat_sessions
documents
chunks
messages
database_connections
```



---

# Vector Data Model

Document chunks stored in Qdrant include payload metadata such as:

```json
{
  "text": "...",
  "document_id": "...",
  "knowledge_base_id": "...",
  "filename": "...",
  "chunk_index": 0
}
```

This metadata makes it possible to associate retrieved vector results back to their originating documents and knowledge bases.

---

# Security Considerations

The current implementation includes several defensive layers:

### API Validation

Pydantic schemas validate request payloads and enforce fields such as string lengths and PostgreSQL port ranges.

### SQL Protection

Generated database queries are parsed and restricted to read-only query structures.

### Knowledge-Base Ownership

Knowledge bases and their associated documents are checked against the current demo user context before access or deletion operations.

### CORS

The backend explicitly configures allowed frontend origins.

### File Validation

Uploads are restricted to known file extensions and a maximum size of 20 MB.

---

# Current Authentication State

The project contains the data model and configuration required for JWT-based authentication, including:

```text
JWT_SECRET
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
```

However, the current session implementation uses a shared anonymous/demo context:

```text
demo@knowledgebase.local
```

rather than a completed per-user authentication flow.

Therefore, authentication should currently be considered **infrastructure-ready but not fully implemented in the active application flow**.

---

# Current Deployment Architecture

The current hosted setup separates the application into:

```text
Render
│
├── Next.js Frontend
│
└── FastAPI Backend
       │
       ├── PostgreSQL / Supabase
       ├── Qdrant
       ├── Hugging Face Inference
       └── OpenRouter
```

This allows the application layer to remain stateless while persistent relational and vector data are kept in external services.

---

# Example Use Cases

## Educational Knowledge Assistant

Upload:

```text
Academic regulations
Attendance policies
Exam rules
Course documents
Student handbooks
```

Ask:

```text
"What is the minimum attendance requirement?"
```

The request is routed to:

```text
DOCUMENT
```

and answered from the indexed knowledge base.

---

## Student Database Assistant

Connect a PostgreSQL student database and ask:

```text
"Which students have attendance below 75%?"
```

The request follows:

```text
DATABASE
    ↓
Schema Retrieval
    ↓
SQL Generation
    ↓
SQL Validation
    ↓
Database Execution
    ↓
Natural Language Response
```

---

## General AI Assistant

Ask:

```text
"What is the difference between TCP and UDP?"
```

The intent router selects:

```text
CHAT
```

and the question is handled as a normal conversational LLM request.

---

# Design Philosophy

KnowledgeBase AI is built around several core principles:

### One Interface, Multiple Sources

Users should not have to understand whether information lives in:

- a document,
- a vector database,
- or a relational database.

The platform handles routing automatically.

### Grounded Generation

Document questions are answered using retrieved context rather than allowing the model to freely invent information.

### Structured Data Access

Database questions are handled through a controlled SQL generation and validation pipeline.

### Modular Architecture

The backend separates:

```text
API
Services
Retrieval
Embeddings
LLM
SQL
Database
Ingestion
Conversation
```

This keeps individual subsystems independently extensible.

---

# Current Limitations

The current implementation should be understood as a strong working platform with several areas still suitable for production hardening.

### Authentication

The active application uses a shared demo user rather than complete user authentication.

### Database Connection Scope

Database connections are currently not associated with an individual user, and the database agent currently uses the first registered connection.

### Temporary Upload Storage

Uploaded files are processed through a temporary filesystem path. On the configured Render deployment, the upload directory is:

```text
/tmp/knowledgebase-uploads
```



### Production Hardening

Further work can include:

- Multi-user authentication
- Role-based access control
- Encrypted database credentials
- Per-user database connections
- Persistent object storage
- Background document processing
- Advanced retrieval/reranking
- Observability and tracing
- Automated testing and CI/CD

---

# Roadmap

## Near Term

- Complete production authentication
- Improve database connection isolation
- Introduce persistent object storage
- Improve error handling and observability
- Expand automated test coverage

## Mid Term

- Advanced reranking
- More embedding providers
- Additional database engines
- Streaming responses
- Better citation/source presentation
- Background ingestion workers

## Long Term

- Multi-tenant workspaces
- Role-based organizational access
- Enterprise connectors
- Agentic workflows
- Workflow automation
- SaaS deployment model
- Advanced analytics

---

# Why This Architecture?

Traditional chat applications typically send every question directly to an LLM.

KnowledgeBase AI instead introduces an orchestration layer:

```text
                       User Question
                             │
                             ▼
                     Intent Classification
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
       General             Documents         Database
        Chat                  │                  │
          │                   ▼                  ▼
          │                Vector RAG        SQL Agent
          │                   │                  │
          └───────────────────┼──────────────────┘
                              ▼
                       Unified Response
```

This separation improves:

- Relevance
- Grounding
- Data accessibility
- Security boundaries
- Extensibility
- Maintainability

---

# Project Status

**Current status: Active development / working prototype**

The core platform is operational and currently includes:

- Multi-intent AI routing
- Conversational chat
- Persistent sessions
- Historical messages with intent metadata
- Multi-format document ingestion
- Semantic search
- Qdrant vector storage
- Knowledge-base management
- Document deletion
- PostgreSQL database connections
- Natural-language SQL generation
- SQL safety validation
- Dashboard statistics
- Render deployment configuration

The repository structure and current application implementation reflect these capabilities.

---

# Live Demo

### Application

https://knowledgebase-frontend-4l5n.onrender.com/

### Source Code

https://github.com/RishiKrishnah/knowledgebase-ai

---

# Author

**Rishi Krishna**

KnowledgeBase AI is developed as an extensible AI platform for intelligent knowledge retrieval, conversational assistance, and structured data interaction.

---

# License

Add the project's license here once the repository license is finalized.