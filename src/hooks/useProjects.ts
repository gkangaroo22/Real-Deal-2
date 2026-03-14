import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../types';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    name: 'Meridian Energy TCTA',
    status: 'Negotiating',
    sector: 'Energy',
    dealSize: 45000000,
    closingDate: '2025-06-30',
    description: 'Tax Credit Transfer Agreement for renewable energy portfolio spanning 12 solar assets.',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    expectedRiskValue: 3200000,
    parties: ['Meridian Energy Corp', 'Vanguard Capital Partners'],
  },
  {
    id: 'mock-2',
    name: 'Atlas Corp Acquisition',
    status: 'Analyzed',
    sector: 'M&A',
    dealSize: 120000000,
    closingDate: '2025-08-15',
    description: 'Full acquisition of Atlas Corp manufacturing division via Asset Purchase Agreement.',
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    expectedRiskValue: 8500000,
    parties: ['Blackstone Acquisition LLC', 'Atlas Corp', 'JPMorgan Advisory'],
  },
  {
    id: 'mock-3',
    name: 'Pacific Power PPA',
    status: 'Draft',
    sector: 'Energy',
    dealSize: 28000000,
    closingDate: '2025-09-01',
    description: 'Power Purchase Agreement for 150MW wind farm with 20-year offtake commitment.',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
    expectedRiskValue: 1800000,
    parties: ['Pacific Power Inc', 'GridCo Utilities'],
  },
  {
    id: 'mock-4',
    name: 'Cascade Financial SPA',
    status: 'Closed',
    sector: 'Corporate Finance',
    dealSize: 65000000,
    closingDate: '2024-12-01',
    description: 'Stock Purchase Agreement for full equity acquisition of Cascade Financial Services.',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    expectedRiskValue: 2100000,
    parties: ['Riverside Capital', 'Cascade Financial Services', 'Deloitte'],
  },
];

const isFirebaseConfigured = () => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    if (!isFirebaseConfigured()) {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
      setProjects(data.length > 0 ? data : MOCK_PROJECTS);
    } catch (e) {
      console.error(e);
      setError('Failed to load projects');
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }

  async function addProject(project: Omit<Project, 'id'>) {
    if (!isFirebaseConfigured()) {
      const newProject = { ...project, id: `local-${Date.now()}` };
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    }
    try {
      const docRef = await addDoc(collection(db, 'projects'), project);
      const newProject = { ...project, id: docRef.id };
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (e) {
      console.error(e);
      setError('Failed to add project');
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    if (!isFirebaseConfigured()) {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      return;
    }
    try {
      await updateDoc(doc(db, 'projects', id), updates);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    } catch (e) {
      console.error(e);
      setError('Failed to update project');
    }
  }

  async function deleteProject(id: string) {
    if (!isFirebaseConfigured()) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      setError('Failed to delete project');
    }
  }

  return { projects, loading, error, addProject, updateProject, deleteProject, refetch: loadProjects };
}
