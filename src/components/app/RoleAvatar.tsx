import recruiterAvatar from "@/assets/avatar-recruiter.png";
import managerAvatar from "@/assets/avatar-manager.png";
import jobseekerAvatar from "@/assets/avatar-jobseeker.png";
import { cn } from "@/lib/utils";

const map = {
  recruiter: recruiterAvatar,
  manager: managerAvatar,
  jobseeker: jobseekerAvatar,
} as const;

export type AvatarRole = keyof typeof map;

interface Props {
  role: AvatarRole;
  size?: number;
  className?: string;
  ring?: boolean;
}

export const RoleAvatar = ({ role, size = 40, className, ring = true }: Props) => (
  <img
    src={map[role]}
    alt=""
    aria-hidden
    width={size}
    height={size}
    loading="lazy"
    style={{ width: size, height: size }}
    className={cn(
      "rounded-full object-cover bg-secondary shrink-0",
      ring && "ring-2 ring-secondary ring-offset-2 ring-offset-background",
      className
    )}
  />
);
