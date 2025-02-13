import { useState } from 'react';
import { PlusCircle, FileText, Edit2, Download, Check, Plus, Trash2, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import type { Project, Page } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  onDeleteProject: (projectId: string) => void;
  onDeletePage: (projectId: string, pageId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
  onRenamePage: (projectId: string, pageId: string, newName: string) => void;
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
  onDeleteProject,
  onDeletePage,
  onRenameProject,
  onRenamePage,
}: ProjectSidebarProps) {
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName);
      setNewProjectName('');
      setShowNewProjectInput(false);
    }
  };

  const handleStartRename = (type: 'project' | 'page', id: string, currentName: string) => {
    setEditValue(currentName);
    if (type === 'project') {
      setEditingProjectId(id);
      setEditingPageId(null);
    } else {
      setEditingPageId(id);
      setEditingProjectId(null);
    }
  };

  const handleFinishRename = (type: 'project' | 'page', projectId: string, pageId?: string) => {
    if (editValue.trim()) {
      if (type === 'project') {
        onRenameProject(projectId, editValue.trim());
      } else if (pageId) {
        onRenamePage(projectId, pageId, editValue.trim());
      }
    }
    setEditingProjectId(null);
    setEditingPageId(null);
    setEditValue('');
  };

  return (
    <div className="w-72 h-full bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/30">
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

        <div className="overflow-auto flex-1 py-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`
                group px-4 mb-4 rounded-lg
                ${currentProject?.id === project.id ? 'bg-blue-500/10' : ''}
              `}
            >
              <div className="flex items-center justify-between p-2">
                {editingProjectId === project.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleFinishRename('project', project.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename('project', project.id);
                      if (e.key === 'Escape') setEditingProjectId(null);
                    }}
                    className="bg-gray-800/50 border-0 rounded px-2 py-1 text-sm text-gray-100 w-full"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <button
                      className={`
                        flex-1 text-left text-sm font-medium
                        ${currentProject?.id === project.id ? 'text-blue-400' : 'text-gray-300'}
                        hover:text-blue-400 transition-colors
                      `}
                      onClick={() => onSelectProject(project)}
                    >
                      {project.name}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename('project', project.id, project.name);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onCreatePage(project.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Page
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExportProject(project)}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteProject(project.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
              </div>

              {project.pages.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {project.pages.map((page) => (
                    <div
                      key={page.id}
                      className={`
                        group/page flex items-center justify-between p-2 rounded-md
                        ${currentPage?.id === page.id ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'}
                        transition-colors
                      `}
                    >
                      {editingPageId === page.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleFinishRename('page', project.id, page.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleFinishRename('page', project.id, page.id);
                            if (e.key === 'Escape') setEditingPageId(null);
                          }}
                          className="bg-gray-800/50 border-0 rounded px-2 py-1 text-sm text-gray-100 w-full"
                          autoFocus
                        />
                      ) : (
                        <>
                          <button
                            className="flex-1 text-left text-sm"
                            onClick={() => onSelectPage(project, page)}
                          >
                            <span className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {page.title}
                            </span>
                          </button>
                          <div className="flex items-center gap-1 opacity-0 group-hover/page:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartRename('page', page.id, page.title);
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 text-red-400 hover:text-red-300"
                              onClick={() => onDeletePage(project.id, page.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
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
  );
}
