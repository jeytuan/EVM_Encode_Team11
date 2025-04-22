export interface FormData {
    eventType: string;
    visibility: "public" | "private";
    goalUsd: string;
    minContributionUsd: string;
    duration: string;
    name: string;
    description: string;
    category: string;
  }
  
  export interface WizardStepProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    goNext: () => void;
    goBack: () => void;
  }
  
  // Explicit named types for each step
  export type EventTypeStepProps = WizardStepProps;
  export type StepVisibilityProps = WizardStepProps;
  export type StepFundingProps = WizardStepProps;
  export type StepMetadataProps = WizardStepProps;
  
  export interface StepReviewProps {
    formData: FormData;
    goBack: () => void;
    onSubmit: () => void;
    loading: boolean;
    txHash: string;
  }
  