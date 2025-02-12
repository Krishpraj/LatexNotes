import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import type { Project } from '@/types';

interface ProjectViewProps {
  project: Project;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
}

export function ProjectView({ project, onUpdateProject }: ProjectViewProps) {
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(project.description);
  const [notes, setNotes] = useState(project.notes);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{project.name}</h2>
        <div className="mt-2">
          {editingDescription ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded px-3 py-1 text-sm"
                placeholder="Add project description..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateProject(project.id, { description: descriptionValue });
                    setEditingDescription(false);
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  onUpdateProject(project.id, { description: descriptionValue });
                  setEditingDescription(false);
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="group flex items-center gap-2">
              <p className="text-gray-400 text-sm">
                {project.description || 'No description'}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-6 w-6"
                onClick={() => setEditingDescription(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card className="bg-gray-900/50 border-gray-800/50">
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Project Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              onUpdateProject(project.id, { notes: e.target.value });
            }}
            placeholder="Add notes about your project..."
            className="min-h-[200px] bg-gray-800/50 border-gray-700"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{project.pages.length} pages</span>
        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
