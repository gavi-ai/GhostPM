import { PastProject } from '../types';

export const INITIAL_PAST_PROJECTS: PastProject[] = [
  {
    id: 'proj-001',
    project_name: 'PawPals: On-Demand Dog Walking & GPS Tracker',
    client_industry: 'Gig Economy / PetCare',
    raw_description: 'Uber-style mobile app for pet owners and dog walkers with real-time GPS tracking of walking routes, automated Stripe Connect split payments, push notifications, and photo check-ins.',
    budget: 18500,
    timeline_weeks: 5,
    tech_stack: ['React Native', 'Mapbox SDK', 'Stripe Connect', 'Node.js', 'PostgreSQL', 'Socket.io', 'Firebase Cloud Messaging'],
    deliverables_summary: 'iOS & Android app, walker dispatch engine, live map tracking, split payment payouts, background location service.',
    complexity: 'Medium',
    created_at: '2025-11-12T10:00:00Z'
  },
  {
    id: 'proj-002',
    project_name: 'OmniVendor: Multi-Vendor E-Commerce Marketplace',
    client_industry: 'E-Commerce / Retail',
    raw_description: 'Custom Shopify/Next.js multi-vendor marketplace with merchant vendor dashboards, inventory sync, automated commission payouts via Stripe Custom Accounts, product search with Algolia, and order routing.',
    budget: 34000,
    timeline_weeks: 8,
    tech_stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Stripe Connect', 'Supabase PostgreSQL', 'Algolia Search', 'Resend Email'],
    deliverables_summary: 'Merchant onboarding portal, buyer storefront, split checkout engine, automated commission splits, admin analytics dashboard.',
    complexity: 'High',
    created_at: '2025-10-04T14:30:00Z'
  },
  {
    id: 'proj-003',
    project_name: 'VocalIQ: Real-Time AI Voice Support Agent',
    client_industry: 'AI / Enterprise SaaS',
    raw_description: 'Inbound customer call automation using Gemini Live Audio and Twilio WebRTC. Real-time transcription, knowledge base vector lookup, automated CRM ticket creation in Zendesk, and latency under 600ms.',
    budget: 28000,
    timeline_weeks: 6,
    tech_stack: ['Python FastAPI', 'Twilio Voice WebRTC', 'Gemini Live API', 'Pinecone Vector DB', 'Redis', 'React 19', 'Tailwind CSS'],
    deliverables_summary: 'Voice telephony pipeline, live speech streaming, context-aware RAG vector search, Zendesk webhook sync, caller analytics dashboard.',
    complexity: 'High',
    created_at: '2026-01-18T09:15:00Z'
  },
  {
    id: 'proj-004',
    project_name: 'CarePulse: HIPAA-Compliant Telehealth & Video Visits',
    client_industry: 'HealthTech / Medical',
    raw_description: 'End-to-end encrypted video consultation platform with patient medical intake forms, electronic health records (EHR) sync, automated appointment reminders, and insurance eligibility checks.',
    budget: 42000,
    timeline_weeks: 10,
    tech_stack: ['React', 'Daily.co Video WebRTC', 'Node.js', 'PostgreSQL (Encrypted)', 'AWS KMS', 'Stripe Billing', 'Twilio SMS'],
    deliverables_summary: 'BAA/HIPAA compliant video room, patient booking scheduler, encrypted clinical notes, Stripe copay collection, automated SMS reminders.',
    complexity: 'Enterprise',
    created_at: '2025-08-20T11:00:00Z'
  },
  {
    id: 'proj-005',
    project_name: 'VaultFlow: B2B Fintech & Automated Plaid Banking Sync',
    client_industry: 'Fintech / Banking',
    raw_description: 'Automated treasury and invoice factoring platform integrating Plaid Link for bank transaction feeds, KYC identity verification with Persona, ACH payouts, and automated PDF invoice generation.',
    budget: 38500,
    timeline_weeks: 7,
    tech_stack: ['Next.js', 'Plaid Link API', 'Persona KYC', 'Dwolla ACH API', 'PostgreSQL', 'Tailwind CSS', 'TypeScript'],
    deliverables_summary: 'Plaid OAuth bank aggregation, Persona instant identity verification, ACH debit/credit scheduler, audit log engine, PDF invoice generator.',
    complexity: 'High',
    created_at: '2025-12-05T16:20:00Z'
  },
  {
    id: 'proj-006',
    project_name: 'SkillForge: Interactive Learning Management & Video Courses',
    client_industry: 'EdTech / Media',
    raw_description: 'Course authoring and student video learning platform with Mux video streaming, timestamped note-taking, automated quiz grading, certificate generation, and subscription tiers.',
    budget: 21000,
    timeline_weeks: 5,
    tech_stack: ['React', 'Mux Video API', 'Express', 'PostgreSQL', 'Stripe Subscriptions', 'PDFKit', 'Tailwind CSS'],
    deliverables_summary: 'HLS adaptive video player, video quiz checkpoints, automated PDF certificate generator, Stripe tier subscriptions, student progress tracker.',
    complexity: 'Medium',
    created_at: '2025-09-14T08:45:00Z'
  },
  {
    id: 'proj-007',
    project_name: 'EstatePulse: Real Estate MLS & Interactive Map Engine',
    client_industry: 'PropTech / Real Estate',
    raw_description: 'Property search and CRM portal with real-time MLS IDX sync, polygon radius map search with Mapbox, virtual tour embeds, and automated lead capture routing to agent SMS.',
    budget: 26000,
    timeline_weeks: 6,
    tech_stack: ['React', 'Mapbox GL JS', 'RETS / RESO Web API', 'Node.js', 'PostgreSQL', 'Redis Cache', 'Twilio'],
    deliverables_summary: 'MLS feed ingest pipeline, interactive bounding box map filter, agent lead inbox, mortgage calculator widget, client saved searches.',
    complexity: 'Medium',
    created_at: '2025-11-28T13:10:00Z'
  },
  {
    id: 'proj-008',
    project_name: 'TrustEscrow: Web3 Milestone Escrow & Smart Contract Billing',
    client_industry: 'Web3 / LegalTech',
    raw_description: 'Decentralized milestone escrow platform for freelancers and clients using EVM smart contracts, USDC payouts, multi-sig dispute resolution, and off-chain signed deliverables tracking.',
    budget: 31000,
    timeline_weeks: 6,
    tech_stack: ['Solidity', 'Foundry', 'Wagmi / Viem', 'Next.js', 'The Graph Subgraph', 'Supabase', 'TypeScript'],
    deliverables_summary: 'Audited smart contracts for milestone release, WalletConnect auth, multi-sig arbitrator panel, real-time blockchain event indexing.',
    complexity: 'High',
    created_at: '2026-02-02T15:00:00Z'
  },
  {
    id: 'proj-009',
    project_name: 'HyperScale: Multi-Tenant B2B Billing & Quota Engine',
    client_industry: 'SaaS / B2B',
    raw_description: 'Multi-tenant subscription management portal with Stripe billing sync, team seat management, tiered API quota limits, and webhook retry workers.',
    budget: 28500,
    timeline_weeks: 6,
    tech_stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe Billing', 'TailwindCSS', 'Redis'],
    deliverables_summary: 'Self-serve customer portal, webhook idempotent worker, invoice PDF generator, seat billing engine.',
    complexity: 'High',
    created_at: '2026-01-10T11:00:00Z'
  }
];

export const PRESET_INPUTS = [
  {
    label: 'Dog Walker App (GPS + Stripe)',
    category: 'Gig Economy',
    prompt: `Haan bhai, ek app banani hai dog walkers ke liye. Dog owners walkers book kar sakein, live location tracking ho jab walker dog ko walk kar raha ho, aur automated payment gateway laga ho with walker commission payout. Photos upload ho sakein walk ke beech mein. Budget thoda tight hai, 1 mahine mein MVP chahiye.`
  },
  {
    label: 'Multi-Vendor Marketplace',
    category: 'E-Commerce',
    prompt: `We want to build a marketplace like Etsy for handcrafted artisanal furniture. Vendors need their own dashboard to list items, manage inventory, and see payout reports. Buyers can add products from multiple vendors in one cart, but Stripe Connect needs to split the payments automatically minus our 12% platform fee. Search needs to be blazing fast.`
  },
  {
    label: 'AI Voice Support Agent (Gemini + Twilio)',
    category: 'AI SaaS',
    prompt: `Client wants an automated AI phone receptionist that answers customer calls 24/7. It should connect to our company FAQ docs using vector search, talk naturally with low latency voice, and automatically create a support ticket in Zendesk if the user asks for a refund or escalation. Must handle ~500 calls/day.`
  },
  {
    label: 'Fintech Bank Linking & KYC Invoicing',
    category: 'Fintech',
    prompt: `We are building a B2B invoice financing platform. Users upload unpaid invoices, connect their bank accounts via Plaid to verify cashflow, pass instant KYC verification, and request ACH advances against invoices. Needs enterprise audit trails and zero security loopholes.`
  }
];
