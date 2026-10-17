import { ProgressBar } from './ProgressBar';
import { useTranslation } from 'react-i18next';

interface CourseProgressBarProps {
  value: number;
  courseTitle: string;
}

export function CourseProgressBar({ value, courseTitle }: CourseProgressBarProps) {
  const { t } = useTranslation('learning');
  return (
    <ProgressBar
      className="w-full"
      label={t('courseDetails.progressLabel', { title: courseTitle })}
      value={value}
    />
  );
}
