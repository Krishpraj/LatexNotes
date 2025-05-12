import { useState, useEffect } from 'react';
import { Plus, Pencil, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import type { Project } from '@/types';
import { useTheme } from './ui/theme-provider';

interface ProjectViewProps {
  project: Project;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
}

export function ProjectView({ project, onUpdateProject }: ProjectViewProps) {
  const { theme } = useTheme();
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(project.description || '');
  const [notesValue, setNotesValue] = useState(project.notes || '');
  const [showNotesEditor, setShowNotesEditor] = useState(Boolean(project.notes && project.notes.trim().length > 0));
  const [unsavedNotesChanges, setUnsavedNotesChanges] = useState(false);
  
  // Update local state when the project prop changes
  useEffect(() => {
    setDescriptionValue(project.description || '');
    setNotesValue(project.notes || '');
    setShowNotesEditor(Boolean(project.notes && project.notes.trim().length > 0));
    setUnsavedNotesChanges(false);
  }, [project]);

  // Create more explicit handling functions for description and notes updates
  const handleDescriptionSave = () => {
    const trimmedDescription = descriptionValue.trim();
    // Update both local state and parent state
    setDescriptionValue(trimmedDescription);
    onUpdateProject(project.id, { description: trimmedDescription });
    setEditingDescription(false);
  };

  const handleNotesChange = (newValue: string) => {
    // Only update local state when typing
    setNotesValue(newValue);
    setUnsavedNotesChanges(true);
  };

  const handleNotesSave = () => {
    // Update parent state only when explicitly saving
    onUpdateProject(project.id, { notes: notesValue });
    setUnsavedNotesChanges(false);
  };

  // Explicitly check for content with proper string handling
  const hasDescription = project.description ? project.description.trim().length > 0 : false;
  const hasNotes = project.notes ? project.notes.trim().length > 0 : false;

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{project.name}</h2>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>Description</span>
            {hasDescription && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full"
                onClick={() => setEditingDescription(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          {editingDescription ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white focus:border-white/30' 
                    : 'bg-black/5 border-black/10 text-black focus:border-black/30'
                }`}
                placeholder="Add project description..."
                autoFocus
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleDescriptionSave();
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-lg text-sm"
                  onClick={() => {
                    setDescriptionValue(project.description || '');
                    setEditingDescription(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className={`rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'bg-white hover:bg-white/90 text-black'
                      : 'bg-black hover:bg-black/90 text-white'
                  }`}
                  onClick={handleDescriptionSave}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {hasDescription ? (
                <div className={`rounded-lg px-4 py-3 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-black/5 border border-black/10'
                }`}>
                  <p className={`${
                    theme === 'dark' ? 'text-white/80' : 'text-black/80'
                  } text-sm leading-relaxed whitespace-pre-wrap`}>
                    {project.description}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setEditingDescription(true)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-4 rounded-lg text-sm border border-dashed ${
                    theme === 'dark'
                      ? 'bg-white/2 border-white/10 hover:bg-white/5 hover:border-white/20 text-white/60'
                      : 'bg-black/2 border-black/10 hover:bg-black/5 hover:border-black/20 text-black/60'
                  } transition-colors`}
                >
                  <Plus className="h-4 w-4" />
                  Add project description
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`mb-6 pb-3 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        <div className="flex items-center justify-between text-sm">
          <span className={`${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>{project.pages.length} pages</span>
          <span className={`${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className={`space-y-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
            Notes
          </label>
          <div className="flex items-center gap-2">
            {showNotesEditor && unsavedNotesChanges && (
              <span className={`text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                Unsaved changes
              </span>
            )}
            {showNotesEditor && (
              <>
                <Button
                  variant={unsavedNotesChanges ? "default" : "outline"}
                  size="sm"
                  className={`h-8 px-3 rounded text-xs ${
                    unsavedNotesChanges && theme === 'dark' 
                      ? 'bg-white text-black hover:bg-white/90'
                      : unsavedNotesChanges 
                      ? 'bg-black text-white hover:bg-black/90'
                      : ''
                  }`}
                  onClick={handleNotesSave}
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded text-xs"
                  onClick={() => {
                    if (unsavedNotesChanges) {
                      if (confirm("You have unsaved changes. Close without saving?")) {
                        setNotesValue(project.notes || '');
                        setShowNotesEditor(Boolean(project.notes && project.notes.trim().length > 0));
                        setUnsavedNotesChanges(false);
                      }
                    } else {
                      setShowNotesEditor(false);
                    }
                  }}
                >
                  Close Editor
                </Button>
              </>
            )}
          </div>
        </div>
        
        {showNotesEditor ? (
          <div className="space-y-4">
            <Textarea
              value={notesValue}
              onChange={(e) => {
                handleNotesChange(e.target.value);
              }}
              placeholder="Add notes about your project..."
              className={`min-h-[250px] rounded-lg resize-none border notes-textarea ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 focus:border-white/30 text-white/80' 
                  : 'bg-black/5 border-black/10 focus:border-black/30 text-black/80'
              } p-4`}
              autoFocus={!hasNotes}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleNotesSave();
                }
              }}
            />
            {unsavedNotesChanges && (
              <div className="flex justify-end mt-2">
                <p className="text-xs text-muted-foreground">Press Ctrl+Enter to save</p>
              </div>
            )}
          </div>
        ) : (
          <div className={`min-h-[120px] flex items-center justify-center border border-dashed rounded-lg ${
            theme === 'dark'
              ? 'bg-white/2 border-white/10 hover:border-white/20 hover:bg-white/5'
              : 'bg-black/2 border-black/10 hover:border-black/20 hover:bg-black/5'
          } cursor-pointer transition-colors`}
          onClick={() => {
            setShowNotesEditor(true);
            
            // Focus on the textarea after it's rendered
            setTimeout(() => {
              const textarea = document.querySelector('.notes-textarea');
              if (textarea) {
                (textarea as HTMLTextAreaElement).focus();
              }
            }, 100);
          }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Plus className={`h-4 w-4 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`} />
              <span className={theme === 'dark' ? 'text-white/60' : 'text-black/60'}>Add notes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
