
export interface ScriptFormData {
  // Basic info
  topic: string;
  audience: string;
  tone: string;
  duration: string;
  style: string;
  
  // Hook elements
  hookQuestion: string;
  painPoint: string;
  curiosityHook: string;
  
  // Content elements
  keyPoints: string;
  backstory: string;
  challenge: string;
  twist: string;
  
  // Outro elements
  callToAction: string;
  transition: string;
}

export interface StoryElements {
  hook: {
    hookQuestion: string;
    painPoint: string;
    curiosityHook: string;
  };
  content: {
    keyPoints: string;
    backstory: string;
    challenge: string;
    twist: string;
  };
  outro: {
    callToAction: string;
    transition: string;
  };
}
