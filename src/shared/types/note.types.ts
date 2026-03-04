export interface Note {
  id: string;
  content: string; // BlockNote JSON string
  title: string; // Derived from first block, or "Untitled Note"
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tags: string[];
  projectId: string;
}
