import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await api.get('/teams');
        setTeams(data);
      } catch (err) {
        console.error('Không thể tải danh sách team:', err);
      } finally {
        setTeamsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <TeamContext.Provider value={{ teams, teamsLoading }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => useContext(TeamContext);
