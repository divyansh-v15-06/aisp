export type ToneType = 'eli5' | 'executive' | 'technical';

export interface JargonTerm {
  term: string;
  category: string; // 'acronym' | 'protocol' | 'concept' | 'architecture' | 'buzzword'
  simpleDefinition: string;
  analogy: string;
}

export interface ToneExplanation {
  title: string;
  coreExplanation: string;
  analogy?: string; // used in ELI5
  businessImpact?: string; // used in Executive
  architectureMechanics?: string; // used in Technical
  keyTakeaways: string[];
  readingTime: string;
  jargonTerms: JargonTerm[];
}

export interface JargonBusterResponse {
  detectedDomain: string;
  originalSummary: string;
  explanations: {
    eli5: ToneExplanation;
    executive: ToneExplanation;
    technical: ToneExplanation;
  };
}

export interface PresetSnippet {
  id: string;
  category: 'Cloud' | 'AI / ML' | 'DevOps' | 'Databases' | 'Security';
  title: string;
  subtitle: string;
  content: string;
  recommendedTone: ToneType;
}
