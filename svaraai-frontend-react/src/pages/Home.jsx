import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  useEffect(() => {
    nav('/dashboard');
  }, [nav]);
  return null;
}
