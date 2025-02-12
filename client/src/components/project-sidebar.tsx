import { useState } from 'react';
import { Plus, FileText, Edit2, Download, Check } from 'lucide-react';
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
}: ProjectSidebarProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName);
      setNewProjectName('');
    }
  };

  return (
    <div className="w-64 border-r border-gray-800 bg-gray-900/50 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button variant="ghost" size="sm" onClick={() => setNewProjectName('')}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project..."
            className="h-8"
          />
          <Button size="sm" onClick={handleCreateProject}>Add</Button>
        </div>

        <div className="space-y-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`p-2 cursor-pointer hover:bg-gray-800/50 ${
                currentProject?.id === project.id ? 'bg-gray-800/50' : ''
              }`}
              onClick={() => onSelectProject(project)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{project.name}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportProject(project);
                    }}
                    title="Export project"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {project.pages.length > 0 && (
                <div className="mt-2 pl-4 space-y-1">
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
