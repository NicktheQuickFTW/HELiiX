// default metadata for HELiiX platform
const meta = {
  title: "HELiiX - Big 12 Operations Platform",
  description: "Comprehensive platform for managing Big 12 Conference athletics, communications, and operational excellence across all 16 member institutions.",
  baseURL: "https://heliix.big12.org",
  type: "website" as const,
  image: "/images/heliix-cover.jpg",
  author: {
    name: "Big 12 Conference",
    url: "https://big12sports.com"
  },
  keywords: [
    "Big 12 Conference",
    "athletics management",
    "sports operations",
    "conference administration",
    "university athletics",
    "college sports",
    "HELiiX platform"
  ]
};

// page-specific metadata
export const pageMetadata = {
  home: {
    ...meta,
    title: "HELiiX - Big 12 Operations Platform",
    description: "Comprehensive platform for managing Big 12 Conference athletics, communications, and operational excellence across all 16 member institutions."
  },
  dashboard: {
    ...meta,
    title: "Dashboard - HELiiX",
    description: "Big 12 Conference operational dashboard with real-time analytics, performance metrics, and administrative insights."
  },
  awards: {
    ...meta,
    title: "Awards Program - HELiiX",
    description: "Manage Big 12 Conference awards, recognition programs, and ceremonial events across all member institutions."
  },
  championships: {
    ...meta,
    title: "Championships - HELiiX",
    description: "Big 12 Conference championship management, tournament coordination, and credential verification system."
  },
  teams: {
    ...meta,
    title: "Teams & Schools - HELiiX",
    description: "Directory of Big 12 Conference member institutions, team rosters, and organizational contacts."
  },
  contacts: {
    ...meta,
    title: "Contacts Directory - HELiiX",
    description: "Comprehensive contact directory for Big 12 Conference staff, administrators, and key personnel."
  },
  sports: {
    ...meta,
    title: "Sports Management - HELiiX",
    description: "Big 12 Conference sports scheduling, coordination, and management across all athletic programs."
  },
  finance: {
    ...meta,
    title: "Finance & Distributions - HELiiX",
    description: "Financial management, budget tracking, and revenue distribution for Big 12 Conference operations."
  },
  operations: {
    ...meta,
    title: "Operations Center - HELiiX",
    description: "Centralized operations management for Big 12 Conference administrative and athletic functions."
  },
  travel: {
    ...meta,
    title: "Travel Management - HELiiX",
    description: "Travel coordination, booking, and logistics management for Big 12 Conference events and activities."
  },
  aiAssistant: {
    ...meta,
    title: "AI Assistant - HELiiX",
    description: "Intelligent assistant for Big 12 Conference operations, providing insights and automated support."
  }
};

export { meta };