// ================================
// ClickUp Agent Input Interface
// ================================
// Purpose: Define structure for data sent to AI agent
// When: When generating tasks for users
// Contains: Only relevant fields for AI decision making

export interface IAgentInput {
  name: string;
  role: string;
  skills: string[];
  experienceLevel?: string;
  department?: string;
  manager?: string;
}