import { useState } from 'react';
import { PlusCircle, FileText, Edit2, Download, Plus, Trash2, MoreVertical, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Project, Page } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ui/theme-provider';

interface ProjectSidebarProps {
  projects: Project[];
  currentProject?: Project;
  currentPage?: Page;
  onSelectProject: (project: Project) => void;
  onSelectPage: (project: Project, page: Page) => void;
  onCreateProject: (name: string) => void;
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
  onExportProject,
  onCreatePage,
  onDeleteProject,
  onDeletePage,
  onRenameProject,
  onRenamePage,
}: ProjectSidebarProps) {
  const { theme } = useTheme();
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
    <div className={`w-72 h-full ${theme === 'dark' ? 'bg-black' : 'bg-white'} flex flex-col`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        <h2 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Your Projects</h2>
        
        {!showNewProjectInput ? (
          <button
            onClick={() => setShowNewProjectInput(true)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                      ${theme === 'dark' 
                        ? 'bg-white/5 hover:bg-white/10 text-white' 
                        : 'bg-black/5 hover:bg-black/10 text-black'}
                      transition-all`
            }
          >
            <span className="font-medium">New Project</span>
            <PlusCircle className="h-5 w-5" />
          </button>
        ) : (
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className={`mb-3 ${theme === 'dark' 
                ? 'bg-white/10 border-white/10 text-white' 
                : 'bg-white border-black/10 text-black'}`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateProject();
                if (e.key === 'Escape') setShowNewProjectInput(false);
              }}
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className={`flex-1 rounded-lg ${theme === 'dark' 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'}`}
                onClick={handleCreateProject}
              >
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="rounded-lg"
                onClick={() => setShowNewProjectInput(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-auto flex-1 p-4 space-y-3">
        {projects.length === 0 ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
            No projects yet. Create your first project to get started.
          </div>
        ) : projects.map((project) => (
          <div 
            key={project.id} 
            className={`
              rounded-xl transition-all
              ${currentProject?.id === project.id 
                ? theme === 'dark' 
                  ? 'bg-white/10 ring-1 ring-white/20' 
                  : 'bg-black/5 ring-1 ring-black/10' 
                : theme === 'dark'
                  ? 'hover:bg-white/5' 
                  : 'hover:bg-black/5'
              }
            `}
          >
            <div className="p-3">
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
                  className={`w-full px-3 py-2 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-white border-white/20' 
                      : 'bg-white text-black border-black/20'
                  }`}
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    className={`
                      flex items-center gap-2 px-2 py-1 rounded-lg
                      ${currentProject?.id === project.id 
                        ? theme === 'dark' ? 'text-white' : 'text-black font-medium' 
                        : theme === 'dark' ? 'text-white/80' : 'text-black/80'
                      }
                      hover:${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors
                    `}
                    onClick={() => onSelectProject(project)}
                  >
                    <FolderOpen className={`h-4 w-4 ${currentProject?.id === project.id ? 'opacity-100' : 'opacity-70'}`} />
                    <span className="font-medium">{project.name}</span>
                  </button>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename('project', project.id, project.name);
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem 
                          onClick={() => onCreatePage(project.id)}
                          className="rounded-lg cursor-pointer"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Page
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onExportProject(project)}
                          className="rounded-lg cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteProject(project.id)}
                          className={`text-red-400 hover:text-red-300 rounded-lg cursor-pointer`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}

              {project.pages.length > 0 && (
                <div className="mt-2 space-y-1">
                  {project.pages.map((page) => (
                    <div
                      key={page.id}
                      className={`
                        flex items-center justify-between px-2 py-2 rounded-lg
                        ${currentPage?.id === page.id 
                          ? theme === 'dark' 
                            ? 'bg-white/15' 
                            : 'bg-black/10' 
                          : ''}
                        hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}
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
                          className={`w-full px-3 py-1.5 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-white/10 text-white border-white/20' 
                              : 'bg-white text-black border-black/20'
                          }`}
                          autoFocus
                        />
                      ) : (
                        <>
                          <button
                            className={`
                              flex-1 text-left flex items-center gap-2 py-1 px-2 rounded-md
                              ${currentPage?.id === page.id 
                                ? theme === 'dark' ? 'text-white' : 'text-black' 
                                : theme === 'dark' ? 'text-white/70' : 'text-black/70'}
                            `}
                            onClick={() => onSelectPage(project, page)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate">{page.title}</span>
                          </button>
                          <div className="flex items-center opacity-80 hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 rounded-full"
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
                              className={`h-7 w-7 rounded-full ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
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
          </div>
        ))}
      </div>
    </div>
  );
}
