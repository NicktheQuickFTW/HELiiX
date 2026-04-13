---
name: buildmcp
description: buildmcp - MCP Server Development Command
---

# buildmcp - MCP Server Development Command

**Build sophisticated Model Context Protocol (MCP) servers with AI assistance**

## Overview

This command provides comprehensive documentation and guidance for building MCP servers using the TypeScript SDK, specifically tailored for FlexTime's existing MCP ecosystem.

## MCP Development Guide

### Speed up your MCP development using LLMs such as Claude!

This guide will help you use LLMs to help you build custom Model Context Protocol (MCP) servers and clients. We'll be focusing on Claude for this tutorial, but you can do this with any frontier LLM.

## Preparing the documentation

Before starting, gather the necessary documentation to help Claude understand MCP:

1. Reference this buildmcp command for complete MCP TypeScript SDK documentation
2. Review FlexTime's existing MCP server patterns in `/scheduling/mcp/`

## Describing your server

Once you have the documentation context, clearly describe to Claude what kind of server you want to build. Be specific about:

* What resources your server will expose
* What tools it will provide
* Any prompts it should offer
* What external systems it needs to interact with

For example:

```
Build an MCP server that:
- Connects to FlexTime's Supabase database
- Exposes Big 12 travel optimization data as resources
- Provides tools for real-time route optimization
- Includes prompts for travel cost analysis
```

## Working with Claude

When working with Claude on MCP servers:

1. Start with the core functionality first, then iterate to add more features
2. Ask Claude to explain any parts of the code you don't understand
3. Request modifications or improvements as needed
4. Have Claude help you test the server and handle edge cases

Claude can help implement all the key MCP features:

* Resource management and exposure
* Tool definitions and implementations
* Prompt templates and handlers
* Error handling and logging
* Connection and transport setup

## Best practices

When building MCP servers with Claude:

* Break down complex servers into smaller pieces
* Test each component thoroughly before moving on
* Keep security in mind - validate inputs and limit access appropriately
* Document your code well for future maintenance
* Follow MCP protocol specifications carefully

## Next steps

After Claude helps you build your server:

1. Review the generated code carefully
2. Test the server with FlexTime's existing MCP infrastructure
3. Add to FlexTime's MCP configuration in `/scheduling/mcp/mcp-config.json`
4. Iterate based on real usage and feedback

Remember that Claude can help you modify and improve your server as requirements change over time.

---

# MCP TypeScript SDK Complete Reference

## Overview

The Model Context Protocol allows applications to provide context for LLMs in a standardized way, separating the concerns of providing context from the actual LLM interaction. This TypeScript SDK implements the full MCP specification, making it easy to:

- Build MCP clients that can connect to any MCP server
- Create MCP servers that expose resources, prompts and tools
- Use standard transports like stdio and Streamable HTTP
- Handle all MCP protocol messages and lifecycle events

## Installation

```bash
npm install @modelcontextprotocol/sdk
```

> ⚠️ MCP requires Node v18.x up to work fine.

## Quick Start

Let's create a simple MCP server that exposes a calculator tool and some data:

```typescript
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});

// Add an addition tool
server.registerTool("add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() }
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add a dynamic greeting resource
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  { 
    title: "Greeting Resource",      // Display name for UI
    description: "Dynamic greeting generator"
  },
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Core Concepts

### Server

The McpServer is your core interface to the MCP protocol. It handles connection management, protocol compliance, and message routing:

```typescript
const server = new McpServer({
  name: "my-app",
  version: "1.0.0"
});
```

### Resources

Resources are how you expose data to LLMs. They're similar to GET endpoints in a REST API - they provide data but shouldn't perform significant computation or have side effects:

```typescript
// Static resource
server.registerResource(
  "config",
  "config://app",
  {
    title: "Application Config",
    description: "Application configuration data",
    mimeType: "text/plain"
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: "App configuration here"
    }]
  })
);

// Dynamic resource with parameters
server.registerResource(
  "user-profile",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  {
    title: "User Profile",
    description: "User profile information"
  },
  async (uri, { userId }) => ({
    contents: [{
      uri: uri.href,
      text: `Profile data for user ${userId}`
    }]
  })
);
```

### Tools

Tools let LLMs take actions through your server. Unlike resources, tools are expected to perform computation and have side effects:

```typescript
// Simple tool with parameters
server.registerTool(
  "calculate-bmi",
  {
    title: "BMI Calculator",
    description: "Calculate Body Mass Index",
    inputSchema: {
      weightKg: z.number(),
      heightM: z.number()
    }
  },
  async ({ weightKg, heightM }) => ({
    content: [{
      type: "text",
      text: String(weightKg / (heightM * heightM))
    }]
  })
);

// Async tool with external API call
server.registerTool(
  "fetch-weather",
  {
    title: "Weather Fetcher",
    description: "Get weather data for a city",
    inputSchema: { city: z.string() }
  },
  async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.text();
    return {
      content: [{ type: "text", text: data }]
    };
  }
);
```

### Prompts

Prompts are reusable templates that help LLMs interact with your server effectively:

```typescript
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";

server.registerPrompt(
  "review-code",
  {
    title: "Code Review",
    description: "Review code for best practices and potential issues",
    argsSchema: { code: z.string() }
  },
  ({ code }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please review this code:\n\n${code}`
      }
    }]
  })
);
```

## Running Your Server

### stdio Transport

For command-line tools and direct integrations:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Streamable HTTP Transport

For remote servers, set up a Streamable HTTP transport that handles both client requests and server-to-client notifications:

```typescript
import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        transports[sessionId] = transport;
      }
    });

    const server = new McpServer({
      name: "example-server",
      version: "1.0.0"
    });
    
    await server.connect(transport);
  } else {
    res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Bad Request' },
      id: null,
    });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

## FlexTime MCP Integration Context

### Existing MCP Servers in FlexTime

FlexTime currently has 8 specialized MCP servers:

1. **big12-data-server.js** - Big 12 Conference data access
2. **constraint-server.js** - Real-time constraint validation  
3. **travel-optimizer.js** - Geographic calculations & travel optimization
4. **schedule-tools-server.js** - Sport-specific scheduling utilities
5. **analytics-server.js** - Performance analytics and reporting
6. **ai-coordinator.js** - Multi-agent AI coordination
7. **supabase-big12-server.js** - Supabase database integration
8. **sports-intelligence-server.js** - Sports intelligence hub

### FlexTime MCP Configuration

Located at `/scheduling/mcp/mcp-config.json`:

```json
{
  "mcpServers": {
    "big12-data": {
      "command": "node",
      "args": ["./scheduling/mcp/big12-data-server.js"],
      "description": "Big 12 Conference data access, team information, and historical analysis"
    },
    "constraint-validator": {
      "command": "node", 
      "args": ["./scheduling/mcp/constraint-server.js"],
      "description": "Real-time constraint validation, violation detection, and fix recommendations"
    },
    "travel-optimizer": {
      "command": "node",
      "args": ["./scheduling/mcp/travel-optimizer.js"],
      "description": "Geographic calculations, travel efficiency optimization, and distance analysis"
    }
  }
}
```

### Common FlexTime MCP Patterns

#### Travel Optimization Tools

```typescript
server.registerTool(
  "optimize-travel",
  {
    title: "Travel Route Optimizer",
    description: "Optimize travel routes for Big 12 teams with cost and carbon footprint analysis",
    inputSchema: {
      origin: z.string().describe("Origin school (e.g., 'Kansas')"),
      destination: z.string().describe("Destination school (e.g., 'Texas Tech')"),
      travelMode: z.enum(["charter_bus", "charter_flight", "commercial_flight"]),
      teamSize: z.number().min(15).max(150).describe("Number of travelers")
    }
  },
  async ({ origin, destination, travelMode, teamSize }) => {
    // FlexTime travel optimization logic
    const optimization = await optimizeBig12Travel(origin, destination, travelMode, teamSize);
    
    return {
      content: [{
        type: "text",
        text: `Travel optimization results:
Cost: $${optimization.cost.toLocaleString()}
Distance: ${optimization.distance} miles
Carbon footprint: ${optimization.carbonFootprint}kg CO2
Estimated travel time: ${optimization.travelTime}
Recommended mode: ${optimization.recommendedMode}`
      }]
    };
  }
);
```

#### Big 12 Data Resources

```typescript
server.registerResource(
  "big12-schools",
  "big12://schools",
  {
    title: "Big 12 Schools Data",
    description: "Complete information about all 16 Big 12 Conference schools",
    mimeType: "application/json"
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify({
        schools: [
          { name: "Arizona", city: "Tucson", state: "AZ", coordinates: { lat: 32.2317, lng: -110.9265 } },
          { name: "Arizona State", city: "Tempe", state: "AZ", coordinates: { lat: 33.4255, lng: -111.9400 } },
          // ... all 16 schools
        ],
        travelPartners: [
          { schools: ["Arizona", "Arizona State"], efficiency: 0.89, distance: 120 },
          { schools: ["Kansas", "Kansas State"], efficiency: 0.87, distance: 80 }
        ]
      }, null, 2)
    }]
  })
);
```

#### Constraint Validation Tools

```typescript
server.registerTool(
  "validate-schedule",
  {
    title: "Schedule Constraint Validator",
    description: "Validate schedule against Big 12 constraints including BYU Sunday restrictions",
    inputSchema: {
      schedule: z.array(z.object({
        homeTeam: z.string(),
        awayTeam: z.string(),
        date: z.string(),
        time: z.string().optional()
      })),
      sport: z.string(),
      season: z.string()
    }
  },
  async ({ schedule, sport, season }) => {
    const violations = await validateBig12Constraints(schedule, sport, season);
    
    return {
      content: [{
        type: "text",
        text: `Constraint validation results:
Total violations: ${violations.length}
Critical violations: ${violations.filter(v => v.severity === 'critical').length}
BYU Sunday violations: ${violations.filter(v => v.type === 'byu_sunday').length}
Travel partner violations: ${violations.filter(v => v.type === 'travel_partner').length}

${violations.length > 0 ? 'Violations found:\n' + violations.map(v => `- ${v.description}`).join('\n') : 'No violations found!'}`
      }]
    };
  }
);
```

## Testing and Development

### FlexTime MCP Testing

Test within FlexTime's ecosystem:

```bash
# Test individual MCP server
node scheduling/mcp/travel-optimizer.js

# Test full MCP integration
npm run test:mcp

# Test with existing FlexTime infrastructure
npm run dev
```

## Advanced Features

### Dynamic Server Updates

```typescript
// Add tools dynamically based on user permissions
const adminTool = server.registerTool("admin-function", config, handler);
adminTool.disable(); // Initially disabled

// Enable when user gains admin rights
if (userHasAdminRights) {
  adminTool.enable();
}
```

### Sampling (LLM Integration)

```typescript
server.registerTool(
  "ai-schedule-analysis",
  {
    title: "AI Schedule Analysis",
    description: "Use LLM to analyze schedule quality and suggest improvements",
    inputSchema: { schedule: z.array(z.object({})) }
  },
  async ({ schedule }) => {
    const response = await server.server.createMessage({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Analyze this Big 12 schedule and suggest improvements: ${JSON.stringify(schedule)}`
        }
      }],
      maxTokens: 1000
    });

    return {
      content: [{
        type: "text", 
        text: response.content.type === "text" ? response.content.text : "Analysis failed"
      }]
    };
  }
);
```

## Best Practices for FlexTime

1. **Follow FlexTime Patterns**: Use existing patterns from current MCP servers
2. **Big 12 Context**: Always include Big 12-specific context and constraints
3. **Travel Integration**: Leverage travel optimization capabilities
4. **Error Handling**: Include comprehensive error handling for scheduling conflicts
5. **Performance**: Optimize for real-time constraint checking and validation
6. **Documentation**: Document tools and resources clearly for AI interaction

## Next Steps

1. Use this documentation to build or enhance MCP servers
2. Test with FlexTime's existing MCP infrastructure
3. Add new servers to FlexTime's MCP configuration
4. Deploy to FlexTime's integrated ecosystem

Remember: Claude can help you implement any of these patterns or create new MCP servers tailored to your specific needs!