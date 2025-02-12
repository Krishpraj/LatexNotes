export interface Page {
  id: string;
  title: string;
  latex: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  pages: Page[];
  createdAt: string;
}
