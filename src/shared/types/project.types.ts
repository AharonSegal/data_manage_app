/**
 * project.types.ts — TypeScript types for project entities.
 * Reserved for future use when project metadata is stored in Firestore.
 */

export type ProjectStatus = 'active' | 'inactive' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}
