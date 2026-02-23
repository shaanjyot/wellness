'use client';

import { useEffect } from 'react';
import { Render } from "@puckeditor/core";
import { config } from "@/lib/puck-config";

interface PuckRendererProps {
  data: any;
}

export default function PuckRenderer({ data }: PuckRendererProps) {
  useEffect(() => {
    if (data?.root) {
      if (data.root.title) {
        document.title = data.root.title;
      }

      if (data.root.description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.root.description);
        }
      }

      if (data.root.keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', data.root.keywords);
        } else {
          const newKeywords = document.createElement('meta');
          newKeywords.name = 'keywords';
          newKeywords.content = data.root.keywords;
          document.head.appendChild(newKeywords);
        }
      }
    }
  }, [data]);

  if (!data || !data.content) {
    return null;
  }

  return <Render config={config} data={data} />;
}
