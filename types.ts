export type Component = {
  id: string;
  created_at: string;
  email: string | null;
  title: string;
  figma_url: string | null;
  description: string | null;
  created_by: string;
  design_system: string;
  documentation: string[];
  thumbnail_url: string | null;
  nodeId: string;
}[];

export type DesignSystemData = {
  id: string;
  created_at: string;
  title: string;
  created_by: string;
  description: string | null;
  figma_file_key: string;
  theme: string;
}[];

export type DesignSystem = {
  error: string | null;
  data: {
    id: string;
    created_at: string;
    title: string;
    created_by: string;
    description: string | null;
    figma_file_key: string;
    theme: string;
  };
  count: string | null;
  status: number;
  statusText: string;
};

export type DesignSystemProps = {
  data: Component;
  designSystem: DesignSystem;
};
