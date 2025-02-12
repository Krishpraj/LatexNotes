import { useState } from 'react';
import { PlusCircle, FileText, Edit2, Download, Check, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import type { Project, Page } from '@/types';

interface ProjectSidebarProps {
  projects: Project[];
  currentProject?: Project;
  currentPage?: Page;
  onSelectProject: (project: Project) => void;
  onSelectPage: (project: Project, page: Page) => void;
  onCreateProject: (name: string) => void;
  onUpdatePage: (projectId: string, pageId: string, newTitle: string) => void;
  onExportProject: (project: Project) => void;
  onCreatePage: (projectId: string) => void;
}

export function ProjectSidebar({
  projects,
  currentProject,
  currentPage,
  onSelectProject,
  onSelectPage,
  onCreateProject,
  onUpdatePage,
  onExportProject,
  onCreatePage,
}: ProjectSidebarProps) {
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName);
      setNewProjectName('');
      setShowNewProjectInput(false);
    }
  };

  return (
    <div className="w-72 border-r border-gray-800/40 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-800/40">
          {!showNewProjectInput ? (
            <button
              onClick={() => setShowNewProjectInput(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md 
                         text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
            >
              <span className="text-sm font-medium">New Project</span>
              <PlusCircle className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name..."
                className="h-9 bg-gray-800/50 border-0"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateProject();
                  if (e.key === 'Escape') setShowNewProjectInput(false);
                }}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCreateProject}
                >
                  Create
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowNewProjectInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-auto flex-1 p-4">
          <div className="space-y-1">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`group rounded-md overflow-hidden ${
                  currentProject?.id === project.id ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <button
                    className="flex-1 text-left flex items-center text-sm font-medium text-gray-300 hover:text-gray-100"
                    onClick={() => onSelectProject(project)}
                  >
                    <span className={currentProject?.id === project.id ? 'text-blue-500' : ''}>
                      {project.name}
                    </span>
                    {project.description && (
                      <span className="ml-2 text-xs text-gray-500 truncate">
                        {project.description}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onCreatePage(project.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportProject(project);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {project.pages.length > 0 && (
                  <div className="ml-3 mb-2 space-y-1">
                    {project.pages.map((page) => (
                      <div
                        key={page.id}
                        className={`flex items-center justify-between p-1 rounded text-sm cursor-pointer hover:bg-gray-700/50 ${
                          currentPage?.id === page.id ? 'bg-gray-700/50 text-blue-400' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPage(project, page);
                        }}
                      >
                        {editingPage === page.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-6 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onUpdatePage(project.id, page.id, editValue);
                                  setEditingPage(null);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                onUpdatePage(project.id, page.id, editValue);
                                setEditingPage(null);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-2 flex-1"
                            onClick={() => onSelectPage(project, page)}
                          >
                            <FileText className="h-4 w-4" />
                            <span>{page.title}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPage(page.id);
                                setEditValue(page.title);
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
