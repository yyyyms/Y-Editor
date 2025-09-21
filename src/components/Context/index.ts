import { createContext } from 'react';

import type YEditor from '@/packages/core/editor';

export const EditorContext = createContext<YEditor | null>(null);
