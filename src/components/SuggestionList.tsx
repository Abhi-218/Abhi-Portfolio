'use client';
import { useEffect, useState } from 'react';
import SuggestionCard from './SuggestionCard';
import { ISuggestion, IUser } from '@/Models/interfaces';


export default function SuggestionList() {
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [user, setUser] = useState<IUser | undefined>();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/suggestions');
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data: ISuggestion[] = await res.json();
      setSuggestions(data);

      const currentUserRes = await fetch('api/auth/me');
      const currentUser =await currentUserRes.json();
      console.log('currrontuser=' ,currentUser);
      setUser(currentUser.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSuggestion = (updated: ISuggestion) => {
    setSuggestions(prev =>
      prev.map(s => (s._id === updated._id ? updated : s))
    );
  };

  return (
    <div className='px-2'>
      {suggestions.map(s => (
        <SuggestionCard
          key={s._id}
          suggestion={s}
          onUpdate={updateSuggestion}
          currentUser={user}
        />
      ))}
    </div>
  );
}
