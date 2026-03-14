import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { View } from './components/layout/Sidebar';
import { PortfolioDashboard } from './components/portfolio/PortfolioDashboard';
import { ProjectsView } from './components/projects/ProjectsView';
import { DealEngine } from './components/dealEngine/DealEngine';
import { ClauseMatrix } from './components/clauseMatrix/ClauseMatrix';
import { TemplateLibrary } from './components/templates/TemplateLibrary';
import { AgentSuite } from './components/agents/AgentSuite';
import { Settings } from './components/settings/Settings';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useProjects } from './hooks/useProjects';
import { useClauses } from './hooks/useClauses';
import { Project, Clause, Template } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('portfolio');
  const [dealEngineTab, setDealEngineTab] = useState(0);
  const [dealEngineType, setDealEngineType] = useState<string | undefined>();

  const { projects, loading, addProject } = useProjects();
  const { clauses: allClauses } = useClauses(projects[0]?.id);

  // Aggregate clauses from mock data for portfolio chart
  const portfolioClauses: Clause[] = allClauses;

  function handleProjectClick(project: Project) {
    setCurrentView('projects');
  }

  function handleAddProject(project: Omit<Project, 'id'>) {
    addProject(project);
  }

  function handleClausesGenerated(clauses: Clause[], projectId: string) {
    // In a full implementation this would persist to Firebase
    console.log('Generated clauses:', clauses.length, 'for project:', projectId);
  }

  function handleUseTemplate(template: Template) {
    setDealEngineTab(1);
    setDealEngineType(template.name);
    setCurrentView('dealEngine');
  }

  const viewTitles: Record<View, string> = {
    portfolio: 'Portfolio Dashboard',
    projects: 'Projects',
    dealEngine: 'Deal Engine',
    clauseMatrix: 'Clause Matrix',
    templates: 'Template Library',
    agents: 'Agent Suite',
    settings: 'Settings',
  };

  function renderView() {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    switch (currentView) {
      case 'portfolio':
        return (
          <PortfolioDashboard
            projects={projects}
            allClauses={portfolioClauses}
            onProjectClick={handleProjectClick}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            onAddProject={handleAddProject}
            onGoToDealEngine={() => setCurrentView('dealEngine')}
            onGoToClauseMatrix={() => setCurrentView('clauseMatrix')}
          />
        );
      case 'dealEngine':
        return (
          <DealEngine
            projects={projects}
            onClausesGenerated={handleClausesGenerated}
            initialTab={dealEngineTab}
            initialDealType={dealEngineType}
          />
        );
      case 'clauseMatrix':
        return <ClauseMatrix projects={projects} />;
      case 'templates':
        return <TemplateLibrary onUseTemplate={handleUseTemplate} />;
      case 'agents':
        return <AgentSuite projects={projects} />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  }

  return (
    <Layout
      currentView={currentView}
      onViewChange={(view) => {
        setCurrentView(view);
        if (view !== 'dealEngine') {
          setDealEngineTab(0);
          setDealEngineType(undefined);
        }
      }}
      title={viewTitles[currentView]}
    >
      {renderView()}
    </Layout>
  );
}
