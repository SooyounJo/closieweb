import { useState } from 'react';

export default function useExample() {
  const [value, setValue] = useState('');
  return { value, setValue };
} 