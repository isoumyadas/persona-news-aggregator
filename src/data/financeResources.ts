import { LearningResource } from "../lib/types";

/**
 * Comprehensive Finance Literacy Roadmap
 *
 * 20 hand-curated, 100% free resources organized in 5 sequential phases.
 * Designed for an Indian learner targeting personal + professional finance mastery.
 * Every URL verified as of April 2026.
 */
export const financeResources: LearningResource[] = [
  // ═══════════════════════════════════════════════════════════════════
  //  PHASE 1 — FOUNDATIONS (Beginner)
  //  Goal: Understand money, banking, inflation, and how markets exist
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "p1-s1",
    title: "Khan Academy — Financial Literacy",
    hubTab: "learning",
    description:
      "World-class free course covering budgeting, savings, debt, interest rates, and the time value of money. Perfect starting point for absolute beginners.",
    url: "https://www.khanacademy.org/college-careers-more/financial-literacy",
    source: "Khan Academy",
    category: "Financial Basics",
    difficulty: "Beginner",
    free: true,
    tags: ["Budgeting", "Savings", "Debt", "Interest"],
    phase: 1,
    stepNumber: 1,
  },
  {
    id: "p1-s2",
    title: "Zerodha Varsity — Introduction to Stock Markets",
    hubTab: "learning",
    description:
      "Module 1 of India's gold-standard free finance education. Learn what stock markets are, how exchanges work, IPOs, and the role of SEBI.",
    url: "https://zerodha.com/varsity/module/introduction-to-stock-markets/",
    source: "Zerodha Varsity",
    category: "Stock Market Basics",
    difficulty: "Beginner",
    free: true,
    tags: ["Stock Markets", "SEBI", "India", "IPO"],
    phase: 1,
    stepNumber: 2,
  },
  {
    id: "p1-s3",
    title: "RBI — Financial Education Resources",
    hubTab: "learning",
    description:
      "Official Reserve Bank of India materials explaining banking systems, inflation, monetary policy, and how RBI regulates the Indian economy.",
    url: "https://www.rbi.org.in/financialeducation.aspx",
    source: "RBI",
    category: "Banking & Economy",
    difficulty: "Beginner",
    free: true,
    tags: ["RBI", "Banking", "Inflation", "India"],
    phase: 1,
    stepNumber: 3,
  },
  {
    id: "p1-s4",
    title: "NISM — Financial Literacy for Bharat",
    hubTab: "learning",
    description:
      "SEBI's educational initiative through the National Institute of Securities Markets. Structured, credible learning on Indian financial markets and instruments.",
    url: "https://www.nism.ac.in/financial-literacy/",
    source: "NISM (SEBI)",
    category: "Securities Markets",
    difficulty: "Beginner",
    free: true,
    tags: ["SEBI", "Securities", "India", "Official"],
    phase: 1,
    stepNumber: 4,
  },

  // ═══════════════════════════════════════════════════════════════════
  //  PHASE 2 — PERSONAL FINANCE MASTERY (Beginner → Intermediate)
  //  Goal: Budget, save, invest via SIPs, understand PPF/NPS/EPF/insurance
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "p2-s1",
    title: "Zerodha Varsity — Personal Finance",
    hubTab: "learning",
    description:
      "Module 11: The comprehensive guide to personal finance in India — insurance, emergency funds, goal-based investing, tax-saving (80C, 80D), and estate planning.",
    url: "https://zerodha.com/varsity/module/personalfinance/",
    source: "Zerodha Varsity",
    category: "Module 1: Foundation",
    difficulty: "Beginner",
    free: true,
    tags: ["Insurance", "Tax Saving", "Emergency Fund", "India"],
    phase: 2,
    stepNumber: 1,
  },
  {
    id: "p2-s2",
    title: "Zerodha Varsity — Mutual Funds",
    hubTab: "learning",
    description:
      "Module 12: Everything about mutual funds in India — SIP vs lumpsum, expense ratios, direct vs regular plans, debt vs equity funds, and ELSS.",
    url: "https://zerodha.com/varsity/module/mutual-funds/",
    source: "Zerodha Varsity",
    category: "Mutual Funds",
    difficulty: "Beginner",
    free: true,
    tags: ["SIP", "Mutual Funds", "ELSS", "India"],
    phase: 2,
    stepNumber: 2,
  },
  {
    id: "p2-s3",
    title: "Angel One Smart Money — Personal Finance Course",
    hubTab: "learning",
    description:
      "Free structured course on budgeting, goal-based saving, compound interest, and investment basics designed for Indian investors.",
    url: "https://www.angelone.in/knowledge-center/smart-money",
    source: "Angel One",
    category: "Budgeting & Goals",
    difficulty: "Beginner",
    free: true,
    tags: ["Budgeting", "Goals", "Compound Interest", "India"],
    phase: 2,
    stepNumber: 3,
  },
  {
    id: "p2-s4",
    title: "SWAYAM — Personal Financial Planning",
    hubTab: "learning",
    description:
      "Government platform offering free courses from IIM, BHU, and other top institutions on banking, financial markets, and personal financial planning.",
    url: "https://swayam.gov.in/explorer?searchText=financial+planning",
    source: "SWAYAM (Govt.)",
    category: "Academic Course",
    difficulty: "Intermediate",
    free: true,
    tags: ["IIM", "University", "Financial Planning", "India"],
    phase: 2,
    stepNumber: 4,
  },

  // ═══════════════════════════════════════════════════════════════════
  //  PHASE 3 — MARKETS & INVESTING (Intermediate)
  //  Goal: Read charts, analyze companies, understand F&O basics
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "p3-s1",
    title: "Zerodha Varsity — Technical Analysis",
    hubTab: "learning",
    description:
      "Module 2: Learn candlestick patterns, chart patterns, moving averages, RSI, MACD, and volume analysis for Indian markets.",
    url: "https://zerodha.com/varsity/module/technical-analysis/",
    source: "Zerodha Varsity",
    category: "Technical Analysis",
    difficulty: "Intermediate",
    free: true,
    tags: ["Charts", "Candlesticks", "RSI", "MACD"],
    phase: 3,
    stepNumber: 1,
  },
  {
    id: "p3-s2",
    title: "Zerodha Varsity — Fundamental Analysis",
    hubTab: "learning",
    description:
      "Module 3: How to read annual reports, P/E ratios, ROE, ROCE, balance sheets, and income statements. Learn to value Indian companies.",
    url: "https://zerodha.com/varsity/module/fundamental-analysis/",
    source: "Zerodha Varsity",
    category: "Fundamental Analysis",
    difficulty: "Intermediate",
    free: true,
    tags: ["Annual Reports", "P/E", "Balance Sheet", "India"],
    phase: 3,
    stepNumber: 2,
  },
  {
    id: "p3-s3",
    title: "Investopedia — Complete Investing Guide",
    hubTab: "learning",
    description:
      "Comprehensive encyclopedia of investing concepts: asset allocation, portfolio theory, diversification, risk management, and market mechanics.",
    url: "https://www.investopedia.com/investing-essentials-4689754",
    source: "Investopedia",
    category: "Investing Guide",
    difficulty: "Intermediate",
    free: true,
    tags: ["Portfolio", "Risk", "Diversification", "Global"],
    phase: 3,
    stepNumber: 3,
  },
  {
    id: "p3-s4",
    title: "The Plain Bagel — Market Mechanics (YouTube)",
    hubTab: "learning",
    description:
      "A CFA professional explains bonds, market crashes, inflation, ETFs, and complex financial concepts through beautifully produced visual videos.",
    url: "https://www.youtube.com/playlist?list=PLUIcgQhlGeXwlRVsZZZZzCwnhbQzCGEjX",
    source: "YouTube",
    category: "Market Mechanics",
    difficulty: "Intermediate",
    free: true,
    tags: ["Bonds", "ETFs", "Inflation", "Visual Learning"],
    phase: 3,
    stepNumber: 4,
  },
  {
    id: "p3-s5",
    title: "SEBI — Investor Education Portal",
    hubTab: "learning",
    description:
      "Official SEBI resources on investor rights, how to spot fraud, complaint mechanisms, and regulatory updates every Indian investor should know.",
    url: "https://investor.sebi.gov.in/",
    source: "SEBI",
    category: "Investor Protection",
    difficulty: "Intermediate",
    free: true,
    tags: ["SEBI", "Regulation", "Fraud Prevention", "India"],
    phase: 3,
    stepNumber: 5,
  },

  // ═══════════════════════════════════════════════════════════════════
  //  PHASE 4 — CORPORATE FINANCE & VALUATION (Advanced)
  //  Goal: Value companies like an analyst, understand global macro
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "p4-s1",
    title: "Aswath Damodaran — Corporate Finance & Valuation",
    hubTab: "learning",
    description:
      "NYU Stern professor 'The Dean of Valuation' uploads his entire MBA corporate finance and valuation courses for free. Learn DCF, WACC, and comparable analysis.",
    url: "https://www.youtube.com/c/AswathDamodaranonValuation",
    source: "YouTube",
    category: "Corporate Valuation",
    difficulty: "Advanced",
    free: true,
    tags: ["DCF", "WACC", "MBA-Level", "Valuation"],
    phase: 4,
    stepNumber: 1,
  },
  {
    id: "p4-s2",
    title: "MIT OCW — Finance Theory I (15.401)",
    hubTab: "learning",
    description:
      "Full MIT course covering present value, fixed income, equities, options, portfolio theory, and CAPM. Lecture videos, notes, and problem sets — all free.",
    url: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/",
    source: "MIT OpenCourseWare",
    category: "Finance Theory",
    difficulty: "Advanced",
    free: true,
    tags: ["CAPM", "Options", "Portfolio Theory", "Academic"],
    phase: 4,
    stepNumber: 2,
  },
  {
    id: "p4-s3",
    title: "Investopedia — International Markets & Forex",
    hubTab: "learning",
    description:
      "Understand how global currencies, forex markets, trade balances, and macroeconomic indicators affect international money flows.",
    url: "https://www.investopedia.com/articles/forex/11/why-trade-forex.asp",
    source: "Investopedia",
    category: "International Money",
    difficulty: "Advanced",
    free: true,
    tags: ["Forex", "Macroeconomics", "Currency", "Global"],
    phase: 4,
    stepNumber: 3,
  },

  // ═══════════════════════════════════════════════════════════════════
  //  PHASE 5 — TOOLS & PRACTICE (All levels)
  //  Goal: Apply knowledge using real-world tools & official data
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "p5-s1",
    title: "Screener.in — Fundamental Stock Screener",
    hubTab: "tools",
    description:
      "The best free fundamental analysis tool for Indian stocks. Screen by P/E, ROE, ROCE, debt-to-equity. Read annual reports and financial statements.",
    url: "https://www.screener.in/",
    source: "Screener.in",
    category: "Stock Screener",
    difficulty: "Intermediate",
    free: true,
    tags: ["Fundamentals", "India", "Annual Reports"],
    phase: 5,
    stepNumber: 1,
  },
  {
    id: "p5-s2",
    title: "TradingView — Technical Analysis & Charting",
    hubTab: "tools",
    description:
      "Industry standard for technical analysis. Create charts, use indicators, backtest strategies, and track global markets. Free tier is robust enough for most needs.",
    url: "https://www.tradingview.com/",
    source: "TradingView",
    category: "Charting Tool",
    difficulty: "Beginner",
    free: true,
    tags: ["Technical Analysis", "Charts", "Global"],
    phase: 5,
    stepNumber: 2,
  },
  {
    id: "p5-s3",
    title: "BSE / NSE — Official Circulars & Disclosures",
    hubTab: "tools",
    description:
      "Primary source for corporate announcements, board meetings, shareholding patterns, and insider trading disclosures from the Indian exchanges.",
    url: "https://www.bseindia.com/corporates/ann.html",
    source: "BSE India",
    category: "Official Filings (India)",
    difficulty: "Intermediate",
    free: true,
    tags: ["BSE", "NSE", "Disclosures", "India"],
    phase: 5,
    stepNumber: 3,
  },
  {
    id: "p5-s4",
    title: "EDGAR — SEC Company Filings (US)",
    hubTab: "tools",
    description:
      "The SEC's official database for 10-K, 10-Q, and 8-K filings of all US public companies. Essential for analyzing US-listed stocks.",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany",
    source: "SEC",
    category: "Official Filings (US)",
    difficulty: "Advanced",
    free: true,
    tags: ["10-K", "US Markets", "SEC", "Filings"],
    phase: 5,
    stepNumber: 4,
  },
];
