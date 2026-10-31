import type { Guide } from './guide';
import type { QuickLearning } from './quick-learning';
import type { Trail } from './trail';

export type Recommendation =
  | { tipo: 'trail'; item: Trail }
  | { tipo: 'quick-learning'; item: QuickLearning }
  | { tipo: 'guide'; item: Guide };
