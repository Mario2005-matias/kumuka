import { ProgressBar } from './ProgressBar';

interface CourseProgressBarProps {
  value: number;
  courseTitle: string;
}

export function CourseProgressBar({ value, courseTitle }: CourseProgressBarProps) {
  return (
    <ProgressBar
      className="w-full"
      label={`Progresso no curso ${courseTitle}`}
      value={value}
    />
  );
}
