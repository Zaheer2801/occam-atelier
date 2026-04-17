export type ClientStatus =
  | "pending_code"
  | "onboarding"
  | "resume_review"
  | "roles_locked"
  | "pending_assignment"
  | "assigned"
  | "inactive";

export interface ParsedResume {
  personal: { name: string; email: string; phone: string; summary?: string };
  skills: string[];
  work_experience: Array<{
    company: string;
    title: string;
    start_date: string;
    end_date?: string;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    start_date: string;
    end_date?: string;
  }>;
}

/**
 * Where a client should be sent based on their onboarding status.
 * Returns null if no redirect is needed (status === 'assigned').
 */
export function clientStatusRoute(status: ClientStatus | null | undefined): string | null {
  switch (status) {
    case "pending_code":
      return "/auth/access-code";
    case "onboarding":
      return "/onboarding/personal-info";
    case "resume_review":
      return "/onboarding/resume-review";
    case "roles_locked":
    case "pending_assignment":
    case "assigned":
    case null:
    case undefined:
      return null;
    case "inactive":
      return "/app/client/waiting";
    default:
      return null;
  }
}
