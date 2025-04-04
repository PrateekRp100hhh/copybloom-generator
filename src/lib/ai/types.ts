
export interface GenerateCopyParams {
  campaignType: string;
  audience: string;
  message: string;
  tone: string;
  cta: string;
}

export interface ChatMessageParams {
  message: string;
}

export interface ScriptGenerationParams {
  topic: string;
  audience: string;
  tone: string;
  duration: string;
  style: string;
  
  hookQuestion?: string;
  painPoint?: string;
  curiosityHook?: string;
  
  keyPoints?: string;
  backstory?: string;
  challenge?: string;
  twist?: string;
  
  callToAction?: string;
  transition?: string;
}

export interface StoryElementsParams {
  topic: string;
  audience: string;
  tone: string;
  duration: string;
  style: string;
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
