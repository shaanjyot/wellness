'use client';

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { config } from "@/lib/puck-config";

interface PuckEditorProps {
  data: any;
  onPublish: (data: any) => void;
}

const defaultData = {
  content: [],
  root: { props: { title: "" } }
};

export default function PuckEditor({ data, onPublish }: PuckEditorProps) {
  return (
    <div className="puck-editor-outer-container" style={{ height: '800px', width: '100%', position: 'relative', overflow: 'visible' }}>
      <Puck
        config={config}
        data={data || defaultData}
        onPublish={onPublish}
      />
    </div>
  );
}
